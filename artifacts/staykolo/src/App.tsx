import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { FutureScreen, Home } from '@/pages/home';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/search"><FutureScreen title="Search is coming in Phase 2" /></Route>
        <Route path="/pg/:slug"><FutureScreen title="Property profiles are coming in Phase 2" /></Route>
        <Route path="/chronicles"><FutureScreen title="Chronicles are coming in Phase 2" /></Route>
        <Route path="/about"><FutureScreen title="How Staykolo works is coming in Phase 2" /></Route>
        <Route path="/contact"><FutureScreen title="The property team contact flow is coming in Phase 2" /></Route>
        <Route path="/auth/:rest*"><FutureScreen title="Account access is coming in Phase 2" /></Route>
        <Route path="/user/:rest*"><FutureScreen title="Your Staykolo space is coming in Phase 2" /></Route>
        <Route path="/admin/:rest*"><FutureScreen title="Property operations tools are coming in Phase 2" /></Route>
        <Route path="/superadmin/:rest*"><FutureScreen title="Super Admin tools are coming in a future phase" /></Route>
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
