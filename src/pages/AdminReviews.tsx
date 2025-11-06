import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReviews, useUpdateReviewStatus, useToggleFeatured, useDeleteReview } from '../hooks/useReviews';
import { StarRating } from '../components/StarRating';
import { Check, X, Star, Trash2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { Review } from '../types';

export function AdminReviews() {
  const navigate = useNavigate();
  const { data: allReviews, isLoading } = useReviews();
  const updateStatus = useUpdateReviewStatus();
  const toggleFeatured = useToggleFeatured();
  const deleteReview = useDeleteReview();

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminResponse, setAdminResponse] = useState('');

  const filteredReviews = allReviews?.filter(review => {
    if (filter === 'pending') return !review.is_approved;
    if (filter === 'approved') return review.is_approved;
    return true;
  });

  const pendingCount = allReviews?.filter(r => !r.is_approved).length || 0;
  const approvedCount = allReviews?.filter(r => r.is_approved).length || 0;

  const handleApprove = async (id: string) => {
    try {
      await updateStatus.mutateAsync({
        id,
        is_approved: true,
        admin_response: adminResponse || undefined
      });
      setSelectedReview(null);
      setAdminResponse('');
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Yorum onaylanırken hata oluştu');
    }
  };

  const handleReject = async (id: string) => {
    if (confirm('Bu yorumu reddetmek istediğinizden emin misiniz?')) {
      try {
        await deleteReview.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Yorum silinirken hata oluştu');
      }
    }
  };

  const handleToggleFeatured = async (review: Review) => {
    try {
      await toggleFeatured.mutateAsync({
        id: review.id,
        is_featured: !review.is_featured
      });
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Müşteri Yorumları</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/admin/tours')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Turlar
            </button>
            <button
              onClick={() => navigate('/admin/calendar')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Takvim
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600">Toplam Yorum</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{allReviews?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium text-gray-600">Onay Bekleyen</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-600">Onaylanmış</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{approvedCount}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Onay Bekleyen ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === 'approved'
                ? 'bg-green-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Onaylanmış ({approvedCount})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tümü ({allReviews?.length || 0})
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews?.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg">Henüz yorum yok</p>
            </div>
          ) : (
            filteredReviews?.map((review) => (
              <div
                key={review.id}
                className={`bg-white rounded-lg shadow-sm p-6 ${
                  !review.is_approved ? 'border-l-4 border-yellow-500' : ''
                } ${review.is_featured ? 'border-l-4 border-purple-500' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {review.customer_name}
                      </h3>
                      {review.customer_country && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {review.customer_country}
                        </span>
                      )}
                      {review.is_featured && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-purple-700" />
                          Öne Çıkan
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <StarRating rating={review.rating} readonly size="sm" />
                      <span>•</span>
                      <span>{review.tour_name}</span>
                      <span>•</span>
                      <span>{format(new Date(review.created_at), 'd MMMM yyyy', { locale: tr })}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {review.is_approved ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                      ✓ Onaylı
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
                      ⏳ Bekliyor
                    </span>
                  )}
                </div>

                {/* Review Content */}
                {review.title && (
                  <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                )}
                <p className="text-gray-700 mb-4">{review.comment}</p>

                {/* Admin Response */}
                {review.admin_response && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Admin Yanıtı:</span>
                    </div>
                    <p className="text-sm text-blue-800">{review.admin_response}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  {!review.is_approved ? (
                    <>
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Onayla
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Reddet
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleToggleFeatured(review)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        review.is_featured
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Star className={review.is_featured ? 'w-4 h-4 fill-purple-700' : 'w-4 h-4'} />
                      {review.is_featured ? 'Öne Çıkandan Kaldır' : 'Öne Çıkar'}
                    </button>
                  )}
                  <button
                    onClick={() => handleReject(review.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    Sil
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Approve Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Yorumu Onayla</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={selectedReview.rating} readonly size="sm" />
                <span className="text-sm text-gray-600">- {selectedReview.customer_name}</span>
              </div>
              <p className="text-gray-700">{selectedReview.comment}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yanıt (opsiyonel)
              </label>
              <textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Müşteriye teşekkür mesajı yazabilirsiniz..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(selectedReview.id)}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Onayla ve Yayınla
              </button>
              <button
                onClick={() => {
                  setSelectedReview(null);
                  setAdminResponse('');
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
