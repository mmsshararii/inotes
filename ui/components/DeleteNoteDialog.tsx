'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Trash2 } from "lucide-react"

type Props = {
  noteId: string
  noteTitle: string
  onConfirm: (id: string) => Promise<void>
}

export default function DeleteNoteDialog({
  noteId,
  noteTitle,
  onConfirm
}: Props) {

  return (

    <AlertDialog>

      <AlertDialogTrigger asChild>

        <button
          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
        >
          <Trash2 size={16} />
          حذف
        </button>

      </AlertDialogTrigger>

      <AlertDialogContent className="bg-slate-900 border-slate-700">

        <AlertDialogHeader>

          <AlertDialogTitle className="text-white">
            نقل الملاحظة إلى المحذوفات
          </AlertDialogTitle>

          <AlertDialogDescription className="text-slate-400">

            سيتم نقل الملاحظة:

            <span className="block mt-2 text-white font-semibold">
              {noteTitle}
            </span>

            إلى قسم الملاحظات المحذوفة ويمكن استرجاعها لاحقًا.

          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300">
            إلغاء
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() => onConfirm(noteId)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            نقل إلى المحذوفات
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>

  )
}