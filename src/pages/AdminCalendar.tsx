import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookings } from '../hooks/useBookings';
import { EnhancedCalendar } from '../components/EnhancedCalendar';
import { CalendarDays, TrendingUp, Clock, Percent, X } from 'lucide-react';
import type { Booking } from '../types';

export function AdminCalendar() {
  const navigate = useNavigate();
  const { data: allBookings, isLoading } = useBookings();
  const [tourFilter, setTourFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Calculate statistics
  const stats = useMemo(() => {
    if (!allBookings) return { thisMonth: 0, thisWeek: 0, today: 0, occupancy: 0 };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const thisMonth = allBookings.filter(b => 
      new Date(b.booking_date) >= startOfMonth
    ).length;

    const thisWeek = allBookings.filter(b => 
      new Date(b.booking_date) >= startOfWeek
    ).length;

    const today = allBookings.filter(b => 
      new Date(b.booking_date).toDateString() === startOfDay.toDateString()
    ).length;

    // Calculate occupancy rate (confirmed bookings / total bookings * 100)
    const confirmedThisMonth = allBookings.filter(b => 
      new Date(b.booking_date) >= startOfMonth && b.status === 'confirmed'
    ).length;
    const occupancy = thisMonth > 0 ? Math.round((confirmedThisMonth / thisMonth) * 100) : 0;

    return { thisMonth, thisWeek, today, occupancy };
  }, [allBookings]);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    if (!allBookings) return [];
    
    return allBookings.filter(booking => {
      const matchesTour = tourFilter === 'all' || booking.tour_name.toLowerCase().includes(tourFilter.toLowerCase());
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      return matchesTour && matchesStatus;
    });
  }, [allBookings, tourFilter, statusFilter]);

  // Get unique tours for filter
  const tours = useMemo(() => {
    if (!allBookings) return [];
    const uniqueTours = [...new Set(allBookings.map(b => b.tour_name))];
    return uniqueTours;
  }, [allBookings]);

  const clearFilters = () => {
    setTourFilter('all');
    setStatusFilter('all');
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Rezervasyon Takvimi</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/admin/tours')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Turlar
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Bu Ay</h3>
              <CalendarDays className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.thisMonth}</p>
            <p className="text-xs text-gray-500 mt-1">Toplam rezervasyon</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Bu Hafta</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.thisWeek}</p>
            <p className="text-xs text-gray-500 mt-1">Haftalık rezervasyon</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Bugün</h3>
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.today}</p>
            <p className="text-xs text-gray-500 mt-1">Bugünkü rezervasyonlar</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Doluluk Oranı</h3>
              <Percent className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.occupancy}%</p>
            <p className="text-xs text-gray-500 mt-1">Onaylanma oranı</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tur Filtresi
              </label>
              <select
                value={tourFilter}
                onChange={(e) => setTourFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Tüm Turlar</option>
                {tours.map(tour => (
                  <option key={tour} value={tour}>{tour}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durum Filtresi
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Tümü</option>
                <option value="pending">Bekleyen</option>
                <option value="confirmed">Onaylı</option>
                <option value="completed">Tamamlandı</option>
                <option value="cancelled">İptal</option>
              </select>
            </div>

            {(tourFilter !== 'all' || statusFilter !== 'all') && (
              <div className="flex-shrink-0 mt-6">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Temizle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'month' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Ay
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'week' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Hafta
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'day' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Gün
          </button>
        </div>

        {/* Calendar */}
        <EnhancedCalendar 
          bookings={filteredBookings} 
          onBookingClick={handleBookingClick}
          viewMode={viewMode}
        />
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Rezervasyon Detayı</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Tur</label>
                <p className="text-gray-900">{selectedBooking.tour_name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Müşteri</label>
                <p className="text-gray-900">{selectedBooking.customer_name}</p>
              </div>

              {selectedBooking.customer_email && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{selectedBooking.customer_email}</p>
                </div>
              )}

              {selectedBooking.customer_phone && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Telefon</label>
                  <p className="text-gray-900">{selectedBooking.customer_phone}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">Tarih</label>
                <p className="text-gray-900">
                  {new Date(selectedBooking.booking_date).toLocaleDateString('tr-TR')}
                </p>
              </div>

              {selectedBooking.tour_start_time && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Saat</label>
                  <p className="text-gray-900">{selectedBooking.tour_start_time}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">Kişi Sayısı</label>
                <p className="text-gray-900">
                  {selectedBooking.adults} Yetişkin
                  {selectedBooking.children > 0 && `, ${selectedBooking.children} Çocuk`}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Durum</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedBooking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedBooking.status === 'confirmed' ? 'Onaylı' :
                   selectedBooking.status === 'pending' ? 'Bekleyen' :
                   selectedBooking.status === 'completed' ? 'Tamamlandı' :
                   'İptal'}
                </span>
              </div>

              {selectedBooking.total_amount && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Tutar</label>
                  <p className="text-gray-900 font-bold">
                    ${selectedBooking.total_amount}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-6 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
