# inotes - Developer Knowledge System

A lightweight, structured technical note system for developers built with Next.js and Supabase.

## Features

- **Authentication**: Secure email/password authentication with Supabase
- **Note Management**: Create, edit, and delete technical notes
- **Entry System**: Add multiple updates/entries to each note
- **Code Snippets**: Store and display code with syntax highlighting
- **Search**: Search across notes, code, and explanations
- **Pagination**: 30 notes per page for optimal performance
- **Hijri Dates**: Display dates in Islamic Hijri calendar
- **Edit History**: Track all edits with version history
- **Soft Delete**: Deleted notes moved to trash instead of permanent deletion
- **Arabic RTL Support**: Built-in support for Arabic text

## Setup

### 1. Environment Variables

Update `.env.local` with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Database Setup

The database schema has been automatically created with the following tables:

- `profiles` - User profiles with username
- `notes` - Main notes table
- `note_entries` - Entries/updates within each note
- `entry_edits` - Edit history for entries

### 3. Create Your First User

After deployment, create a user in Supabase:

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add User" > "Create new user"
3. Enter email and password
4. After creating the user, go to Table Editor > profiles
5. Insert a new row with:
   - `id`: (copy from auth.users)
   - `email`: user's email
   - `username`: desired username

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### Netlify

1. Push your code to GitHub
2. Import project in Netlify
3. Add environment variables in Netlify site settings
4. Deploy

## Usage

### Login

Navigate to `/login` and enter your credentials.

### Dashboard

- View all notes in three tabs: All Notes, Edited Notes, Deleted Notes
- Use the search bar to find notes by title, code, or explanation
- Click "Create New Note" to add a new note

### Note Page

- View all entries for a specific note
- Click "Add Entry" to add code snippets and explanations
- Edit entries using the edit button
- Delete notes using the delete button

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Deployment**: Vercel/Netlify compatible

## Performance

The application is optimized for free hosting plans:

- Lightweight dependencies
- Efficient database queries with indexes
- Pagination for large datasets
- Optimized images and fonts

## License

MIT
