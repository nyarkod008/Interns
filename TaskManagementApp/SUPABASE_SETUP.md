# Supabase Integration Setup Guide

## 🚀 Quick Setup Steps

### 1. Get Your Supabase Keys
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `nftdpjmnsapszkebvdwl`
3. Go to **Settings** → **API**
4. Copy your **anon/public** key

### 2. Update Configuration
Edit `src/services/SupabaseHttpService.ts` and replace:
```typescript
private readonly apiKey = 'YOUR_SUPABASE_ANON_KEY';
```
With your actual anon key from step 1.

### 3. Create Database Tables
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Click **Run** to create the tables and sample data

### 4. Enable Supabase Services
Edit `src/services/index.ts` and change:
```typescript
const USE_SUPABASE = false;
```
To:
```typescript
const USE_SUPABASE = true;
```

### 5. Test the Integration
1. Restart your app: `npm run web` or `npm run android`
2. The app should now connect to your Supabase database
3. You'll see real data instead of mock data

## 📊 Database Schema

### Profiles Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR, Required)
- `bio` (TEXT)
- `skills` (TEXT[], Array of skills)
- `location` (VARCHAR, Required)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tasks Table
- `id` (UUID, Primary Key)
- `title` (VARCHAR, Required)
- `description` (TEXT, Required)
- `category` (VARCHAR, Required)
- `required_skills` (TEXT[], Array of skills)
- `created_by` (UUID, Foreign Key to profiles)
- `created_by_name` (VARCHAR)
- `status` (ENUM: 'open', 'in_progress', 'completed')
- `created_at` (TIMESTAMP)

## 🔧 Features Included

✅ **Profile Management**: Full CRUD operations
✅ **Task Management**: Create, read, update tasks
✅ **Real-time Data**: Automatic updates from database
✅ **Data Validation**: Client and server-side validation
✅ **Error Handling**: Comprehensive error management
✅ **Sample Data**: Pre-populated with example profiles and tasks

## 🔄 Switching Between Mock and Real Data

You can easily switch between mock data and Supabase by changing the `USE_SUPABASE` flag in `src/services/index.ts`. This is useful for:
- Development without internet
- Testing with consistent data
- Gradual migration to live database

## 🛡️ Security Notes

The current setup uses public access policies for simplicity. For production, you should:
1. Implement proper authentication
2. Add user-specific Row Level Security policies
3. Validate data on the server side
4. Use environment variables for sensitive keys

## 🎯 Next Steps

Once connected, your app will have:
- Real-time profile updates
- Persistent task creation
- Shared task feed across users
- Full database backup and recovery
- Scalable cloud infrastructure

Happy coding! 🚀