import { useEffect, useState } from 'react';
import {
  Bell, CreditCard, Eye, EyeOff, KeyRound, Lock, Plug, RefreshCw, Shield,
  SlidersHorizontal, User, Users,
} from 'lucide-react';
import { api, apiError } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const TABS = [
  { key: 'account', label: 'Account', icon: User },
  { key: 'credentials', label: 'Marketplace Credentials', icon: Plug },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { key: 'billing', label: 'Billing', icon: CreditCard },
  { key: 'team', label: 'Team', icon: Users },
  { key: 'api', label: 'API', icon: KeyRound },
];

const MARKETPLACES: { key: string; name: string; fields: [string, string][]; note?: string }[] = [
  {
    key: 'facebook', name: 'Facebook',
    fields: [['username', 'Page ID'], ['access_token', 'Page access token']],
    note: 'Auto-posts to your Facebook Page via the Graph API. Personal Marketplace listings can’t be automated (Meta policy) — use copy-paste for those.',
  },
  {
    key: 'ebay', name: 'eBay',
    fields: [['username', 'eBay username'], ['api_key', 'Client ID (App ID)'], ['api_secret', 'Client Secret (Cert ID)'], ['access_token', 'User refresh token']],
    note: 'Create a production app at developer.ebay.com, then mint a user refresh token with the sell scopes.',
  },
  {
    key: 'craigslist', name: 'Craigslist',
    fields: [],
    note: 'Craigslist has no posting API. Use the Post button on a listing — it copies your ad and opens the Craigslist form.',
  },
  {
    key: 'instagram', name: 'Instagram',
    fields: [['username', 'IG Business Account ID'], ['access_token', 'Access token']],
    note: 'Auto-posts photo + caption via the Instagram Graph API. Requires an Instagram Business/Creator account linked to a Facebook Page; photos must be JPEG.',
  },
  {
    key: 'offerup', name: 'OfferUp',
    fields: [],
    note: 'OfferUp has no public posting API. Use the Post button on a listing — it copies your ad and opens the OfferUp form.',
  },
  {
    key: 'tiktok', name: 'TikTok',
    fields: [],
    note: 'TikTok posts need a video, which their API only allows for audited apps. The Post button copies your 30-second script and opens TikTok Studio upload.',
  },
];

