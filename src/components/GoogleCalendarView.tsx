import { useEffect, useState } from 'react';
import { useGoogleCalendar } from '../hooks/useGoogleCalendar';
import { useBookings } from '../hooks/useBookings';
import { Calendar, RefreshCw, LogIn, LogOut, Plus } from 'lucide-react';
import type { Booking } from '../types';

export function GoogleCalendarView() {
  const { 
    isInitialized, 
    isSignedIn, 
    loading, 
    events, 
    signIn, 
    signOut, 
    fetchEvents,
    createEvent 
  } = useGoogleCalendar();
  
  const { data: bookings } = useBookings();
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      fetchEvents();
    }
  }, [isSignedIn]);

  const syncBookingsToCalendar = async () => {
    if (!bookings || !isSignedIn) return;

    setSyncing(true);
    try {
      // Only sync confirmed bookings that don't exist in calendar yet
      const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
      
      for (const booking of confirmedBookings) {
        // Check if event already exists (by checking description or summary)
        const existingEvent = events.find(e => 
          e.description?.includes(booking.id) || 
          e.summary?.includes(booking.customer_name)
        );

        if (!existingEvent) {
          const startDateTime = new Date(booking.booking_date);
          if (booking.tour_start_time) {
            const [hours, minutes] = booking.tour_start_time.split(':');
            startDateTime.setHours(parseInt(hours), parseInt(minutes));
          }

          const endDateTime = new Date(startDateTime);
          endDateTime.setHours(endDateTime.getHours() + 2); // Assume 2-hour tours

          await createEvent({
            summary: `${booking.tour_name} - ${booking.customer_name}`,
            description: `Booking ID: ${booking.id}\nCustomer: ${booking.customer_name}\nPhone: ${booking.customer_phone || 'N/A'}\nEmail: ${booking.customer_email || 'N/A'}\nAdults: ${booking.adults}\nChildren: ${booking.children}`,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
            attendees: booking.customer_email ? [booking.customer_email] : undefined,
          });
        }
      }

      setLastSync(new Date());
      alert('Bookings synced successfully to Google Calendar!');
    } catch (error) {
      console.error('Error syncing bookings:', error);
      alert('Error syncing bookings. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">Loading Google Calendar...</span>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Calendar className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Connect Google Calendar
        </h3>
        <p className="text-gray-600 mb-6">
          Sign in with Google to sync your bookings with Google Calendar
        </p>
        <button
          onClick={signIn}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          <LogIn className="w-5 h-5" />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary" />
          <div>
            <h3 className="font-semibold text-gray-900">Google Calendar Connected</h3>
            {lastSync && (
              <p className="text-sm text-gray-500">
                Last synced: {lastSync.toLocaleString('tr-TR')}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={syncBookingsToCalendar}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {syncing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Sync Bookings
              </>
            )}
          </button>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Google Calendar Embed */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Your Calendar Events</h4>
          <button
            onClick={() => fetchEvents()}
            disabled={loading}
            className="text-sm text-primary hover:text-blue-600 flex items-center gap-1"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No events found. Sync your bookings to get started!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.map(event => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-3 hover:border-primary transition-colors"
              >
                <h5 className="font-semibold text-gray-900">{event.summary}</h5>
                {event.description && (
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                    {event.description}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(event.start.dateTime).toLocaleString('tr-TR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Tip:</strong> Click "Sync Bookings" to automatically add all confirmed bookings to your Google Calendar. 
          Events will include customer details and booking information.
        </p>
      </div>
    </div>
  );
}
