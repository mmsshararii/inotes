/*
  # Create inotes Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `username` (text, unique)
      - `created_at` (timestamptz)
    
    - `notes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `author_username` (text)
      - `created_at` (timestamptz)
      - `deleted` (boolean, default false)
      - `deleted_by` (text, nullable)
      - `deleted_at` (timestamptz, nullable)
    
    - `note_entries`
      - `id` (uuid, primary key)
      - `note_id` (uuid, references notes)
      - `code` (text)
      - `explanation` (text)
      - `author_username` (text)
      - `created_at` (timestamptz)
    
    - `entry_edits`
      - `id` (uuid, primary key)
      - `entry_id` (uuid, references note_entries)
      - `previous_code` (text)
      - `previous_explanation` (text)
      - `editor_username` (text)
      - `edited_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Authenticated users can read all notes
    - Authenticated users can create, update, and delete notes/entries

  3. Indexes
    - Add indexes for better query performance on frequently searched fields
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author_username text NOT NULL,
  created_at timestamptz DEFAULT now(),
  deleted boolean DEFAULT false,
  deleted_by text,
  deleted_at timestamptz
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all notes"
  ON notes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create notes"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update notes"
  ON notes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete notes"
  ON notes FOR DELETE
  TO authenticated
  USING (true);

-- Create note_entries table
CREATE TABLE IF NOT EXISTS note_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  code text NOT NULL,
  explanation text NOT NULL,
  author_username text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE note_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all entries"
  ON note_entries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create entries"
  ON note_entries FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update entries"
  ON note_entries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete entries"
  ON note_entries FOR DELETE
  TO authenticated
  USING (true);

-- Create entry_edits table
CREATE TABLE IF NOT EXISTS entry_edits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid NOT NULL REFERENCES note_entries(id) ON DELETE CASCADE,
  previous_code text NOT NULL,
  previous_explanation text NOT NULL,
  editor_username text NOT NULL,
  edited_at timestamptz DEFAULT now()
);

ALTER TABLE entry_edits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all edits"
  ON entry_edits FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create edit history"
  ON entry_edits FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_deleted ON notes(deleted);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_title ON notes USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_note_entries_note_id ON note_entries(note_id);
CREATE INDEX IF NOT EXISTS idx_note_entries_created_at ON note_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_note_entries_code ON note_entries USING gin(to_tsvector('english', code));
CREATE INDEX IF NOT EXISTS idx_note_entries_explanation ON note_entries USING gin(to_tsvector('english', explanation));
CREATE INDEX IF NOT EXISTS idx_entry_edits_entry_id ON entry_edits(entry_id);
