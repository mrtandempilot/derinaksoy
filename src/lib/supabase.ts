import { createClient } from '@supabase/supabase-js';
import type { Tour, Booking } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Image upload function
export async function uploadTourImage(
  file: File,
  tourSlug: string,
  bucket: 'tour-images' | 'tour-galleries'
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${tourSlug}/${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  
  return publicUrl;
}

// Delete image function
export async function deleteTourImage(imageUrl: string): Promise<void> {
  const path = imageUrl.split('/storage/v1/object/public/')[1];
  if (!path) return;
  
  const [bucket, ...filePath] = path.split('/');
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath.join('/')]);
  
  if (error) throw error;
}

// Tour operations
export async function getTours() {
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .order('category', { ascending: true });
  
  if (error) throw error;
  return data as Tour[];
}

export async function getActiveTours() {
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true });
  
  if (error) throw error;
  return data as Tour[];
}

export async function getTourById(id: string) {
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Tour;
}

export async function createTour(tour: Partial<Tour>) {
  console.log("Creating tour with data:", tour);
  const { data, error } = await supabase
    .from('tours')
    .insert([tour])
    .select()
    .single();
  
  console.log("Supabase response (createTour) - data:", data);
  console.log("Supabase response (createTour) - error:", error);

  if (error) throw error;
  return data as Tour;
}

export async function updateTour(id: string, updates: Partial<Tour>) {
  const { data, error } = await supabase
    .from('tours')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Tour;
}

export async function deleteTour(id: string) {
  const { error } = await supabase
    .from('tours')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Booking operations
export async function getBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Booking[];
}

export async function createBooking(booking: Partial<Booking>) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select()
    .single();
  
  if (error) throw error;
  return data as Booking;
}

export async function updateBookingStatus(id: string, status: Booking['status']) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Booking;
}
