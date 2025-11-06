import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTours, useDeleteTour, useCreateTour, useUpdateTour } from '../hooks/useTours';
import { TourForm } from '../components/TourForm';
import type { Tour } from '../types';
import { Plus, Edit, Trash2, Loader2, ArrowLeft } from 'lucide-react';

export function AdminTours() {
  const navigate = useNavigate();
  const { data: tours, isLoading } = useTours();
  const deleteTourMutation = useDeleteTour();
  const createTourMutation = useCreateTour();
  const updateTourMutation = useUpdateTour();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | undefined>();

  const handleAdd = () => {
    setEditingTour(undefined);
    setShowForm(true);
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    setShowForm(true);
  };

  const handleDelete = async (tour: Tour) => {
    if (!confirm(`Are you sure you want to delete "${tour.name}"?`)) {
      return;
    }

    try {
      await deleteTourMutation.mutateAsync(tour.id);
      alert('Tour deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete tour. Please try again.');
    }
  };

  const handleSubmit = async (data: Partial<Tour>) => {
    try {
      if (editingTour) {
        await updateTourMutation.mutateAsync({ id: editingTour.id, ...data });
        alert('Tour updated successfully!');
      } else {
        await createTourMutation.mutateAsync(data);
        alert('Tour created successfully!');
      }
      setShowForm(false);
      setEditingTour(undefined);
    } catch (error) {
      console.error('Submit error:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTour(undefined);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Tours
            </button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {editingTour ? 'Edit Tour' : 'Add New Tour'}
          </h1>
          <TourForm
            tour={editingTour}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Tour Management</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Tour
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Tours List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : tours && tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map(tour => (
              <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Tour Image */}
                <div className="relative h-48 bg-gray-200">
                  {tour.image_url ? (
                    <img
                      src={tour.image_url}
                      alt={tour.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tour.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                    }`}>
                      {tour.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Tour Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{tour.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{tour.category}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-gray-900">
                      {tour.currency === 'USD' ? '$' : tour.currency === 'TRY' ? '₺' : '€'}
                      {tour.price_adult}
                    </span>
                    {tour.duration && (
                      <span className="text-sm text-gray-500">{tour.duration}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(tour)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tour)}
                      className="flex items-center justify-center px- py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      disabled={deleteTourMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No tours yet. Add your first tour!</p>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add First Tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
