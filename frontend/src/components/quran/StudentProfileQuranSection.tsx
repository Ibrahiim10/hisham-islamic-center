import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QuranStudentPanel } from './QuranStudentPanel';
import { fetchStudentQuranSummary, formatAssessmentLabel, getQuranApiErrorMessage } from '../../services/quran.service';
import type { QuranStudentSummary } from '../../types/quran';
import { DataTable } from '../ui/DataTable';
import { EmptyState } from '../ui/EmptyState';
import { LoadingState } from '../ui/LoadingState';
import { SectionCard } from '../ui/SectionCard';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function StudentProfileQuranSection({ studentId }: { studentId: string }) {
  const [summary, setSummary] = useState<QuranStudentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStudentQuranSummary(studentId);
        if (!cancelled) setSummary(data);
      } catch (loadError) {
        if (!cancelled) {
          setSummary(null);
          setError(getQuranApiErrorMessage(loadError, 'Unable to load Qur\'an progress.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  if (loading) {
    return (
      <SectionCard title="Qur'an Progress" className="lg:col-span-2">
        <LoadingState label="Loading Qur'an learning history…" />
      </SectionCard>
    );
  }

  if (error) {
    return (
      <SectionCard title="Qur'an Progress" className="lg:col-span-2">
        <EmptyState title="Qur'an data unavailable" description={error} icon="cloud_off" />
      </SectionCard>
    );
  }

  if (!summary) return null;

  return (
    <div className="flex flex-col gap-space-md lg:col-span-2">
      <QuranStudentPanel summary={summary} />
      <SectionCard
        title="Learning history"
        action={
          <Link to="/admin/quran-learning" className="font-label-md text-label-md font-semibold text-brand-secondary hover:text-primary-container">
            Open Qur&apos;an module
          </Link>
        }
      >
        {summary.latestTeacherNotes ? (
          <p className="mb-space-md rounded-lg bg-surface-container-low p-space-sm font-body-sm text-body-sm text-on-surface-variant">
            <span className="font-semibold text-on-surface">Latest note: </span>
            {summary.latestTeacherNotes}
          </p>
        ) : null}
        {summary.history.length === 0 ? (
          <EmptyState title="No learning records yet" description="Add Sabaq or Muraja'ah from the Qur'an & Learning page." icon="menu_book" />
        ) : (
          <DataTable
            data={summary.history.slice(0, 10)}
            minWidthClassName="min-w-[760px]"
            columns={[
              { key: 'date', header: 'Date', cell: (row) => formatDate(row.date) },
              { key: 'type', header: 'Type', cell: (row) => row.type.toUpperCase() },
              { key: 'surah', header: 'Surah', cell: (row) => `${row.surahName} (${row.fromAyah}–${row.toAyah})` },
              { key: 'juz', header: 'Juz', cell: (row) => row.juz ?? '—' },
              { key: 'pages', header: 'Pages', cell: (row) => (row.pageFrom && row.pageTo ? `${row.pageFrom}–${row.pageTo}` : '—') },
              { key: 'assessment', header: 'Assessment', cell: (row) => formatAssessmentLabel(row.teacherAssessment) },
              {
                key: 'notes',
                header: 'Teacher notes',
                cell: (row) => row.teacherNotes?.trim() || '—',
              },
            ]}
          />
        )}
      </SectionCard>
    </div>
  );
}
