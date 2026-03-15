import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          created_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          title: string;
          author_username: string;
          created_at: string;
          deleted: boolean;
          deleted_by: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          author_username: string;
          created_at?: string;
          deleted?: boolean;
          deleted_by?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          author_username?: string;
          created_at?: string;
          deleted?: boolean;
          deleted_by?: string | null;
          deleted_at?: string | null;
        };
      };
      note_entries: {
        Row: {
          id: string;
          note_id: string;
          code: string;
          explanation: string;
          author_username: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          note_id: string;
          code: string;
          explanation: string;
          author_username: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          note_id?: string;
          code?: string;
          explanation?: string;
          author_username?: string;
          created_at?: string;
        };
      };
      entry_edits: {
        Row: {
          id: string;
          entry_id: string;
          previous_code: string;
          previous_explanation: string;
          editor_username: string;
          edited_at: string;
        };
        Insert: {
          id?: string;
          entry_id: string;
          previous_code: string;
          previous_explanation: string;
          editor_username: string;
          edited_at?: string;
        };
        Update: {
          id?: string;
          entry_id?: string;
          previous_code?: string;
          previous_explanation?: string;
          editor_username?: string;
          edited_at?: string;
        };
      };
    };
  };
};
