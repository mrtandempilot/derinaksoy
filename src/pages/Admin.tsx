import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingsTable } from '../components/BookingsTable';
import { useBookings } from '../hooks/useBookings';
import { LayoutDashboard, Calendar, Users, DollarSign } from 'lucide-react';

export function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const { data: bookings } = useBookings();

  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin2025';
    
    if (password === correctPassword) {
      localStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Admin Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings?.filter(b => 
    b.booking_date.startsWith(today)
  ).length || 0;
  
  const pendingBookings = bookings?.filter(b => 
    b.status === 'pending'
  ).length || 0;

  const totalRevenue = bookings?.reduce((sum, b) => 
    sum + (b.total_amount || 0), 0
  ) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/calendar')}
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Takvim
            </button>
            <button
              onClick={() => navigate('/admin/tours')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Turlar
            </button>
            <button
              onClick={() => navigate('/admin/reviews')}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Yorumlar
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Web Site
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Today's Bookings</h3>
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{todayBookings}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Pending</h3>
              <Users className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-yellow-600">{pendingBookings}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Bookings</h3>
              <LayoutDashboard className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{bookings?.length || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">All Bookings</h2>
          <BookingsTable />
        </div>
      </div>
    </div>
  );
}
