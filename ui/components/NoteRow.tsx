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

    <div className="grid grid-cols-[150px_120px_1fr_1fr_2fr] items-center border-b border-slate-700 py-3 px-2">

      {/* عنوان الملاحظة */}
      <div
        className="text-white font-medium cursor-pointer"
        onClick={() => router.push(`/notes/${id}`)}
      >
        {title}
      </div>


{/* لوحة التحكم */}
<div className="flex gap-4 justify-center">
  تعديل | حذف
</div>

{/* عدد الملاحظات */}
<div className="text-center">{entriesCount}</div>

{/* التاريخ */}
<div className="text-center">
  {new Date(createdAt).toLocaleDateString('ar-SA')}
</div>

{/* المسؤول */}
<div className="text-center">{author}</div>

{/* العنوان */}
<div className="text-right cursor-pointer">{title}</div>

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