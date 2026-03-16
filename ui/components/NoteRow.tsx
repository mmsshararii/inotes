"use client"

import { Pencil, Trash2 } from "lucide-react"

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

  const date = new Date(createdAt).toLocaleDateString("ar-SA")

  return (
    <div className="grid grid-cols-[150px_120px_1fr_1fr_2fr] items-center border-b border-slate-700 py-3 px-2">

      {/* لوحة التحكم */}
      <div className="flex gap-4 justify-center">

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

      {/* عدد الملاحظات */}
      <div className="text-center">{entriesCount}</div>

      {/* التاريخ */}
      <div className="text-center">{date}</div>

      {/* المسؤول */}
      <div className="text-center">{author}</div>

      {/* العنوان */}
      <div className="text-right cursor-pointer font-medium">
        {title}
      </div>

    </div>
  )
}