import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bot, CalendarClock, Check, LineChart, MessagesSquare, Rocket, Sparkles, Upload, Users,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const FEATURES = [
  { icon: Sparkles, title: 'AI Listing Generation', text: 'One upload becomes 12 platform-optimized listings — titles, descriptions, hashtags, and video scripts.' },
  { icon: Upload, title: 'Multi-Platform Publishing', text: 'Facebook Marketplace, Groups, Craigslist, eBay, OfferUp, Instagram and TikTok from one dashboard.' },
  { icon: CalendarClock, title: 'Smart Scheduling', text: 'Queue posts for peak buyer hours with a full calendar view of everything going live.' },
  { icon: Users, title: 'Lead CRM', text: 'Every buyer message becomes a tracked lead with follow-up reminders and a kanban pipeline.' },
  { icon: MessagesSquare, title: 'DM & Follow-up Templates', text: 'AI-written reply templates for lowballers, hold requests, delivery questions and no-shows.' },
  { icon: LineChart, title: 'Analytics', text: 'Revenue by platform, conversion funnels and top products — know exactly what sells where.' },
];

const STEPS = [
  { n: '01', title: 'Upload your product', text: 'Add photos, specs, condition and pricing. Takes under a minute.' },
  { n: '02', title: 'AI writes everything', text: 'Optimized listings for every platform, pricing strategy, banners and image ideas.' },
  { n: '03', title: 'Review, schedule, sell', text: 'Edit anything, pick platforms, publish now or schedule — then track leads to close.' },
];

const PLANS = [
  { name: 'Starter', price: '$0', period: '/mo', features: ['5 products', '2 platforms', 'Basic AI listings', 'Community support'], cta: 'Start free' },
  { name: 'Pro', price: '$29', period: '/mo', popular: true, features: ['Unlimited products', 'All 7 platforms', 'Full AI suite + Turkish community posts', 'Lead CRM & scheduling', 'Priority support'], cta: 'Start 14-day trial' },
  { name: 'Team', price: '$79', period: '/mo', features: ['Everything in Pro', '5 team seats', 'API access', 'Custom templates', 'Dedicated support'], cta: 'Contact sales' },
];

const PLATFORMS = ['Facebook', 'Craigslist', 'eBay', 'OfferUp', 'Instagram', 'TikTok'];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-sp-base">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(91,110,245,0.18),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-sp-primary/40 bg-sp-primary/10 px-4 py-1.5 text-xs font-medium text-sp-primary-light">
              <Sparkles size={13} /> Powered by AI copywriting
            </span>
            <h1 className="mx-auto max-w-3xl font-heading text-4xl font-bold leading-tight md:text-6xl">
              One Product. One Upload.{' '}
              <span className="bg-gradient-to-r from-sp-primary-light to-sp-success bg-clip-text text-transparent">
                Every Marketplace.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-sp-text-secondary">
              Upload once and let AI write optimized listings for Facebook, Craigslist, eBay, OfferUp, Instagram and TikTok — then manage every lead from one dashboard.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/register"><Button size="lg">Get started free</Button></Link>
              <a href="#how-it-works"><Button size="lg" variant="secondary">See how it works</Button></a>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-16 max-w-4xl rounded-xl border border-sp-active/60 bg-sp-elevated p-3 shadow-2xl"
          >
            <div className="rounded-lg bg-sp-sidebar p-6">
              <div className="flex items-center gap-2 pb-4">
                <span className="h-3 w-3 rounded-full bg-sp-danger/70" />
                <span className="h-3 w-3 rounded-full bg-sp-warning/70" />
                <span className="h-3 w-3 rounded-full bg-sp-success/70" />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {['Facebook Marketplace', 'eBay Listing', 'TikTok Script'].map((p, i) => (
                  <div key={p} className="rounded-lg border border-sp-active/50 bg-sp-elevated p-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-medium text-sp-primary-light">
                      <Bot size={13} /> {p}
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="h-2 w-4/5 rounded bg-sp-active" />
                      <div className="h-2 w-full rounded bg-sp-input" />
                      <div className="h-2 w-3/4 rounded bg-sp-input" />
                      <div className="h-2 w-2/3 rounded bg-sp-input" />
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-sp-success/15 px-2 py-0.5 text-[10px] font-medium text-sp-success">
                      <Check size={10} /> Generated {i === 0 ? '· ready to publish' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center font-heading text-3xl font-bold">Everything a multi-platform seller needs</h2>
        <p className="mt-3 text-center text-sp-text-secondary">Stop rewriting the same listing seven times.</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="transition-colors hover:border-sp-primary/50">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-sp-primary/10 p-2.5 text-sp-primary-light">
                  <Icon size={20} />
                </div>
                <h3 className="font-heading text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sp-text-secondary">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-sp-active/30 bg-sp-elevated/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-heading text-3xl font-bold">How it works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="relative">
                <div className="font-mono text-4xl font-bold text-sp-primary/30">{s.n}</div>
                <h3 className="mt-3 font-heading text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-sp-text-secondary">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-sp-text-muted">Publishes to</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {PLATFORMS.map((p) => (
            <span key={p} className="font-heading text-xl font-semibold text-sp-text-secondary/80">{p}</span>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center font-heading text-3xl font-bold">Simple pricing</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={plan.popular ? 'relative border-sp-primary shadow-[0_0_40px_rgba(91,110,245,0.15)]' : ''}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sp-primary px-3 py-1 text-xs font-medium text-white">
                  Most popular
                </span>
              )}
              <CardContent className="p-6">
                <h3 className="font-heading text-lg font-semibold">{plan.name}</h3>
                <div className="mt-3">
                  <span className="font-heading text-4xl font-bold">{plan.price}</span>
                  <span className="text-sp-text-muted">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-sp-text-secondary">
                      <Check size={15} className="mt-0.5 shrink-0 text-sp-success" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="mt-6 block">
                  <Button className="w-full" variant={plan.popular ? 'default' : 'secondary'}>{plan.cta}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sp-active/30 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-sp-text-muted md:flex-row">
          <div className="flex items-center gap-2">
            <Rocket size={15} className="text-sp-primary-light" />
            <span>SellPilot AI © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <a href="#features" className="hover:text-sp-text">Features</a>
            <a href="#pricing" className="hover:text-sp-text">Pricing</a>
            <Link to="/login" className="hover:text-sp-text">Log in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
