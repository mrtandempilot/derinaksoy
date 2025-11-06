import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { ImageUploader } from './ImageUploader';
import type { Tour } from '../types';
import { Loader2 } from 'lucide-react';

interface TourFormProps {
  tour?: Tour;
  onSubmit: (data: Partial<Tour>) => Promise<void>;
  onCancel: () => void;
}

export function TourForm({ tour, onSubmit, onCancel }: TourFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Tour>>({
    name: '',
    name_tr: '',
    slug: '',
    category: 'Adventure',
    short_description: '',
    short_description_tr: '',
    full_description: '',
    full_description_tr: '',
    price_adult: 0,
    price_child: 0,
    currency: 'USD',
    duration: '',
    start_times: [],
    meeting_point: '',
    meeting_point_tr: '',
    pickup_available: false,
    age_limit: '',
    fitness_level: '',
    included: [],
    included_tr: [],
    not_included: [],
    not_included_tr: [],
    what_to_bring: [],
    what_to_bring_tr: [],
    image_url: '',
    gallery_urls: [],
    is_active: true,
  });

  useEffect(() => {
    if (tour) {
      setFormData(tour);
    }
  }, [tour]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to save tour. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }));
  };

  const handleArrayInput = (field: keyof Tour, value: string) => {
    const items = value.split('\n').filter(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const slug = formData.slug || 'tour';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tour Name (English) *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tour Name (Turkish)
          </label>
          <input
            type="text"
            value={formData.name_tr || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, name_tr: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Paragliding">Paragliding</option>
            <option value="Adventure">Adventure</option>
            <option value="Safari">Safari</option>
            <option value="Water Sports">Water Sports</option>
            <option value="Nature">Nature</option>
            <option value="Boat Tours">Boat Tours</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <input
            type="text"
            placeholder="e.g., 2 hours, Full day"
            value={formData.duration || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adult Price *
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.price_adult}
            onChange={(e) => setFormData(prev => ({ ...prev, price_adult: parseFloat(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Child Price
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.price_child || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, price_child: parseFloat(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency *
          </label>
          <select
            required
            value={formData.currency}
            onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as 'USD' | 'TRY' | 'EUR' }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="USD">USD ($)</option>
            <option value="TRY">TRY (₺)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>

      {/* Descriptions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Short Description (English)
        </label>
        <textarea
          rows={2}
          value={formData.short_description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Description (English)
        </label>
        <textarea
          rows={4}
          value={formData.full_description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, full_description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* IMAGE UPLOAD - CRITICAL FEATURE */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Tour Images</h3>
        <ImageUploader
          bucket="tour-images"
          tourSlug={slug}
          currentUrl={formData.image_url}
          onUpload={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
          label="Main Tour Image"
        />
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What's Included (one per line)
          </label>
          <textarea
            rows={4}
            value={formData.included?.join('\n') || ''}
            onChange={(e) => handleArrayInput('included', e.target.value)}
            placeholder="Hotel pickup&#10;Professional guide&#10;Equipment"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What's Not Included (one per line)
          </label>
          <textarea
            rows={4}
            value={formData.not_included?.join('\n') || ''}
            onChange={(e) => handleArrayInput('not_included', e.target.value)}
            placeholder="Food and drinks&#10;Personal expenses"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
          className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
          Active (visible to customers)
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </span>
          ) : (
            'Save Tour'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
