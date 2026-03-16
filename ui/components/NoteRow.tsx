'use client'

import { Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

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
  onDelete
}: NoteRowProps) {

  const router = useRouter()

  return (

    <div
      className="grid grid-cols-[2fr_1fr_1fr_120px_150px] items-center border-b border-slate-700 py-3 px-2 hover:bg-slate-800 transition"
    >

      {/* عنوان الملاحظة */}
      <div
        className="text-white font-medium cursor-pointer"
        onClick={() => router.push(`/notes/${id}`)}
      >
        {title}
      </div>


      {/* المسؤول */}
      <div className="text-slate-400 text-sm text-center">
        {author}
      </div>


      {/* التاريخ */}
      <div className="text-slate-400 text-sm text-center">
        {new Date(createdAt).toLocaleDateString()}
      </div>


      {/* عدد الملاحظات */}
      <div className="text-slate-400 text-sm text-center">
        {entriesCount}
      </div>


      {/* لوحة التحكم */}
      <div className="flex gap-4 justify-center">

        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(id)
          }}
          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
        >
          <Pencil size={16}/>
          تعديل
        </button>


        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(id)
          }}
          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
        >
          <Trash2 size={16}/>
          حذف
        </button>

      </div>

    </div>
  )
}