import { useState } from 'react';
import { uploadTourImage, deleteTourImage } from '../lib/supabase';

export function useImageUpload(tourSlug: string, bucket: 'tour-images' | 'tour-galleries') {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const upload = async (file: File): Promise<string> => {
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Simulate progress (Supabase doesn't provide real progress)
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);
      
      const url = await uploadTourImage(file, tourSlug, bucket);
      
      clearInterval(interval);
      setProgress(100);
      
      return url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };
  
  const deleteImage = async (url: string) => {
    try {
      await deleteTourImage(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      throw err;
    }
  };
  
  return { upload, deleteImage, uploading, progress, error };
}
