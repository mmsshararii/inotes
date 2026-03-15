'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { EntryCard } from '@/components/EntryCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Code as Code2, Trash2, CreditCard as Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatHijriDate } from '@/lib/hijri';

interface Note {
  id: string;
  title: string;
  author_username: string;
  created_at: string;
  deleted: boolean;
}

interface Entry {
  id: string;
  note_id: string;
  code: string;
  explanation: string;
  author_username: string;
  created_at: string;
}

export default function NotePage({ params }: { params: { id: string } }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [newCode, setNewCode] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchNote();
      fetchEntries();
    }
  }, [user, params.id]);

  const fetchNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', params.id)
        .maybeSingle();

      if (error) throw error;
      setNote(data);
    } catch (error) {
      console.error('Error fetching note:', error);
    }
  };

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('note_entries')
        .select('*')
        .eq('note_id', params.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleAddEntry = async () => {
    if (!newCode.trim() || !newExplanation.trim() || !profile) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('note_entries')
        .insert({
          note_id: params.id,
          code: newCode,
          explanation: newExplanation,
          author_username: profile.username,
        });

      if (error) throw error;

      setIsAddDialogOpen(false);
      setNewCode('');
      setNewExplanation('');
      fetchEntries();
    } catch (error) {
      console.error('Error adding entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEntry = async () => {
    if (!editingEntry || !newCode.trim() || !newExplanation.trim() || !profile) return;

    setIsSubmitting(true);
    try {
      await supabase.from('entry_edits').insert({
        entry_id: editingEntry.id,
        previous_code: editingEntry.code,
        previous_explanation: editingEntry.explanation,
        editor_username: profile.username,
      });

      const { error } = await supabase
        .from('note_entries')
        .update({
          code: newCode,
          explanation: newExplanation,
        })
        .eq('id', editingEntry.id);

      if (error) throw error;

      setIsEditDialogOpen(false);
      setEditingEntry(null);
      setNewCode('');
      setNewExplanation('');
      fetchEntries();
    } catch (error) {
      console.error('Error editing entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!note || !profile) return;

    const confirmed = confirm('Are you sure you want to delete this note?');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('notes')
        .update({
          deleted: true,
          deleted_by: profile.username,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', note.id);

      if (error) throw error;

      router.push('/notes');
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const openEditDialog = (entry: Entry) => {
    setEditingEntry(entry);
    setNewCode(entry.code);
    setNewExplanation(entry.explanation);
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-lg">Note not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/notes">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Notes
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteNote}
                className="bg-red-900/20 border-red-700 text-red-400 hover:bg-red-900/30"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Note
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{note.title}</h1>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Created by {note.author_username}</span>
            <span>•</span>
            <span className="font-arabic">{formatHijriDate(note.created_at)}</span>
          </div>
        </div>

        <div className="mb-6">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Entry</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Add a code snippet and explanation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-slate-200">
                    Code Snippet
                  </Label>
                  <Textarea
                    id="code"
                    placeholder="Enter your code here..."
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 font-mono min-h-[200px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="explanation" className="text-slate-200">
                    Explanation
                  </Label>
                  <Textarea
                    id="explanation"
                    placeholder="Explain what this code does..."
                    value={newExplanation}
                    onChange={(e) => setNewExplanation(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 min-h-[120px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddEntry}
                  disabled={!newCode.trim() || !newExplanation.trim() || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? 'Adding...' : 'Add Entry'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Entry</DialogTitle>
              <DialogDescription className="text-slate-400">
                Update the code snippet and explanation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code" className="text-slate-200">
                  Code Snippet
                </Label>
                <Textarea
                  id="edit-code"
                  placeholder="Enter your code here..."
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 font-mono min-h-[200px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-explanation" className="text-slate-200">
                  Explanation
                </Label>
                <Textarea
                  id="edit-explanation"
                  placeholder="Explain what this code does..."
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 min-h-[120px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleEditEntry}
                disabled={!newCode.trim() || !newExplanation.trim() || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="space-y-6">
          {entries.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/50 border border-slate-700 rounded-lg">
              <Code2 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No entries yet. Add your first entry!</p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <div key={entry.id} className="relative group">
                <EntryCard
                  entryNumber={entries.length - index}
                  code={entry.code}
                  explanation={entry.explanation}
                  authorUsername={entry.author_username}
                  createdAt={entry.created_at}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(entry)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
