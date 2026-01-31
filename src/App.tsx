import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ConfigCheck } from './components/ConfigCheck';

const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const TripPage = lazy(() => import('./pages/TripPage').then(m => ({ default: m.TripPage })));
const InvitationPage = lazy(() => import('./pages/InvitationPage').then(m => ({ default: m.InvitationPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Check if required environment variables are configured
const isConfigured = () => {
  const required = [
    import.meta.env.VITE_FIREBASE_API_KEY,
    import.meta.env.VITE_FIREBASE_PROJECT_ID,
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  ];
  
  return required.every(
    (val) => val && val !== 'your_api_key_here' && val !== 'your_project_id' && val !== 'your_google_maps_api_key_here'
  );
};

function App() {
  // Show configuration screen if env variables are not set
  if (!isConfigured()) {
    return <ConfigCheck />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              <Suspense fallback={
                <div className="flex items-center justify-center h-screen">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                  </div>
                </div>
              }>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  {/* Dashboard - accessible to everyone, shows guest trips for non-logged-in users */}
                  <Route path="/dashboard" element={<DashboardPage />} />
                  {/* Trip planning - accessible to everyone */}
                  <Route path="/trip/:tripId" element={<TripPage />} />
                  {/* Invitation acceptance - accessible to everyone */}
                  <Route path="/invite/:invitationId" element={<InvitationPage />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </div>
            <footer className="sticky bottom-0 bg-gray-50 border-t border-gray-200 py-4 px-6 z-10">
              <div className="text-center text-sm text-gray-600">
                © {new Date().getFullYear()} <strong>Kartik Kumar Panday</strong>. All rights reserved.
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
