import { useState } from 'react';
import { useActiveTours } from '../hooks/useTours';
import { Hero } from '../components/Hero';
import { TourCard } from '../components/TourCard';
import { ChatWidget } from '../components/ChatWidget';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ReviewsSection } from '../components/ReviewsSection';
import { ReviewForm } from '../components/ReviewForm';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { Phone, User } from 'lucide-react';
import type { Tour } from '../types';

export function Index() {
  const { data: tours, isLoading } = useActiveTours();
  const { user, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { t } = useLanguage();

  const handleBooking = (tour: Tour) => {
    // Optionally auto-open chat widget with pre-filled message
    // For now, we'll let the user manually open the chat
    console.log('Booking tour:', tour.name);
  };

  const groupedTours = tours?.reduce((acc, tour) => {
    const category = tour.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tour);
    return acc;
  }, {} as Record<string, Tour[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Skywalkers Tours</h1>
          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">{user.email}</span>
                <button
                  onClick={signOut}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                Giriş / Kayıt
              </button>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Hero */}
      <Hero />

      {/* Tours Section */}
      <section id="tours" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            {t('allTours')}
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : groupedTours ? (
            <div className="space-y-12">
              {Object.entries(groupedTours).map(([category, categoryTours]) => (
                <div key={category}>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryTours.map(tour => (
                      <TourCard
                        key={tour.id}
                        tour={tour}
                        onBooking={handleBooking}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              No tours available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Review Form Section */}
      <section id="review-form" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <ReviewForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Skywalkers Tours</h3>
            <p className="text-gray-400">
              Experience the thrill of paragliding and adventure tours in beautiful Ölüdeniz, Turkey.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">Phone: +90 536 461 6674</p>
            <p className="text-gray-400">Email: info@skywalkers-tours.com</p>
            <p className="text-gray-400">Location: Ölüdeniz, Fethiye, Turkey</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                TripAdvisor
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2025 Skywalkers Tours. All rights reserved.</p>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
