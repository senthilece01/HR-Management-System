import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { LeaveProvider } from '@/contexts/LeaveContext';
import Landing from './pages/Landing';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Leaves from './pages/Leaves';
import ApplyLeave from './pages/ApplyLeave';
import WorkFromHome from './pages/WorkFromHome';
import TeamLeaves from './pages/TeamLeaves';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LeaveProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/index" element={<Index />} />
              <Route path="/leaves" element={<Leaves />} />
              <Route path="/apply-leave" element={<ApplyLeave />} />
              <Route path="/work-from-home" element={<WorkFromHome />} />
              <Route path="/team-leaves" element={<TeamLeaves />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LeaveProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;