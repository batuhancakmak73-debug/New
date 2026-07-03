import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-sp-active/40 bg-sp-base/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-sp-primary p-1.5">
            <Rocket size={18} className="text-white" />
          </div>
          <span className="font-heading text-lg font-bold">SellPilot AI</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-sp-text-secondary md:flex">
          <a href="#features" className="hover:text-sp-text">Features</a>
          <a href="#how-it-works" className="hover:text-sp-text">How it works</a>
          <a href="#pricing" className="hover:text-sp-text">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/dashboard"><Button>Open Dashboard</Button></Link>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost">Log in</Button></Link>
              <Link to="/register"><Button>Sign up</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
