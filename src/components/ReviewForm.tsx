import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { useCreateReview } from '../hooks/useReviews';
import { useTours } from '../hooks/useTours';
import { StarRating } from './StarRating';

interface ReviewFormProps {
  onClose?: () => void;
  bookingId?: string;
  initialTourName?: string;
}

export function ReviewForm({ onClose, bookingId, initialTourName }: ReviewFormProps) {
  const { data: tours } = useTours();
  const createReview = useCreateReview();
  
  const [formData, setFormData] = useState({
    customer_name: '',
    tour_name: initialTourName || '',
    rating: 0,
    title: '',
    comment: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      alert('Lütfen bir yıldız değerlendirmesi seçin');
      return;
    }

    try {
      await createReview.mutateAsync({
        ...formData,
        booking_id: bookingId
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose?.();
      }, 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Yorum gönderilirken bir hata oluştu');
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Teşekkürler! 🎉</h2>
        <p className="text-gray-600">
          Yorumunuz gönderildi. Admin onayından sonra web sitesinde yayınlanacak.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Deneyiminizi Paylaşın</h2>
            <p className="mt-1 opacity-90">Yorumunuz diğer turistler için çok değerli!</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Rating */}
        <div className="text-center">
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Deneyiminizi puanlayın
          </label>
          <div className="flex justify-center">
            <StarRating
              rating={formData.rating}
              onRatingChange={(rating) => setFormData({ ...formData, rating })}
              size="lg"
            />
          </div>
          {formData.rating > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {formData.rating === 5 ? '🤩 Mükemmel!' :
               formData.rating === 4 ? '😊 Çok iyi!' :
               formData.rating === 3 ? '🙂 İyi' :
               formData.rating === 2 ? '😐 Eh işte' :
               '😞 Kötü'}
            </p>
          )}
        </div>

        {/* Tour Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hangi turu yaptınız?
          </label>
          <select
            value={formData.tour_name}
            onChange={(e) => setFormData({ ...formData, tour_name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Tur seçin...</option>
            {tours?.map(tour => (
              <option key={tour.id} value={tour.name}>{tour.name}</option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adınız
          </label>
          <input
            type="text"
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlık (opsiyonel)
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="örn: Harika bir deneyimdi!"
            maxLength={100}
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Yorumunuz *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows={5}
            placeholder="Deneyiminizi detaylı anlatın... Ne hoşunuza gitti? Başkalarına tavsiye eder misiniz?"
            required
            minLength={20}
          />
          <p className="mt-1 text-sm text-gray-500">
            Minimum 20 karakter ({formData.comment.length}/20)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={createReview.isPending || formData.rating === 0}
          className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createReview.isPending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Gönderiliyor...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Yorumu Gönder
            </>
          )}
        </button>

        <p className="text-xs text-center text-gray-500">
          Yorumunuz admin onayından sonra yayınlanacaktır
        </p>
      </form>
    </div>
  );
}
