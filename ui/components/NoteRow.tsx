'use client'
import DeleteNoteDialog from '@/ui/components/DeleteNoteDialog'
import { useState } from 'react'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

type NoteRowProps = {
  id: string
  title: string
  author: string
  createdAt: string
  entriesCount: number
  onEdit: (id: string, newTitle: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function NoteRow({
  id,
  title,
  author,
  createdAt,
  entriesCount,
  onEdit,
  onDelete,
}: NoteRowProps) {
  const router = useRouter()
  const date = new Date(createdAt).toLocaleDateString('ar-SA')

  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(title)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSave = async () => {
    const trimmed = editValue.trim()
    if (!trimmed || trimmed === title) {
      setIsEditing(false)
      setEditValue(title)
      return
    }

    setIsSaving(true)
    try {
      await onEdit(id, trimmed)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }
     {/* عنوان الحذف */}<DeleteNoteDialog
  noteId={id}
  noteTitle={title}
  onConfirm={onDelete}
/>

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_120px_180px] items-center border-b border-slate-700 py-3 px-3 hover:bg-slate-800/40 transition">

      {/* عنوان الملاحظة */}
      <div className="text-right">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-white outline-none"
              autoFocus
            />

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1 text-green-400 hover:text-green-300 text-sm"
            >
              <Check size={16} />
            </button>

            <button
              onClick={() => {
                setIsEditing(false)
                setEditValue(title)
              }}
              disabled={isSaving}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-300 text-sm"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            className="cursor-pointer font-medium text-white"
            onClick={() => router.push(`/notes/${id}`)}
          >
            {title}
          </div>
        )}
      </div>

      {/* المسؤول */}
      <div className="text-center text-slate-300">
        {author}
      </div>

      {/* التاريخ */}
      <div className="text-center text-slate-300">
        {date}
      </div>

      {/* عدد الملاحظات */}
      <div className="text-center text-slate-300">
        {entriesCount}
      </div>

      {/* لوحة التحكم */}
      <div className="flex items-center justify-center gap-4">
        {!isEditing && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
          >
            <Pencil size={16} />
            تعديل
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDelete()
          }}
          disabled={isDeleting}
          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm disabled:opacity-50"
        >
          <Trash2 size={16} />
          حذف
        </button>
      </div>
    </div>
  )
}