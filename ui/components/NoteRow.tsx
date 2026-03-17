'use client'

import { useState } from 'react'
import { Pencil, CheckCircle2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DeleteNoteDialog from '@/ui/components/DeleteNoteDialog'

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

  return (
    <div className="grid grid-cols-[minmax(320px,2.6fr)_130px_150px_110px_170px] items-center border-b border-slate-700 py-3 px-3 hover:bg-slate-800/40 transition">

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
  className="flex items-center justify-center rounded-md bg-green-600/15 px-2 py-2 text-green-400 hover:bg-green-600/25 hover:text-green-300 disabled:opacity-50"
  title="حفظ التعديل"
>
  <CheckCircle2 size={20} strokeWidth={2.4} />
</button>

            <button
  onClick={() => {
    setIsEditing(false)
    setEditValue(title)
  }}
  disabled={isSaving}
  className="flex items-center justify-center rounded-md bg-slate-700/40 px-2 py-2 text-slate-300 hover:bg-slate-700/60 hover:text-white disabled:opacity-50"
  title="إلغاء"
>
  <X size={18} strokeWidth={2.4} />
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

        <DeleteNoteDialog
          noteId={id}
          noteTitle={title}
          onConfirm={onDelete}
        />
      </div>
    </div>
  )
}