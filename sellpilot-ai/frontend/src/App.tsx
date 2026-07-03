import { Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireAuth } from '@/hooks/useAuth';
import { ToastProvider } from '@/components/ui/toast';
import { Layout } from '@/components/Layout';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Wizard from '@/pages/Wizard';
import Listings from '@/pages/Listings';
import CalendarPage from '@/pages/Calendar';
import Leads from '@/pages/Leads';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';

function Protected({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <Layout>{children}</Layout>
    </RequireAuth>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/products" element={<Protected><Products /></Protected>} />
          <Route path="/wizard" element={<Protected><Wizard /></Protected>} />
          <Route path="/wizard/:productId" element={<Protected><Wizard /></Protected>} />
          <Route path="/listings" element={<Protected><Listings /></Protected>} />
          <Route path="/calendar" element={<Protected><CalendarPage /></Protected>} />
          <Route path="/leads" element={<Protected><Leads /></Protected>} />
          <Route path="/analytics" element={<Protected><Analytics /></Protected>} />
          <Route path="/settings" element={<Protected><Settings /></Protected>} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}
