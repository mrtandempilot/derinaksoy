import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookings } from '../hooks/useBookings';
import { GoogleCalendarView } from '../components/GoogleCalendarView';
import { CalendarDays, TrendingUp, Clock, Percent } from 'lucide-react';

export function AdminCalendar() {
  const navigate = useNavigate();
  const { data: allBookings, isLoading } = useBookings();

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
          <h1 className="text-2xl font-bold text-primary">Google Calendar</h1>
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

        {/* Google Calendar Integration */}
        <GoogleCalendarView />
      </div>
    </div>
  );
}