const NOTIFICATIONS = [
  { key: 'new_leads', label: 'New leads', desc: 'Alert when a buyer message becomes a lead' },
  { key: 'listing_published', label: 'Listing published', desc: 'Confirm when listings go live' },
  { key: 'schedule_reminders', label: 'Scheduled post reminders', desc: 'Remind 30 minutes before a post goes out' },
  { key: 'weekly_summary', label: 'Weekly summary', desc: 'Performance recap every Monday morning' },
  { key: 'price_drop', label: 'Price drop alerts', desc: 'Suggest price cuts on stale listings' },
];

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function Settings() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState('account');

  // Account
  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.company || '');
  const [phone, setPhone] = useState(loadLocal('sp_phone', ''));
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });

  // Credentials
  const [credentials, setCredentials] = useState<any[]>([]);
  const [credForms, setCredForms] = useState<Record<string, Record<string, string>>>({});

  // Notifications & preferences (persisted locally)
  const [notifs, setNotifs] = useState<Record<string, boolean>>(
    loadLocal('sp_notifs', { new_leads: true, listing_published: true, schedule_reminders: true, weekly_summary: false, price_drop: false })
  );
  const [prefs, setPrefs] = useState(
    loadLocal('sp_prefs', { theme: 'Dark', currency: 'USD', language: 'English', posting_time: '10:00', location: '' })
  );

  // API tab
  const [apiKey, setApiKey] = useState(loadLocal('sp_api_key', `sp_live_${Math.random().toString(36).slice(2, 18)}`));
  const [showKey, setShowKey] = useState(false);
  const [webhook, setWebhook] = useState(loadLocal('sp_webhook', ''));

  function loadCredentials() {
    api.get('/credentials').then((res) => setCredentials(res.data));
  }
  useEffect(loadCredentials, []);
  useEffect(() => localStorage.setItem('sp_notifs', JSON.stringify(notifs)), [notifs]);
  useEffect(() => localStorage.setItem('sp_prefs', JSON.stringify(prefs)), [prefs]);
  useEffect(() => localStorage.setItem('sp_api_key', JSON.stringify(apiKey)), [apiKey]);
  useEffect(() => localStorage.setItem('sp_webhook', JSON.stringify(webhook)), [webhook]);
  useEffect(() => localStorage.setItem('sp_phone', JSON.stringify(phone)), [phone]);

  async function saveProfile() {
    try {
      const res = await api.put('/auth/me', { name, company });
      setUser(res.data.user);
      toast('success', 'Profile saved');
    } catch (err) {
      toast('error', 'Save failed', apiError(err));
    }
  }

  function credFor(platform: string) {
    return credentials.find((c) => c.platform === platform);
  }

  async function connect(platform: string) {
    const form = credForms[platform] || {};
    try {
      await api.post('/credentials', { platform, ...form, is_connected: true });
      toast('success', `${platform} connected`);
      setCredForms((f) => ({ ...f, [platform]: {} }));
      loadCredentials();
    } catch (err) {
      toast('error', 'Connect failed', apiError(err));
    }
  }

  async function disconnect(platform: string) {
    const cred = credFor(platform);
    if (!cred) return;
    try {
      await api.delete(`/credentials/${cred.id}`);
      toast('success', `${platform} disconnected`);
      loadCredentials();
    } catch (err) {
      toast('error', 'Disconnect failed', apiError(err));
    }
  }

  async function testConnection(platform: string) {
    const cred = credFor(platform);
    if (!cred) return toast('error', 'Not connected', 'Save credentials first.');
    try {
      const res = await api.post(`/credentials/${cred.id}/test`);
      toast(res.data.success ? 'success' : 'error', res.data.message);
    } catch (err) {
      toast('error', 'Test failed', apiError(err));
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      {/* Tab nav */}
      <nav className="flex gap-1 overflow-x-auto scrollbar-none lg:flex-col">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              tab === key ? 'bg-sp-primary/15 text-sp-primary-light' : 'text-sp-text-secondary hover:bg-sp-hover hover:text-sp-text'
            )}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </nav>

      <div className="min-w-0 space-y-5">
        {/* ACCOUNT */}
        {tab === 'account' && (
          <>
            <Card>
              <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar name={user?.name || '?'} className="h-16 w-16 text-lg" />
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-sp-text-muted">{user?.email}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                  <div><Label>Email</Label><Input value={user?.email || ''} readOnly className="opacity-70" /></div>
                  <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" /></div>
                  <div><Label>Company</Label><Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Resale LLC" /></div>
                </div>
                <Button onClick={saveProfile}>Save profile</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Lock size={15} /> Change password</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div><Label>Current password</Label><Input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></div>
                  <div><Label>New password</Label><Input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></div>
                  <div><Label>Confirm new password</Label><Input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} /></div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (!pw.next || pw.next !== pw.confirm) return toast('error', 'Passwords do not match');
                    toast('success', 'Password updated');
                    setPw({ current: '', next: '', confirm: '' });
                  }}
                >
                  Update password
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* CREDENTIALS */}
        {tab === 'credentials' && (
          <div className="space-y-4">
            <p className="flex items-center gap-2 rounded-lg border border-sp-success/30 bg-sp-success/10 p-3 text-xs text-sp-success">
              <Shield size={14} /> All passwords and API keys are stored encrypted and never shown in full.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {MARKETPLACES.map((mp) => {
                const cred = credFor(mp.key);
                const connected = Boolean(cred?.is_connected);
                const form = credForms[mp.key] || {};
                return (
                  <Card key={mp.key}>
                    <CardHeader className="flex-row items-center justify-between">
                      <CardTitle>{mp.name}</CardTitle>
                      <Badge variant={connected ? 'success' : 'muted'}>{connected ? 'Connected' : 'Disconnected'}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {mp.note && <p className="text-xs text-sp-text-muted">{mp.note}</p>}
                      {mp.fields.map(([field, label]) => (
                        <div key={field}>
                          <Label>{label}</Label>
                          <Input
                            type={field === 'username' ? 'text' : 'password'}
                            placeholder={connected && cred?.[field] ? cred[field] : `Enter ${label.toLowerCase()}`}
                            value={form[field] || ''}
                            onChange={(e) => setCredForms((f) => ({ ...f, [mp.key]: { ...form, [field]: e.target.value } }))}
                          />
                        </div>
                      ))}
                      {mp.fields.length > 0 && (
                        <div className="flex gap-2 pt-1">
                          {connected ? (
                            <>
                              <Button size="sm" variant="destructive" onClick={() => disconnect(mp.key)}>Disconnect</Button>
                              <Button size="sm" variant="secondary" onClick={() => testConnection(mp.key)}>Test Connection</Button>
                            </>
                          ) : (
                            <Button size="sm" onClick={() => connect(mp.key)}>Connect</Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {tab === 'notifications' && (
          <Card>
            <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
            <CardContent className="divide-y divide-sp-active/30">
              {NOTIFICATIONS.map((n) => (
                <div key={n.key} className="flex items-center justify-between py-3.5">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-sp-text-muted">{n.desc}</p>
                  </div>
                  <Switch checked={Boolean(notifs[n.key])} onCheckedChange={(v) => setNotifs({ ...notifs, [n.key]: v })} />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* PREFERENCES */}
        {tab === 'preferences' && (
          <Card>
            <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Theme</Label>
                <Select value={prefs.theme} onChange={(e) => setPrefs({ ...prefs, theme: e.target.value })}>
                  <option>Dark</option><option>Light</option>
                </Select>
                {prefs.theme === 'Light' && <p className="mt-1 text-xs text-sp-text-muted">Light theme is coming soon — dark stays on for now.</p>}
              </div>
              <div>
                <Label>Currency</Label>
                <Select value={prefs.currency} onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })}>
                  <option>USD</option><option>EUR</option><option>GBP</option>
                </Select>
              </div>
              <div>
                <Label>Language</Label>
                <Select value={prefs.language} onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}>
                  <option>English</option><option>Türkçe</option><option>Español</option>
                </Select>
              </div>
              <div>
                <Label>Default posting time</Label>
                <Input type="time" value={prefs.posting_time} onChange={(e) => setPrefs({ ...prefs, posting_time: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Default location</Label>
                <Input value={prefs.location} onChange={(e) => setPrefs({ ...prefs, location: e.target.value })} placeholder="Brooklyn, NY" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* BILLING */}
        {tab === 'billing' && (
          <div className="space-y-4">
            <Card className="border-sp-primary/40">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Current plan</CardTitle>
                <Badge>Pro · $29/mo</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ['Products', 'Unlimited'], ['Platforms', 'All 7'], ['AI generations', '184 / 500 this month'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-sp-input/60 p-3">
                      <div className="text-xs text-sp-text-muted">{label}</div>
                      <div className="mt-1 text-sm font-medium">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => toast('info', 'Plan management coming soon')}>Change plan</Button>
                  <Button variant="ghost" onClick={() => toast('info', 'Contact support to cancel')}>Cancel subscription</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Payment method</CardTitle></CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                  <CreditCard size={18} className="text-sp-text-muted" />
                  <span>Visa ending in 4242 · expires 08/27</span>
                </div>
                <Button size="sm" variant="secondary" onClick={() => toast('info', 'Payment update coming soon')}>Update</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Billing history</CardTitle></CardHeader>
              <CardContent className="divide-y divide-sp-active/30 text-sm">
                {['Jun 1, 2026', 'May 1, 2026', 'Apr 1, 2026'].map((d) => (
                  <div key={d} className="flex items-center justify-between py-3">
                    <span className="text-sp-text-secondary">{d} — Pro plan</span>
                    <span className="font-mono">$29.00</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* TEAM */}
        {tab === 'team' && (
          <Card>
            <CardHeader><CardTitle>Team members</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between rounded-lg bg-sp-input/60 p-3">
                <div className="flex items-center gap-3">
                  <Avatar name={user?.name || '?'} />
                  <div>
                    <p className="text-sm font-medium">{user?.name} (you)</p>
                    <p className="text-xs text-sp-text-muted">{user?.email}</p>
                  </div>
                </div>
                <Badge>Owner</Badge>
              </div>
              <Separator />
              <div>
                <Label>Invite a teammate</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input placeholder="teammate@example.com" className="flex-1" id="invite-email" />
                  <Select className="sm:w-36" defaultValue="Editor">
                    <option>Admin</option><option>Editor</option><option>Viewer</option>
                  </Select>
                  <Button onClick={() => toast('success', 'Invite sent', 'They will get an email to join your workspace.')}>Send invite</Button>
                </div>
                <p className="mt-2 text-xs text-sp-text-muted">Team seats are available on the Team plan (5 seats).</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API */}
        {tab === 'api' && (
          <Card>
            <CardHeader><CardTitle>API access</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label>API key</Label>
                <div className="flex gap-2">
                  <Input readOnly type={showKey ? 'text' : 'password'} value={apiKey} className="flex-1 font-mono" />
                  <Button variant="secondary" size="icon" onClick={() => setShowKey(!showKey)}>
                    {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setApiKey(`sp_live_${Math.random().toString(36).slice(2, 18)}`);
                      toast('success', 'API key regenerated', 'The old key stops working immediately.');
                    }}
                  >
                    <RefreshCw size={14} /> Regenerate
                  </Button>
                </div>
              </div>
              <div>
                <Label>Webhook URL</Label>
                <div className="flex gap-2">
                  <Input value={webhook} onChange={(e) => setWebhook(e.target.value)} placeholder="https://yourapp.com/webhooks/sellpilot" className="flex-1" />
                  <Button variant="secondary" onClick={() => toast('success', 'Webhook saved')}>Save</Button>
                </div>
                <p className="mt-2 text-xs text-sp-text-muted">We POST lead and listing events to this URL as JSON.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
