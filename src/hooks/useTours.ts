import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTours, getActiveTours, getTourById, createTour, updateTour, deleteTour } from '../lib/supabase';
import type { Tour } from '../types';

export function useTours() {
  return useQuery({
    queryKey: ['tours'],
    queryFn: getTours
  });
}

export function useActiveTours() {
  return useQuery({
    queryKey: ['tours', 'active'],
    queryFn: getActiveTours
  });
}

export function useTour(id: string) {
  return useQuery({
    queryKey: ['tours', id],
    queryFn: () => getTourById(id),
    enabled: !!id
  });
}

export function useCreateTour() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (tour: Partial<Tour>) => createTour(tour),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
    }
  });
}

export function useUpdateTour() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...updates }: Partial<Tour> & { id: string }) => 
      updateTour(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
    }
  });
}

export function useDeleteTour() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteTour(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
    }
  });
}
