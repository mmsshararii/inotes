'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type NoteRowProps = {
  id: string
  title: string
  author: string
  createdAt: string
  entriesCount: number
  onEdit: (id: string) => void
  onDelete: (id: string) => void
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

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_120px_150px] items-center border-b border-slate-700 py-3 px-3 hover:bg-slate-800/40 transition">

      {/* عنوان الملاحظة */}
      <div
        className="text-right cursor-pointer font-medium text-white"
        onClick={() => router.push(`/notes/${id}`)}
      >
        {title}
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
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(id)
          }}
          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
        >
          <Pencil size={16} />
          تعديل
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(id)
          }}
          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
        >
          <Trash2 size={16} />
          حذف
        </button>
      </div>

    </div>
  )
}