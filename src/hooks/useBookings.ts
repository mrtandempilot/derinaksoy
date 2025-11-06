import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookings, createBooking, updateBookingStatus } from '../lib/supabase';
import type { Booking } from '../types';

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (booking: Partial<Booking>) => createBooking(booking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Booking['status'] }) => 
      updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });
}
