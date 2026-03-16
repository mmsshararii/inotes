'use client'

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

  return (
    <div className="flex items-center justify-between border-b border-slate-700 py-3 px-2 hover:bg-slate-800 transition">

      {/* Title */}
      <div className="flex-1 font-medium text-white">
        {title}
      </div>

      {/* Author */}
      <div className="w-40 text-slate-400 text-sm">
        {author}
      </div>

      {/* Date */}
      <div className="w-40 text-slate-400 text-sm">
        {new Date(createdAt).toLocaleDateString()}
      </div>

      {/* Entries */}
      <div className="w-24 text-slate-400 text-sm text-center">
        {entriesCount}
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-32 justify-end">
        <button
          onClick={() => onEdit(id)}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(id)}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          Delete
        </button>
      </div>

    </div>
  )
}