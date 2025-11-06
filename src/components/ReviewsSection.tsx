import { useFeaturedReviews } from '../hooks/useReviews';
import { StarRating } from './StarRating';
import { Quote } from 'lucide-react';

export function ReviewsSection() {
  const { data: reviews, isLoading } = useFeaturedReviews();

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Müşterilerimiz Ne Diyor? 💬
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Binlerce memnun müşterimizden sadece birkaçı
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-16 h-16 text-primary" />
              </div>

              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={review.rating} readonly size="md" />
              </div>

              {/* Title */}
              {review.title && (
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {review.title}
                </h3>
              )}

              {/* Comment */}
              <p className="text-gray-700 mb-6 line-clamp-4">
                "{review.comment}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {review.customer_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {review.customer_name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{review.tour_name}</span>
                    {review.customer_country && (
                      <>
                        <span>•</span>
                        <span>{review.customer_country}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Response */}
              {review.admin_response && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-xs font-semibold text-blue-900 mb-1">
                    Skywalkers Tours:
                  </p>
                  <p className="text-sm text-blue-800">
                    {review.admin_response}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Sizin de deneyiminizi paylaşın!
          </p>
          <button
            onClick={() => {
              const reviewForm = document.getElementById('review-form');
              reviewForm?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Yorum Yap
          </button>
        </div>
      </div>
    </section>
  );
}
