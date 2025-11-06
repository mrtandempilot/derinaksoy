export interface Tour {
  id: string;
  name: string;
  name_tr?: string;
  slug: string;
  category: string;
  short_description?: string;
  short_description_tr?: string;
  full_description?: string;
  full_description_tr?: string;
  price_adult: number;
  price_child?: number;
  currency: 'USD' | 'TRY' | 'EUR';
  duration?: string;
  start_times?: string[];
  meeting_point?: string;
  meeting_point_tr?: string;
  pickup_available: boolean;
  age_limit?: string;
  fitness_level?: string;
  included?: string[];
  included_tr?: string[];
  not_included?: string[];
  not_included_tr?: string[];
  what_to_bring?: string[];
  what_to_bring_tr?: string[];
  image_url?: string;
  gallery_urls?: string[];
  is_active: boolean;
  rating?: number;
  created_at: string;
}

export interface Booking {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  tour_name: string;
  booking_date: string;
  tour_start_time?: string;
  adults: number;
  children: number;
  channel: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_amount?: number;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_country?: string;
  tour_name: string;
  rating: number;
  title?: string;
  comment: string;
  photos?: string[];
  is_approved: boolean;
  is_featured: boolean;
  admin_response?: string;
  booking_date?: string;
  created_at: string;
  approved_at?: string;
  approved_by?: string;
}

export interface ReviewStats {
  tour_name: string;
  total_reviews: number;
  average_rating: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  country?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  session_id: string;
  customer_name?: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type Language = 'en' | 'tr';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}
