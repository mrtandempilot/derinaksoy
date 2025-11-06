import { useState, useRef } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  bucket: 'tour-images' | 'tour-galleries';
  tourSlug: string;
  currentUrl?: string;
  label?: string;
}

export function ImageUploader({ onUpload, bucket, tourSlug, currentUrl, label = 'Upload Image' }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, deleteImage, uploading, progress, error } = useImageUpload(tourSlug, bucket);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const url = await upload(file);
      onUpload(url);
    } catch (err) {
      console.error('Upload error:', err);
      setPreview(currentUrl || null);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDelete = async () => {
    if (currentUrl) {
      try {
        await deleteImage(currentUrl);
        setPreview(null);
        onUpload('');
      } catch (err) {
        console.error('Delete error:', err);
      }
    } else {
      setPreview(null);
      onUpload('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleDelete}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            disabled={uploading}
          >
            <X className="w-4 h-4" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <div className="text-sm">{progress}%</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            Drag & drop an image here, or click to select
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
