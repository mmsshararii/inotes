'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { NoteCard } from '@/components/NoteCard';
import { SearchBar } from '@/components/SearchBar';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, LogOut, Code as Code2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NoteRow from '@/ui/components/NoteRow'
const NOTES_PER_PAGE = 30;

interface Note {
  id: string;
  title: string;
  author_username: string;
  created_at: string;
  deleted: boolean;
  note_entries: { count: number }[];
}

export default function NotesPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editedNoteIds, setEditedNoteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchNotes();
      fetchEditedNotes();
    }
  }, [user, activeTab]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
  .from('notes')
  .select(`
    id,
    title,
    author_username,
    created_at,
    deleted,
    note_entries(count)
  `)
  .eq('deleted', activeTab === 'deleted')
  .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchEditedNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('entry_edits')
        .select('entry_id, note_entries(note_id)');

      if (error) throw error;

      const noteIds = new Set(
        data
          ?.map((edit: any) => edit.note_entries?.note_id)
          .filter((id): id is string => id !== null && id !== undefined) || []
      );

      setEditedNoteIds(noteIds);
    } catch (error) {
      console.error('Error fetching edited notes:', error);
    }
  };

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim() || !profile) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: newNoteTitle,
          author_username: profile.username,
        })
        .select()
        .single();

      if (error) throw error;

      setIsCreateDialogOpen(false);
      setNewNoteTitle('');
      router.push(`/notes/${data.id}`);
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'edited') {
      return matchesSearch && editedNoteIds.has(note.id);
    }

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredNotes.length / NOTES_PER_PAGE);
  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * NOTES_PER_PAGE,
    currentPage * NOTES_PER_PAGE
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div
  className="flex items-center gap-3 cursor-pointer"
  onClick={() => router.push('/notes')}
>
              <div className="bg-blue-600 p-2 rounded-lg">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">inotes</h1>
                <p className="text-sm text-slate-400">Developer Knowledge System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-300">
                Welcome, <span className="font-semibold">{profile?.username}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Notes</h2>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Note
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Note</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Enter a title for your new note
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                <div className="flex items-center justify-between text-slate-400 text-sm border-b border-slate-700 pb-2 mb-2">

  <div className="flex-1">Title</div>

  <div className="w-40 text-center">Author</div>

  <div className="w-40 text-center">Date</div>

  <div className="w-24 text-center">Entries</div>

  <div className="w-32 text-right">Actions</div>

</div>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-200">
                      Note Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., React Hooks Best Practices"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateNote}
                    disabled={!newNoteTitle.trim() || isCreating}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isCreating ? 'Creating...' : 'Create Note'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700 gap-2 p-1">
            <TabsTrigger
  value="all"
  className="px-4 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
>
  الملاحظات العامة
</TabsTrigger>

<TabsTrigger
  value="edited"
  className="px-4 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
>
  الملاحظات المعدلة
</TabsTrigger>

<TabsTrigger
  value="deleted"
  className="px-4 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300"
>
  الملاحظات المحذوفة
</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {paginatedNotes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">No notes found</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
  {paginatedNotes.map((note) => (
    <NoteRow
      key={note.id}
      id={note.id}
      title={note.title}
      author={note.author_username}
      createdAt={note.created_at}
      entriesCount={note.note_entries?.[0]?.count || 0}
      onEdit={(id) => router.push(`/notes/${id}`)}
      onDelete={(id) => console.log("delete", id)}
    />
  ))}
</div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="edited" className="space-y-4">
            {paginatedNotes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">No edited notes found</p>
              </div>
            ) : (
              <>
                <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">

  {/* صف العناوين */}
  <div className="grid grid-cols-[150px_120px_1fr_1fr_2fr] bg-slate-800 text-slate-300 text-sm font-semibold px-3 py-3">

  <div className="text-center">لوحة التحكم</div>
  <div className="text-center">عدد الملاحظات</div>
  <div className="text-center">تاريخ النشر</div>
  <div className="text-center">المسؤول</div>
  <div className="text-right">عنوان الملاحظة</div>

</div>


  {/* الصفوف */}
  {paginatedNotes.map((note) => (
    <NoteRow
      key={note.id}
      id={note.id}
      title={note.title}
      author={note.author_username}
      createdAt={note.created_at}
      entriesCount={0}
      onEdit={(id) => router.push(`/notes/${id}`)}
      onDelete={(id) => console.log("delete", id)}
    />
  ))}

</div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="deleted" className="space-y-4">
            {paginatedNotes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">No deleted notes found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      id={note.id}
                      title={note.title}
                      authorUsername={note.author_username}
                      createdAt={note.created_at}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
