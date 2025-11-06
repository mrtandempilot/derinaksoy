import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import type { Booking } from '../types';

interface CalendarProps {
  bookings: Booking[];
  onBookingClick?: (booking: Booking) => void;
}

export function Calendar({ bookings, onBookingClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const monthNames = ['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 
                      'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'];
  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    
    const daysInMonth = lastDay.getDate();
    const days: Date[] = [];
    
    // Add previous month's days
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(date);
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(b => b.booking_date.startsWith(dateStr));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="space-y-4">
      {/* View Mode Selector */}
      <div className="flex items-center justify-between">
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

        <button
          onClick={goToToday}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <CalendarIcon className="w-4 h-4" />
          Bugün
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <button
          onClick={previousMonth}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Önceki Ay
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={nextMonth}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Sonraki Ay
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center font-semibold text-gray-700 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => {
            const dayBookings = getBookingsForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);

            return (
              <div
                key={index}
                className={`min-h-[120px] border-b border-r p-2 ${
                  !isCurrentMonthDay ? 'bg-gray-50' : 'bg-white'
                } ${isTodayDate ? 'ring-2 ring-primary ring-inset' : ''}`}
              >
                <div className={`text-right mb-2 ${
                  !isCurrentMonthDay ? 'text-gray-400' : 
                  isTodayDate ? 'text-primary font-bold text-lg' : 
                  'text-gray-900 font-semibold'
                }`}>
                  {date.getDate()}
                </div>

                <div className="space-y-1">
                  {dayBookings.slice(0, 3).map((booking) => (
                    <button
                      key={booking.id}
                      onClick={() => onBookingClick?.(booking)}
                      className={`w-full text-left px-2 py-1 rounded text-xs border ${
                        getStatusColor(booking.status)
                      } hover:opacity-80 transition-opacity`}
                    >
                      <div className="font-semibold truncate">{booking.tour_name}</div>
                      <div className="truncate">{booking.customer_name}</div>
                      <div className="text-[10px]">{booking.adults}A {booking.children > 0 ? `${booking.children}Ç` : ''}</div>
                    </button>
                  ))}
                  
                  {dayBookings.length > 3 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{dayBookings.length - 3} daha
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
