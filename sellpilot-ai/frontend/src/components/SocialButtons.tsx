import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, apiError } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    google?: any;
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) return resolve();
    const el = document.createElement('script');
    el.src = src;
    el.id = id;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(el);
  });
}

// Google / Facebook sign-in. Buttons only appear for providers whose keys
// are configured on the backend (GOOGLE_CLIENT_ID / FB_APP_ID secrets).
export function SocialButtons() {
  const { setUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [config, setConfig] = useState<{ google: string | null; facebook: string | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const googleDiv = useRef<HTMLDivElement>(null);

  async function finish(provider: string, token: string) {
    setBusy(true);
    try {
      const res = await api.post('/auth/oauth', { provider, token });
      localStorage.setItem('sp_token', res.data.token);
      setUser(res.data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast('error', 'Sign-in failed', apiError(err));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    api.get('/auth/oauth-config').then((res) => setConfig(res.data)).catch(() => setConfig({ google: null, facebook: null }));
  }, []);

  useEffect(() => {
    if (!config?.google || !googleDiv.current) return;
    loadScript('https://accounts.google.com/gsi/client', 'google-gsi')
      .then(() => {
        window.google?.accounts.id.initialize({
          client_id: config.google,
          callback: (resp: any) => resp.credential && finish('google', resp.credential),
        });
        window.google?.accounts.id.renderButton(googleDiv.current, {
          theme: 'filled_black', size: 'large', width: 320, text: 'continue_with',
        });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.google]);

  function facebookLogin() {
    if (!config?.facebook) return;
    loadScript('https://connect.facebook.net/en_US/sdk.js', 'fb-sdk')
      .then(() => {
        if (!window.FB?.__spInit) {
          window.FB.init({ appId: config.facebook, cookie: true, xfbml: false, version: 'v21.0' });
          window.FB.__spInit = true;
        }
        window.FB.login(
          (res: any) => res.authResponse?.accessToken && finish('facebook', res.authResponse.accessToken),
          { scope: 'public_profile,email' }
        );
      })
      .catch(() => toast('error', 'Could not load Facebook sign-in'));
  }

  if (!config || (!config.google && !config.facebook)) return null;

  return (
    <div className="mt-5">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-sp-active/50" />
        <span className="text-xs text-sp-text-muted">or continue with</span>
        <div className="h-px flex-1 bg-sp-active/50" />
      </div>
      <div className="mt-4 flex flex-col items-center gap-2">
        {config.google && <div ref={googleDiv} className={busy ? 'pointer-events-none opacity-60' : ''} />}
        {config.facebook && (
          <Button type="button" variant="secondary" className="w-full max-w-[320px]" disabled={busy} onClick={facebookLogin}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#1877F2"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07z"/></svg>
            Continue with Facebook
          </Button>
        )}
      </div>
    </div>
  );
}
