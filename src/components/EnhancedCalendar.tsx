import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isPast, isToday } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { Booking } from '../types';

interface EnhancedCalendarProps {
  bookings: Booking[];
  onBookingClick?: (booking: Booking) => void;
  viewMode: 'month' | 'week' | 'day';
}

// Helper function to get category color
const getCategoryColor = (tourName: string) => {
  const lowerName = tourName.toLowerCase();
  if (lowerName.includes('paragliding') || lowerName.includes('paraşüt')) return 'bg-blue-500';
  if (lowerName.includes('atv') || lowerName.includes('adventure')) return 'bg-green-500';
  if (lowerName.includes('jeep') || lowerName.includes('safari')) return 'bg-yellow-500';
  if (lowerName.includes('scuba') || lowerName.includes('diving')) return 'bg-orange-500';
  if (lowerName.includes('horse') || lowerName.includes('at')) return 'bg-purple-500';
  if (lowerName.includes('boat') || lowerName.includes('tekne')) return 'bg-amber-700';
  return 'bg-gray-500';
};

// Helper function to get status badge color
const getStatusBadge = (status: string) => {
  const badges: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'confirmed': 'bg-green-100 text-green-800 border-green-300',
    'completed': 'bg-blue-100 text-blue-800 border-blue-300',
    'cancelled': 'bg-red-100 text-red-800 border-red-300',
  };
  return badges[status] || 'bg-gray-100 text-gray-800';
};

export function EnhancedCalendar({ bookings, onBookingClick, viewMode }: EnhancedCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = ['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 
                      'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'];
  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        previousPeriod();
      } else if (e.key === 'ArrowRight') {
        nextPeriod();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentDate, viewMode]);

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    
    const daysInMonth = lastDay.getDate();
    const days: Date[] = [];
    
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(date);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.filter(b => {
      // Handle both 'YYYY-MM-DD' and 'YYYY-MM-DDTHH:mm:ss' formats
      const bookingDateStr = b.booking_date.split('T')[0];
      return bookingDateStr === dateStr;
    });
  };

  const getBookingsForTime = (date: Date, hour: number) => {
    const dateBookings = getBookingsForDate(date);
    return dateBookings.filter(b => {
      if (!b.tour_start_time) return false;
      const timeParts = b.tour_start_time.split(':');
      const bookingHour = parseInt(timeParts[0]);
      return bookingHour === hour;
    });
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const previousPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const nextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const renderMonthView = () => {
    const calendarDays = getCalendarDays();

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden print:shadow-none">
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center font-semibold text-gray-700 text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => {
            const dayBookings = getBookingsForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);
            const isPastDate = isPast(date) && !isTodayDate;

            return (
              <div
                key={index}
                className={`min-h-[120px] border-b border-r p-2 ${
                  !isCurrentMonthDay ? 'bg-gray-50' : 'bg-white'
                } ${isTodayDate ? 'ring-4 ring-blue-500 ring-inset' : ''}
                ${isPastDate ? 'opacity-50' : ''}`}
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
                      className={`w-full text-left px-2 py-1 rounded text-xs border transition-all duration-200 hover:scale-105 hover:shadow-md ${
                        getCategoryColor(booking.tour_name)
                      } text-white font-medium`}
                    >
                      <div className="font-semibold truncate">{booking.tour_name}</div>
                      <div className="truncate opacity-90">{booking.customer_name}</div>
                      <div className="text-[10px] opacity-80">
                        {booking.adults}A {booking.children > 0 ? `${booking.children}Ç` : ''}
                      </div>
                    </button>
                  ))}
                  
                  {dayBookings.length > 3 && (
                    <div className="text-xs text-gray-500 text-center py-1 font-medium">
                      +{dayBookings.length - 3} daha
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {weekDays.map(day => (
            <div key={day.toISOString()} className="p-3 text-center">
              <div className="font-semibold text-gray-700">{format(day, 'EEE', { locale: tr })}</div>
              <div className={`text-2xl ${isToday(day) ? 'text-primary font-bold' : 'text-gray-900'}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 divide-x">
          {weekDays.map(day => {
            const dayBookings = getBookingsForDate(day);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`p-3 min-h-[400px] ${isTodayDate ? 'bg-blue-50' : ''}`}
              >
                <div className="space-y-2">
                  {dayBookings.map((booking) => (
                    <button
                      key={booking.id}
                      onClick={() => onBookingClick?.(booking)}
                      className={`w-full text-left p-2 rounded text-xs border transition-all duration-200 hover:shadow-lg ${
                        getCategoryColor(booking.tour_name)
                      } text-white`}
                    >
                      <div className="font-bold">{booking.tour_start_time || '—'}</div>
                      <div className="font-semibold mt-1">{booking.tour_name}</div>
                      <div className="mt-1 opacity-90">{booking.customer_name}</div>
                      <div className="mt-1 opacity-80">
                        {booking.adults}A {booking.children > 0 ? `${booking.children}Ç` : ''}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 08:00 - 18:00

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-xl font-bold text-gray-900">
            {format(currentDate, 'd MMMM yyyy EEEE', { locale: tr })}
          </h3>
        </div>

        <div className="divide-y">
          {hours.map(hour => {
            const timeBookings = getBookingsForTime(currentDate, hour);
            const timeStr = `${hour.toString().padStart(2, '0')}:00`;

            return (
              <div key={hour} className="flex">
                <div className="w-20 p-3 bg-gray-50 text-sm font-semibold text-gray-600">
                  {timeStr}
                </div>
                <div className="flex-1 p-3 min-h-[80px]">
                  {timeBookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {timeBookings.map((booking) => (
                        <button
                          key={booking.id}
                          onClick={() => onBookingClick?.(booking)}
                          className={`text-left p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                            getCategoryColor(booking.tour_name)
                          } text-white`}
                        >
                          <div className="font-bold">{booking.tour_name}</div>
                          <div className="mt-1">{booking.customer_name}</div>
                          <div className="text-sm mt-1 opacity-90">
                            {booking.adults} Yetişkin {booking.children > 0 ? `, ${booking.children} Çocuk` : ''}
                          </div>
                          <div className={`mt-2 inline-block px-2 py-1 rounded text-xs ${
                            getStatusBadge(booking.status)
                          }`}>
                            {booking.status}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-primary hover:text-primary transition-colors flex items-center justify-center">
                      <span className="text-2xl">+</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <button
          onClick={previousPeriod}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          {viewMode === 'month' ? 'Önceki Ay' : viewMode === 'week' ? 'Önceki Hafta' : 'Önceki Gün'}
        </button>
        
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {viewMode === 'month' && `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            {viewMode === 'week' && format(currentDate, 'MMMM yyyy', { locale: tr })}
            {viewMode === 'day' && format(currentDate, 'd MMMM', { locale: tr })}
          </h2>
          <button
            onClick={goToToday}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <CalendarIcon className="w-4 h-4" />
            Bugün
          </button>
        </div>
        
        <button
          onClick={nextPeriod}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {viewMode === 'month' ? 'Sonraki Ay' : viewMode === 'week' ? 'Sonraki Hafta' : 'Sonraki Gün'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Content */}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}
    </div>
  );
}
