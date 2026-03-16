'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { SearchBar } from '@/components/SearchBar'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, LogOut, Code as Code2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import NoteRow from '@/ui/components/NoteRow'

const NOTES_PER_PAGE = 30

interface Note {
  id: string
  title: string
  author_username: string
  created_at: string
  deleted: boolean
  note_entries: { count: number }[]
}

export default function NotesPage() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()

  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [editedNoteIds, setEditedNoteIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchNotes()
      fetchEditedNotes()
    }
  }, [user, activeTab])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchQuery])

  const fetchNotes = async () => {
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
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notes:', error)
      return
    }

    setNotes(data || [])
  }

  const fetchEditedNotes = async () => {
    const { data, error } = await supabase
      .from('entry_edits')
      .select('entry_id, note_entries(note_id)')

    if (error) {
      console.error('Error fetching edited notes:', error)
      return
    }

    const noteIds = new Set(
      data
        ?.map((edit: any) => edit.note_entries?.note_id)
        .filter((id): id is string => id !== null && id !== undefined) || []
    )

    setEditedNoteIds(noteIds)
  }

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim() || !profile) return

    setIsCreating(true)

    const { data, error } = await supabase
      .from('notes')
      .insert({
        title: newNoteTitle,
        author_username: profile.username
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating note:', error)
      setIsCreating(false)
      return
    }

    setIsCreateDialogOpen(false)
    setNewNoteTitle('')
    router.push(`/notes/${data.id}`)
    setIsCreating(false)
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    if (activeTab === 'edited') {
      return matchesSearch && editedNoteIds.has(note.id)
    }

    return matchesSearch
  })

  const totalPages = Math.ceil(filteredNotes.length / NOTES_PER_PAGE)

  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * NOTES_PER_PAGE,
    currentPage * NOTES_PER_PAGE
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-lg">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      {/* الكتلة الثابتة كاملة */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-700">

        {/* الهيدر */}
        <div className="border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => router.push('/notes')}
            >
              <div className="bg-blue-600 p-2 rounded-lg">
                <Code2 className="h-6 w-6 text-white" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">inotes</h1>
                <p className="text-sm text-slate-400">
                  Developer Knowledge System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-slate-300">
                مرحبًا <b>{profile?.username}</b>
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="bg-slate-800 border-slate-700 text-slate-200"
              >
                <LogOut className="h-4 w-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>

          </div>
        </div>

        {/* بقية المستطيل الثابت بدون فراغ سفلي */}
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-0 space-y-6">

          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white">الملاحظات</h2>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة ملاحظة جديدة
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    إضافة ملاحظة جديدة
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    أدخل عنوان الملاحظة
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                  <Label className="text-slate-200">عنوان الملاحظة</Label>

                  <Input
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>

                <DialogFooter>
                  <Button
                    onClick={handleCreateNote}
                    disabled={!newNoteTitle.trim() || isCreating}
                    className="bg-blue-600"
                  >
                    {isCreating ? 'جاري الإضافة...' : 'إضافة'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800 border border-slate-700">
              <TabsTrigger value="all">الملاحظات العامة</TabsTrigger>
              <TabsTrigger value="edited">الملاحظات المعدلة</TabsTrigger>
              <TabsTrigger value="deleted">الملاحظات المحذوفة</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* صف العناوين - من اليمين إلى اليسار */}
          <div className="grid grid-cols-[2fr_1fr_1fr_120px_150px] bg-slate-800/95 text-slate-300 text-sm font-semibold px-3 py-3 border-b border-slate-700 rounded-t-lg">
            <div className="text-right">عنوان الملاحظة</div>
            <div className="text-center">المسؤول</div>
            <div className="text-center">تاريخ النشر</div>
            <div className="text-center">عدد الملاحظات</div>
            <div className="text-center">لوحة التحكم</div>
          </div>

        </div>
      </div>

      {/* الصفوف تتحرك مباشرة أسفل الجدول بدون فراغ */}
      <div className="max-w-7xl mx-auto px-4 pb-8 mt-0">
        {paginatedNotes.map((note) => (
          <NoteRow
            key={note.id}
            id={note.id}
            title={note.title}
            author={note.author_username}
            createdAt={note.created_at}
            entriesCount={note.note_entries?.[0]?.count || 0}
            onEdit={(id) => router.push(`/notes/${id}`)}
            onDelete={(id) => console.log('delete', id)}
          />
        ))}

        {totalPages > 1 && (
          <div className="pt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}