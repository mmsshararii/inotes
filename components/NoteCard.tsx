import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatHijriDate } from '@/lib/hijri';
import { User, Calendar } from 'lucide-react';

interface NoteCardProps {
  id: string;
  title: string;
  authorUsername: string;
  createdAt: string;
}

export function NoteCard({ id, title, authorUsername, createdAt }: NoteCardProps) {
  return (
    <Link href={`/notes/${id}`}>
      <Card className="hover:shadow-lg transition-all duration-200 hover:border-blue-500 cursor-pointer bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white line-clamp-2">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <User className="h-4 w-4" />
            <span>{authorUsername}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Calendar className="h-4 w-4" />
            <span className="font-arabic">{formatHijriDate(createdAt)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
