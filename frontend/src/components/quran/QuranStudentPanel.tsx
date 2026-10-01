import type { QuranStudentSummary } from '../../types/quran';
import { formatAssessmentLabel } from '../../services/quran.service';
import { SectionCard } from '../ui/SectionCard';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

type QuranStudentPanelProps = {
  summary: QuranStudentSummary | null;
  loading?: boolean;
};

export function QuranStudentPanel({ summary, loading }: QuranStudentPanelProps) {
  if (loading) {
    return (
      <SectionCard eyebrow="Qur'an Progress" title="Loading student progress…">
        <p className="font-body-sm text-body-sm text-on-surface-variant">Fetching learning records…</p>
      </SectionCard>
    );
  }

  if (!summary) {
    return (
      <SectionCard eyebrow="Qur'an Progress" title="No student selected">
        <p className="font-body-sm text-body-sm text-on-surface-variant">Select a student to view Sabaq and Muraja&apos;ah history.</p>
      </SectionCard>
    );
  }

  return (
    <div className="flex flex-col gap-space-md">
      <SectionCard eyebrow="Hifz Tracker" title={summary.studentName}>
        <div className="grid grid-cols-2 gap-space-sm font-body-sm text-body-sm md:grid-cols-4">
          <div className="rounded-lg bg-surface-container-low p-space-sm">
            <p className="text-on-surface-variant">Sabaq sessions</p>
            <p className="font-semibold text-on-surface">{summary.sabaqSessions}</p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-space-sm">
            <p className="text-on-surface-variant">Muraja&apos;ah sessions</p>
            <p className="font-semibold text-on-surface">{summary.murajaahSessions}</p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-space-sm">
            <p className="text-on-surface-variant">Pages recorded</p>
            <p className="font-semibold text-on-surface">{summary.pagesRecorded}</p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-space-sm">
            <p className="text-on-surface-variant">Last lesson</p>
            <p className="font-semibold text-on-surface">{summary.lastLessonDate ? formatDate(summary.lastLessonDate) : '—'}</p>
          </div>
        </div>
        {summary.currentSabaq ? (
          <div className="mt-space-md rounded-lg border border-outline-variant/40 p-space-md">
            <p className="font-label-sm text-label-sm uppercase text-brand-secondary">Current Sabaq</p>
            <p className="mt-1 font-body-md text-body-md text-on-surface">
              {summary.currentSabaq.surahName} ({summary.currentSabaq.fromAyah}–{summary.currentSabaq.toAyah})
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {formatDate(summary.currentSabaq.date)} · {formatAssessmentLabel(summary.currentSabaq.teacherAssessment)}
            </p>
          </div>
        ) : null}
      </SectionCard>
    </div>
  );
}
