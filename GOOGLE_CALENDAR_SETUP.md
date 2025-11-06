# Google Calendar Integration Setup Guide

This guide will help you complete the Google Calendar integration for your CRM system.

## Prerequisites

You need to obtain:
- Google OAuth Client ID (from Google Cloud Console)
- Google OAuth Client Secret (from Google Cloud Console)  
- Google API Key (from Google Cloud Console)

## Step 1: Get Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. In the left menu, go to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **API key**
5. Copy the generated API key
6. Click **RESTRICT KEY** (recommended)
7. Under **API restrictions**, select **Restrict key**
8. Choose **Google Calendar API**
9. Click **Save**

## Step 2: Enable Google Calendar API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Calendar API"
3. Click on it and press **ENABLE**

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required fields:
   - App name: "Oludeniz CRM"
   - User support email: your email
   - Developer contact email: your email
4. Click **Save and Continue**
5. Add the following scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
6. Add test users (your email address)
7. Click **Save and Continue**

## Step 4: Configure Authorized Redirect URIs

1. Go to **APIs & Services** → **Credentials**
2. Click on your OAuth 2.0 Client ID
3. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:5173
   https://your-domain.com
   ```
4. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:5173
   https://your-domain.com
   ```
5. Click **Save**

## Step 5: Update Environment Variables

1. Open your `.env` file
2. Replace `YOUR_API_KEY_HERE` with your actual Google API Key:
   ```
   VITE_GOOGLE_API_KEY=AIza...your-actual-api-key
   ```
3. Save the file

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Admin Calendar page (`/admin/calendar`)

3. You should see:
   - Statistics cards showing booking metrics
   - Filter options for tours and booking status  
   - A "Google Calendar" section with a "Sign in with Google" button
   - Your local calendar view below

4. Click **"Sign in with Google"**
   - A popup will appear asking you to sign in
   - Grant calendar permissions
   - You should now be connected!

5. Click **"Sync Bookings"** to sync all confirmed bookings to your Google Calendar

## Features

### Automatic Sync
- Syncs all **confirmed** bookings to your Google Calendar
- Each booking becomes a calendar event with:
  - Title: `[Tour Name] - [Customer Name]`
  - Description: Full booking details (ID, phone, email, number of people)
  - Time: Based on booking date and tour start time
  - Duration: 2 hours (default for tours)
  - Attendees: Customer email (if provided)

### Manual Refresh
- Click the refresh button to reload events from Google Calendar
- View all your calendar events in the CRM

### Sign Out
- Click "Sign Out" to disconnect from Google Calendar
- Your bookings remain in both systems

## Troubleshooting

### "Access Blocked" Error
- Make sure you've added your email as a test user in OAuth consent screen
- Verify your app is set to "Testing" status

### API Key Issues
- Ensure the API key is properly restricted to Google Calendar API
- Check that the key hasn't expired

### Calendar Not Loading
- Check browser console for errors
- Verify all environment variables are set correctly
- Make sure Google Calendar API is enabled in your project

### Events Not Syncing
- Confirm bookings have status "confirmed"
- Check that booking dates and times are valid
- Look for error messages in the browser console

## Security Notes

⚠️ **Important Security Information:**

1. **Never commit your `.env` file to Git**
   - It's already in `.gitignore`
   - Contains sensitive credentials

2. **Use different credentials for production**
   - Set up separate OAuth credentials for production
   - Use environment-specific API keys

3. **Restrict API keys properly**
   - Only allow Google Calendar API
   - Add HTTP referrer restrictions for production

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all steps above are completed
3. Ensure your Google Cloud project has billing enabled (if required)
4. Check that you're using the latest version of Chrome/Firefox/Edge

## Next Steps

After setup is complete:
1. Test syncing bookings
2. Verify events appear in your Google Calendar
3. Train your team on using the integration
4. Set up automated syncing (optional)

---

**Setup Date:** November 6, 2025
**Version:** 1.0.0
