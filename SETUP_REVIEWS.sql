-- Müşteri Yorum Sistemi için Tablo
-- Supabase SQL Editor'de çalıştırın

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_country TEXT,
  tour_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  photos TEXT[], -- Fotoğraf URL'leri
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false, -- Öne çıkan yorumlar
  admin_response TEXT,
  booking_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by TEXT
);

-- Indexes
CREATE INDEX idx_reviews_approved ON reviews(is_approved);
CREATE INDEX idx_reviews_featured ON reviews(is_featured);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_tour ON reviews(tour_name);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);

-- RLS Policies
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON reviews TO anon, authenticated, service_role, postgres;

-- İstatistikler için view
CREATE OR REPLACE VIEW review_stats AS
SELECT 
  tour_name,
  COUNT(*) as total_reviews,
  AVG(rating)::NUMERIC(3,2) as average_rating,
  COUNT(*) FILTER (WHERE rating = 5) as five_star,
  COUNT(*) FILTER (WHERE rating = 4) as four_star,
  COUNT(*) FILTER (WHERE rating = 3) as three_star,
  COUNT(*) FILTER (WHERE rating = 2) as two_star,
  COUNT(*) FILTER (WHERE rating = 1) as one_star
FROM reviews
WHERE is_approved = true
GROUP BY tour_name;

GRANT SELECT ON review_stats TO anon, authenticated, service_role, postgres;
