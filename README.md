# Ölüdeniz Paragliding CRM - Skywalkers Tours

A complete tour booking and management system for Skywalkers Tours / Ölüdeniz Paragliding. Built with React, TypeScript, Supabase, and integrated with n8n AI chatbot.

## 🎯 Features

### Customer Website
- ✅ Beautiful landing page with hero section
- ✅ Display 7 tours grouped by category
- ✅ Tour cards with images from Supabase Storage
- ✅ AI-powered chatbot for bookings (n8n integration)
- ✅ Multi-language support (English/Turkish)
- ✅ WhatsApp contact button
- ✅ Mobile responsive design

### Admin Dashboard
- ✅ Password-protected admin area (password: `admin2025`)
- ✅ Dashboard with booking statistics
- ✅ Manage all bookings (view, filter, update status)
- ✅ Complete tour management (add, edit, delete)
- ✅ **IMAGE UPLOAD to Supabase Storage** (main feature!)
- ✅ Active/inactive tour toggle
- ✅ Real-time data with React Query

### Image Management (Critical Feature!)
- ✅ Drag & drop image upload
- ✅ Preview before upload
- ✅ Upload progress indicator
- ✅ Images stored in Supabase Storage buckets
- ✅ Public URLs automatically generated
- ✅ Replace/delete uploaded images
- ✅ Images display on customer website

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account with project created
- Supabase Storage buckets created: `tour-images` and `tour-galleries`

### Installation

1. **Navigate to project directory:**
   ```bash
   cd oludeniz-crm
   ```

