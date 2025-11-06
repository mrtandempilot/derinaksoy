import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './contexts/LanguageContext';
import { Index } from './pages/Index';
import { Admin } from './pages/Admin';
import { AdminTours } from './pages/AdminTours';
import { AdminCalendar } from './pages/AdminCalendar';
import { AdminReviews } from './pages/AdminReviews';
import { PublicReview } from './pages/PublicReview';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/tours" element={<AdminTours />} />
              <Route path="/admin/calendar" element={<AdminCalendar />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/review/:bookingId" element={<PublicReview />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
