import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Home } from '@/pages/home';
import { AboutPage, ChronicleTagPage, ChroniclesPage, ContactPage, ForgotPasswordPage, LegalPage, LoginPage, PropertyDetail, ResetPasswordPage, SearchPage, SignupPage } from '@/pages/app-pages';
import { UserDashboard } from '@/pages/user-dashboard';
import { AdminDashboard } from '@/pages/admin-dashboard';
import { SuperAdminDashboard } from '@/pages/superadmin-dashboard';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        {/* Public site */}
        <Route path="/" component={Home} />
        <Route path="/search" component={SearchPage} />
        <Route path="/pg/:slug" component={PropertyDetail} />
        <Route path="/chronicles" component={ChroniclesPage} />
        <Route path="/chronicles/:tag" component={ChronicleTagPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/legal/terms"><LegalPage kind="terms" /></Route>
        <Route path="/legal/privacy"><LegalPage kind="privacy" /></Route>
        <Route path="/legal/data-deletion"><LegalPage kind="deletion" /></Route>

        {/* Auth */}
        <Route path="/auth/signup" component={SignupPage} />
        <Route path="/auth/register" component={SignupPage} />
        <Route path="/auth/login" component={LoginPage} />
        <Route path="/auth/sign-in" component={LoginPage} />
        <Route path="/auth/forgot-password" component={ForgotPasswordPage} />
        <Route path="/auth/reset-password" component={ResetPasswordPage} />

        {/* Tenant Dashboard (/user/*) */}
        <Route path="/user/home" component={UserDashboard} />
        <Route path="/user/room" component={UserDashboard} />
        <Route path="/user/water" component={UserDashboard} />
        <Route path="/user/electricity" component={UserDashboard} />
        <Route path="/user/food" component={UserDashboard} />
        <Route path="/user/wifi" component={UserDashboard} />
        <Route path="/user/amenities" component={UserDashboard} />
        <Route path="/user/issues/new" component={UserDashboard} />
        <Route path="/user/issues/:id" component={UserDashboard} />
        <Route path="/user/issues" component={UserDashboard} />
        <Route path="/user/notices" component={UserDashboard} />
        <Route path="/user/payments/agreement" component={UserDashboard} />
        <Route path="/user/payments" component={UserDashboard} />
        <Route path="/user/profile/delete-account" component={UserDashboard} />
        <Route path="/user/profile" component={UserDashboard} />
        <Route path="/user" component={UserDashboard} />

        {/* Owner Dashboard (/admin/*) */}
        <Route path="/admin/overview" component={AdminDashboard} />
        <Route path="/admin/settings/modules" component={AdminDashboard} />
        <Route path="/admin/settings" component={AdminDashboard} />
        <Route path="/admin/rooms/:id" component={AdminDashboard} />
        <Route path="/admin/rooms" component={AdminDashboard} />
        <Route path="/admin/water" component={AdminDashboard} />
        <Route path="/admin/electricity" component={AdminDashboard} />
        <Route path="/admin/food" component={AdminDashboard} />
        <Route path="/admin/staff-attendance" component={AdminDashboard} />
        <Route path="/admin/staff" component={AdminDashboard} />
        <Route path="/admin/visitor-log" component={AdminDashboard} />
        <Route path="/admin/furniture" component={AdminDashboard} />
        <Route path="/admin/assets" component={AdminDashboard} />
        <Route path="/admin/wifi" component={AdminDashboard} />
        <Route path="/admin/amenities" component={AdminDashboard} />
        <Route path="/admin/issues/:id" component={AdminDashboard} />
        <Route path="/admin/issues" component={AdminDashboard} />
        <Route path="/admin/notices/new" component={AdminDashboard} />
        <Route path="/admin/notices" component={AdminDashboard} />
        <Route path="/admin/payments" component={AdminDashboard} />
        <Route path="/admin/agreements" component={AdminDashboard} />
        <Route path="/admin/support-tickets/new" component={AdminDashboard} />
        <Route path="/admin/support-tickets" component={AdminDashboard} />
        <Route path="/admin/properties" component={AdminDashboard} />
        <Route path="/admin/tenants/:id" component={AdminDashboard} />
        <Route path="/admin/tenants" component={AdminDashboard} />
        <Route path="/admin" component={AdminDashboard} />

        {/* Super Admin Dashboard (/superadmin/*) */}
        <Route path="/superadmin/overview" component={SuperAdminDashboard} />
        <Route path="/superadmin/listings/new" component={SuperAdminDashboard} />
        <Route path="/superadmin/listings/:id/edit" component={SuperAdminDashboard} />
        <Route path="/superadmin/listings" component={SuperAdminDashboard} />
        <Route path="/superadmin/users/:id" component={SuperAdminDashboard} />
        <Route path="/superadmin/users" component={SuperAdminDashboard} />
        <Route path="/superadmin/support-tickets" component={SuperAdminDashboard} />
        <Route path="/superadmin/billing" component={SuperAdminDashboard} />
        <Route path="/superadmin/chronicles-cms/new" component={SuperAdminDashboard} />
        <Route path="/superadmin/chronicles-cms" component={SuperAdminDashboard} />
        <Route path="/superadmin/legal-docs" component={SuperAdminDashboard} />
        <Route path="/superadmin/analytics" component={SuperAdminDashboard} />
        <Route path="/superadmin" component={SuperAdminDashboard} />

        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
