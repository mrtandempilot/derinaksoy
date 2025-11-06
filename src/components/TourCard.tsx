import { Clock, DollarSign } from 'lucide-react';
import type { Tour } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface TourCardProps {
  tour: Tour;
  onBooking: (tour: Tour) => void;
}

export function TourCard({ tour, onBooking }: TourCardProps) {
  const { language, t } = useLanguage();

  const tourName = language === 'tr' && tour.name_tr ? tour.name_tr : tour.name;
  const tourDescription = language === 'tr' && tour.short_description_tr 
    ? tour.short_description_tr 
    : tour.short_description;

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'TRY': return '₺';
      case 'EUR': return '€';
      default: return currency;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {tour.image_url ? (
          <img
            src={tour.image_url}
            alt={tourName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
            <span className="text-white text-lg font-semibold">{tourName}</span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
            {tour.category}
          </span>
        </div>

        {/* Rating */}
        {tour.rating && (
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-md">
            <span className="text-sm font-semibold text-gray-700">
              ⭐ {tour.rating}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{tourName}</h3>
        
        {tourDescription && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {tourDescription}
          </p>
        )}

        {/* Details */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          {tour.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{tour.duration}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold text-gray-800">
              {getCurrencySymbol(tour.currency)}{tour.price_adult}
            </span>
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={() => onBooking(tour)}
          className="w-full py-2 bg-accent text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
        >
          {t('bookNow')}
        </button>
      </div>
    </div>
  );
}
