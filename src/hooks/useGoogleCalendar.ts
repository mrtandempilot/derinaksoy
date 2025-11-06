import { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: Array<{ email: string }>;
}

export function useGoogleCalendar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeGapi();
  }, []);

  const initializeGapi = () => {
    gapi.load('client:auth2', async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [DISCOVERY_DOC],
          scope: SCOPES,
        });

        const authInstance = gapi.auth2.getAuthInstance();
        setIsSignedIn(authInstance.isSignedIn.get());
        
        authInstance.isSignedIn.listen((signedIn: boolean) => {
          setIsSignedIn(signedIn);
        });

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing Google API:', error);
      }
    });
  };

  const signIn = async () => {
    try {
      await gapi.auth2.getAuthInstance().signIn();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const fetchEvents = async (timeMin?: string, timeMax?: string) => {
    if (!isSignedIn) return;

    setLoading(true);
    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax,
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: 'startTime',
      });

      setEvents(response.result.items || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (event: {
    summary: string;
    description?: string;
    start: string;
    end: string;
    attendees?: string[];
  }) => {
    if (!isSignedIn) return null;

    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: {
          summary: event.summary,
          description: event.description,
          start: {
            dateTime: event.start,
            timeZone: 'Europe/Istanbul',
          },
          end: {
            dateTime: event.end,
            timeZone: 'Europe/Istanbul',
          },
          attendees: event.attendees?.map(email => ({ email })),
        },
      });

      await fetchEvents();
      return response.result;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<CalendarEvent>) => {
    if (!isSignedIn) return null;

    try {
      const response = await gapi.client.calendar.events.patch({
        calendarId: 'primary',
        eventId: eventId,
        resource: updates,
      });

      await fetchEvents();
      return response.result;
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!isSignedIn) return false;

    try {
      await gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });

      await fetchEvents();
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  };

  return {
    isInitialized,
    isSignedIn,
    loading,
    events,
    signIn,
    signOut,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