2. **Install dependencies** (already done):
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Edit the `.env` file and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://wpprlxuqvrinqefybatt.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
   VITE_N8N_WEBHOOK_URL=https://mvt36n7e.rpcld.com/webhook/a487d0ab-c749-4703-9125-93e88642d355/chat
   VITE_WHATSAPP_NUMBER=905364616674
   VITE_ADMIN_PASSWORD=admin2025
   ```

4. **Set up Supabase Database:**

   Run these SQL commands in your Supabase SQL Editor:

   ```sql
   -- Create tours table
   CREATE TABLE tours (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     name_tr TEXT,
     slug TEXT NOT NULL UNIQUE,
     category TEXT NOT NULL,
     short_description TEXT,
     short_description_tr TEXT,
     full_description TEXT,
     full_description_tr TEXT,
     price_adult DECIMAL(10,2) NOT NULL,
     price_child DECIMAL(10,2),
     currency TEXT NOT NULL DEFAULT 'USD',
     duration TEXT,
     start_times TEXT[],
     meeting_point TEXT,
     meeting_point_tr TEXT,
     pickup_available BOOLEAN DEFAULT false,
     age_limit TEXT,
     fitness_level TEXT,
     included TEXT[],
     included_tr TEXT[],
     not_included TEXT[],
     not_included_tr TEXT[],
     what_to_bring TEXT[],
     what_to_bring_tr TEXT[],
     image_url TEXT,
     gallery_urls TEXT[],
     is_active BOOLEAN DEFAULT true,
     rating DECIMAL(3,2),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create bookings table
   CREATE TABLE bookings (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     customer_name TEXT NOT NULL,
     customer_email TEXT,
     customer_phone TEXT,
     tour_name TEXT NOT NULL,
     booking_date DATE NOT NULL,
     tour_start_time TEXT,
     adults INTEGER NOT NULL DEFAULT 1,
     children INTEGER DEFAULT 0,
     channel TEXT DEFAULT 'website',
     status TEXT NOT NULL DEFAULT 'pending',
     total_amount DECIMAL(10,2),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create customers table
   CREATE TABLE customers (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT,
     phone TEXT,
     country TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create conversations table for chat history
   CREATE TABLE conversations (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     session_id TEXT NOT NULL,
     customer_name TEXT,
     messages JSONB DEFAULT '[]'::jsonb,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security (RLS)
   ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
   ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
   ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
   ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

   -- Create policies for public read access
   CREATE POLICY "Public read tours" ON tours FOR SELECT USING (true);
   CREATE POLICY "Public insert tours" ON tours FOR INSERT WITH CHECK (true);
   CREATE POLICY "Public update tours" ON tours FOR UPDATE USING (true);
   CREATE POLICY "Public delete tours" ON tours FOR DELETE USING (true);

   CREATE POLICY "Public read bookings" ON bookings FOR SELECT USING (true);
   CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
   CREATE POLICY "Public update bookings" ON bookings FOR UPDATE USING (true);

   CREATE POLICY "Public read customers" ON customers FOR SELECT USING (true);
   CREATE POLICY "Public insert customers" ON customers FOR INSERT WITH CHECK (true);

   CREATE POLICY "Public read conversations" ON conversations FOR SELECT USING (true);
   CREATE POLICY "Public insert conversations" ON conversations FOR INSERT WITH CHECK (true);
   CREATE POLICY "Public update conversations" ON conversations FOR UPDATE USING (true);
   ```

5. **Create Supabase Storage Buckets:**

   In Supabase Dashboard → Storage:
   - Create bucket: `tour-images` (Public)
   - Create bucket: `tour-galleries` (Public)

6. **Start development server:**
   ```bash
   npm run dev
   ```

7. **Access the application:**
   - Customer website: http://localhost:5173/
   - Admin dashboard: http://localhost:5173/admin (password: admin2025)

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── BookingsTable.tsx
│   ├── ChatWidget.tsx
│   ├── Hero.tsx
│   ├── ImageUploader.tsx   # Critical: Image upload component
│   ├── LanguageSwitcher.tsx
│   ├── TourCard.tsx
│   └── TourForm.tsx
├── contexts/           # React contexts
│   └── LanguageContext.tsx
├── hooks/              # Custom React hooks
│   ├── useBookings.ts
│   ├── useImageUpload.ts   # Critical: Image upload logic
│   └── useTours.ts
├── lib/                # External integrations
│   ├── n8n.ts          # n8n webhook integration
│   └── supabase.ts     # Supabase client & image functions
├── pages/              # Page components
│   ├── Admin.tsx
│   ├── AdminTours.tsx
│   └── Index.tsx
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx             # Root component with routing
└── main.tsx            # Application entry point
```

## 🎨 Key Technologies

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Database & Storage:** Supabase (PostgreSQL + Storage)
- **Data Fetching:** React Query (TanStack Query)
- **Routing:** React Router v6
- **Icons:** Lucide React
- **AI Chatbot:** n8n webhook integration

## 🔑 Admin Access

- URL: `/admin`
- Password: `admin2025` (configurable in `.env`)

## 📸 Image Upload Feature

The image upload system is the core feature of this CRM:

1. **Upload Component:** `ImageUploader.tsx`
   - Drag & drop or click to select
   - Preview before upload
   - Progress indicator
   - Replace/delete functionality

2. **Upload Hook:** `useImageUpload.ts`
   - Manages upload state
   - Handles errors
   - Simulates progress

3. **Supabase Functions:** `lib/supabase.ts`
   - `uploadTourImage()` - Uploads to Supabase Storage
   - `deleteTourImage()` - Deletes from storage
   - Returns public URLs

4. **Usage in Tour Form:**
   - Main image upload when creating/editing tours
   - Images stored in bucket folders by tour slug
   - URLs saved to database
   - Displayed on customer website

## 🌐 Multi-Language Support

- Supports English (EN) and Turkish (TR)
- Language switcher in navigation
- Persists preference in localStorage
- Translations in `contexts/LanguageContext.tsx`

## 💬 AI Chatbot Integration

- Floating chat widget on customer website
- Connects to n8n workflow via webhook
- Session-based conversations
- Chat history saved in localStorage
- Mobile responsive

## 📱 Mobile Responsive

All pages and components are fully responsive:
- Mobile-first design
- Optimized for phones, tablets, and desktops
- Touch-friendly interaction targets
- Responsive images and layouts

## 🔒 Security Note

For production deployment:
- Update Supabase RLS policies for proper authentication
- Use environment-specific API keys
- Implement proper admin authentication (beyond localStorage)
- Enable HTTPS
- Add rate limiting for API requests

## 🚢 Deployment

### Deploy to Vercel/Netlify:

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Add environment variables
4. Deploy

### Build for production:

```bash
npm run build
```

The `dist` folder contains the production build.

## 📝 Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `VITE_N8N_WEBHOOK_URL` - n8n webhook URL for chatbot
- `VITE_WHATSAPP_NUMBER` - WhatsApp contact number
- `VITE_ADMIN_PASSWORD` - Admin dashboard password

## 🎯 7 Default Tours

The system is designed for these 7 tours:

1. Tandem Paragliding - $120 USD
2. ATV Safari - ₺1,500 TRY
3. Jeep Safari - ₺1,250 TRY
4. Scuba Diving - ₺2,000 TRY
5. Horse Safari - ₺1,500 TRY
6. Ölüdeniz Boat Tour - ₺1,750 TRY
7. 12 Islands Boat Tour - ₺2,000 TRY

Add these tours through the Admin dashboard!

## 👨‍💻 Development

Run in development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📞 Support

For issues or questions:
- Email: info@skywalkers-tours.com
- WhatsApp: +90 536 461 6674

---

**Built with ❤️ for Skywalkers Tours - Ölüdeniz, Turkey**
