import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiError } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SocialButtons } from '@/components/SocialButtons';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setBusy(true);
    try {
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sp-base px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="rounded-lg bg-sp-primary p-2"><Rocket size={20} className="text-white" /></div>
          <span className="font-heading text-xl font-bold">SellPilot AI</span>
        </Link>
        <Card>
          <CardContent className="p-6">
            <h1 className="font-heading text-xl font-semibold">Create your account</h1>
            <p className="mt-1 text-sm text-sp-text-secondary">Free to start — no card required</p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Seller" />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
              </div>
              <div>
                <Label htmlFor="confirm">Confirm password *</Label>
                <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
              </div>
              {error && <p className="text-sm text-sp-danger">{error}</p>}
              <Button type="submit" className="w-full" disabled={busy}>{busy ? 'Creating account…' : 'Sign up'}</Button>
            </form>
            <SocialButtons />
            <p className="mt-5 text-center text-sm text-sp-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-sp-primary-light hover:underline">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
