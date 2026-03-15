import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CodeBlock } from './CodeBlock';
import { formatHijriDate } from '@/lib/hijri';
import { User, Calendar } from 'lucide-react';

interface EntryCardProps {
  entryNumber: number;
  code: string;
  explanation: string;
  authorUsername: string;
  createdAt: string;
}

export function EntryCard({
  entryNumber,
  code,
  explanation,
  authorUsername,
  createdAt,
}: EntryCardProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-400">
            Entry {entryNumber}
          </h3>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{authorUsername}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="font-arabic">{formatHijriDate(createdAt)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CodeBlock code={code} />
        <div className="text-slate-300 leading-relaxed">
          {explanation}
        </div>
      </CardContent>
    </Card>
  );
}
