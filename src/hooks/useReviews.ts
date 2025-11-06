import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Review } from '../types';

// Fetch all reviews
export function useReviews(approved?: boolean) {
  return useQuery({
    queryKey: ['reviews', approved],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (approved !== undefined) {
        query = query.eq('is_approved', approved);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Review[];
    }
  });
}

// Fetch reviews by tour
export function useReviewsByTour(tourName: string) {
  return useQuery({
    queryKey: ['reviews', 'tour', tourName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('tour_name', tourName)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    }
  });
}

// Fetch featured reviews
export function useFeaturedReviews() {
  return useQuery({
    queryKey: ['reviews', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Review[];
    }
  });
}

// Create review
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: Partial<Review>) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          ...review,
          is_approved: false,
          is_featured: false
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });
}

// Approve/reject review
export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_approved, admin_response }: { 
      id: string; 
      is_approved: boolean;
      admin_response?: string;
    }) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          is_approved,
          admin_response,
          approved_at: is_approved ? new Date().toISOString() : null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });
}

// Toggle featured status
export function useToggleFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({ is_featured })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });
}

// Delete review
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });
}

// Get review stats
export function useReviewStats() {
  return useQuery({
    queryKey: ['review_stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('review_stats')
        .select('*');

      if (error) throw error;
      return data;
    }
  });
}
