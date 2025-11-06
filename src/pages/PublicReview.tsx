import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Upload, X, Check } from 'lucide-react';
import { useCreateReview } from '../hooks/useReviews';
import { supabase, uploadTourImage } from '../lib/supabase';
import { StarRating } from '../components/StarRating';
import type { Booking } from '../types';

export function PublicReview() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const createReview = useCreateReview();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    customer_name: '',
    photos: [] as string[]
  });

  // Fetch booking details
  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (error) throw error;

      if (data) {
        setBooking(data);
        setFormData(prev => ({
          ...prev,
          customer_name: data.customer_name || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      alert('Rezervasyon bulunamadı');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || formData.photos.length >= 3) return;

    setUploading(true);
    const uploadPromises = Array.from(files).slice(0, 3 - formData.photos.length).map(async (file) => {
      try {
        const url = await uploadTourImage(file, `review-${bookingId}`, 'tour-galleries');
        return url;
      } catch (error) {
        console.error('Upload error:', error);
        return null;
      }
    });

    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter(url => url !== null) as string[];
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...validUrls]
    }));
    setUploading(false);
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      alert(language === 'tr' ? 'Lütfen bir yıldız değerlendirmesi seçin' : 'Please select a star rating');
      return;
    }

    if (formData.comment.length < 20) {
      alert(language === 'tr' ? 'Yorum en az 20 karakter olmalıdır' : 'Comment must be at least 20 characters');
      return;
    }

    try {
      await createReview.mutateAsync({
        booking_id: bookingId,
        tour_name: booking?.tour_name || '',
        customer_name: formData.customer_name,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        photos: formData.photos.length > 0 ? formData.photos : undefined
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(language === 'tr' ? 'Yorum gönderilirken bir hata oluştu' : 'Error submitting review');
    }
  };

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      tr: {
        title: 'Deneyiminizi Paylaşın',
        subtitle: 'Yorumunuz diğer turistler için çok değerli!',
        yourTour: 'Turunuz',
        rating: 'Deneyiminizi puanlayın',
        ratingHelp: 'Yıldızlara tıklayarak puanlayın',
        reviewTitle: 'Başlık',
        reviewTitlePlaceholder: 'örn: Harika bir deneyimdi!',
        comment: 'Yorumunuz',
        commentPlaceholder: 'Deneyiminizi detaylı anlatın... Ne hoşunuza gitti? Başkalarına tavsiye eder misiniz?',
        minChars: 'karakter',
        name: 'Adınız',
        email: 'Email',
        photos: 'Fotoğraflar',
        photosHelp: 'En fazla 3 fotoğraf yükleyebilirsiniz',
        upload: 'Fotoğraf Yükle',
        submit: 'Yorumu Gönder',
        submitting: 'Gönderiliyor...',
        thankYou: 'Teşekkürler!',
        successMessage: 'Yorumunuz gönderildi. Admin onayından sonra web sitesinde yayınlanacak.',
        backHome: 'Ana Sayfaya Dön',
        notFound: 'Rezervasyon Bulunamadı'
      },
      en: {
        title: 'Share Your Experience',
        subtitle: 'Your review is very valuable for other tourists!',
        yourTour: 'Your Tour',
        rating: 'Rate your experience',
        ratingHelp: 'Click on stars to rate',
        reviewTitle: 'Title',
        reviewTitlePlaceholder: 'e.g: Amazing experience!',
        comment: 'Your Comment',
        commentPlaceholder: 'Tell us about your experience... What did you like? Would you recommend it to others?',
        minChars: 'characters',
        name: 'Your Name',
        email: 'Email',
        photos: 'Photos',
        photosHelp: 'You can upload up to 3 photos',
        upload: 'Upload Photo',
        submit: 'Submit Review',
        submitting: 'Submitting...',
        thankYou: 'Thank You!',
        successMessage: 'Your review has been submitted. It will be published on the website after admin approval.',
        backHome: 'Back to Home',
        notFound: 'Booking Not Found'
      }
    };
    return translations[language][key] || key;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('notFound')}</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t('backHome')}
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('thankYou')} 🎉</h2>
          <p className="text-gray-600 mb-6">{t('successMessage')}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t('backHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-gray-600 mt-1">{t('subtitle')}</p>
            </div>
            {/* Language Switcher */}
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('tr')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  language === 'tr'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                TR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Tour Info */}
          <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
            <p className="text-sm font-medium text-gray-600">{t('yourTour')}</p>
            <p className="text-lg font-bold text-gray-900">{booking.tour_name}</p>
            <p className="text-sm text-gray-600">
              {new Date(booking.booking_date).toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-b-xl shadow-xl p-6 space-y-6">
          {/* Rating */}
          <div className="text-center pb-6 border-b">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              {t('rating')}
            </label>
            <div className="flex justify-center mb-2">
              <StarRating
                rating={formData.rating}
                onRatingChange={(rating) => setFormData({ ...formData, rating })}
                size="lg"
              />
            </div>
            <p className="text-sm text-gray-500">{t('ratingHelp')}</p>
            {formData.rating > 0 && (
              <p className="mt-2 text-sm font-medium text-primary">
                {formData.rating === 5 ? '🤩 Mükemmel!' :
                 formData.rating === 4 ? '😊 Çok iyi!' :
                 formData.rating === 3 ? '🙂 İyi' :
                 formData.rating === 2 ? '😐 Eh işte' :
                 '😞 Kötü'}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reviewTitle')}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t('reviewTitlePlaceholder')}
              maxLength={100}
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('comment')} *
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={6}
              placeholder={t('commentPlaceholder')}
              required
              minLength={20}
            />
            <p className="mt-1 text-sm text-gray-500">
              {formData.comment.length}/20 {t('minChars')}
            </p>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('photos')}
            </label>
            <p className="text-xs text-gray-500 mb-3">{t('photosHelp')}</p>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {formData.photos.length < 3 && (
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">{t('upload')}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
            {uploading && (
              <p className="text-sm text-primary mt-2">Yükleniyor...</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('name')} *
            </label>
            <input
              type="text"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={createReview.isPending || formData.rating === 0}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-semibold py-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {createReview.isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {t('submitting')}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t('submit')}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
