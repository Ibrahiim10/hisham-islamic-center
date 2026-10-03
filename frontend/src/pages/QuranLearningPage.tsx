import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { QuranLessonFormModal } from '../components/quran/QuranLessonFormModal';
import { QuranStudentPanel } from '../components/quran/QuranStudentPanel';
import { Button } from '../components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { Modal } from '../components/ui/Modal';
import { SearchInput } from '../components/ui/SearchInput';
import { SectionCard } from '../components/ui/SectionCard';
import { Select } from '../components/ui/FormControls';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import {
  deleteQuranRecord,
  fetchQuranRecords,
  fetchQuranStats,
  fetchStudentQuranSummary,
  fetchSurahs,
  formatAssessmentLabel,
  getQuranApiErrorMessage,
} from '../services/quran.service';
import type { QuranLessonRecord, QuranLessonType, QuranModuleStats, QuranStudentSummary, SurahOption } from '../types/quran';
import { cn } from '../utils/cn';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function QuranLearningPage() {
  const [surahs, setSurahs] = useState<SurahOption[]>([]);
  const [stats, setStats] = useState<QuranModuleStats | null>(null);
  const [records, setRecords] = useState<QuranLessonRecord[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [studentSummary, setStudentSummary] = useState<QuranStudentSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [typeFilter, setTypeFilter] = useState<'sabaq' | 'murajaah' | ''>('');
  const [surahFilter, setSurahFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<QuranLessonType>('sabaq');
  const [editingRecord, setEditingRecord] = useState<QuranLessonRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<QuranLessonRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSurahs().then(setSurahs).catch(() => setSurahs([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsData, recordsData] = await Promise.all([
          fetchQuranStats(),
          fetchQuranRecords({
            search: debouncedSearch || undefined,
            type: typeFilter || undefined,
            surahNumber: surahFilter ? Number(surahFilter) : undefined,
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
            page: 1,
            limit: 50,
          }),
        ]);
        if (!cancelled) {
          setStats(statsData);
          setRecords(recordsData.items);
          setSelectedStudentId((current) => current || recordsData.items[0]?.studentId || '');
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getQuranApiErrorMessage(loadError, 'Unable to load Qur\'an learning data.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, typeFilter, surahFilter, dateFrom, dateTo, reloadToken]);

  useEffect(() => {
    if (!selectedStudentId) {
      setStudentSummary(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setSummaryLoading(true);
      try {
        const summary = await fetchStudentQuranSummary(selectedStudentId);
        if (!cancelled) setStudentSummary(summary);
      } catch {
        if (!cancelled) setStudentSummary(null);
      } finally {
        if (!cancelled) setSummaryLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedStudentId, reloadToken]);

  const studentOptions = useMemo(() => {
    const map = new Map<string, { id: string; name: string; className: string }>();
    for (const record of records) {
      map.set(record.studentId, { id: record.studentId, name: record.studentName, className: record.className });
    }
    if (studentSummary) {
      map.set(studentSummary.studentId, {
        id: studentSummary.studentId,
        name: studentSummary.studentName,
        className: studentSummary.className,
      });
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [records, studentSummary]);

  function openCreate(type: QuranLessonType) {
    setFormType(type);
    setEditingRecord(null);
    setFormOpen(true);
  }

  function refreshAll(message?: string) {
    setReloadToken((value) => value + 1);
    if (message) setSuccessMessage(message);
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await deleteQuranRecord(deleteTarget.id);
      setDeleteTarget(null);
      refreshAll('Learning record deleted.');
    } catch (error) {
      setError(getQuranApiErrorMessage(error, 'Unable to delete record.'));
    } finally {
      setDeleting(false);
    }
  }

  if (loading && !stats) {
    return (
      <div className="py-space-xl">
        <LoadingState label="Loading Qur'an & Learning…" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="relative overflow-hidden rounded-xl bg-primary-container p-space-lg text-on-primary shadow-md lg:p-space-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-brand-secondary/15 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-space-lg lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h1 className="font-headline-xl text-headline-xl tracking-tight text-on-primary">Qur&apos;an & Learning</h1>
            <p className="mt-1 max-w-xl font-body-md text-body-md text-on-primary-container">
              Sabaq memorization, Muraja&apos;ah revision, and teacher assessments backed by MongoDB learning records.
            </p>
          </div>
          <div className="flex flex-wrap gap-space-sm">
            <Button
              variant="secondary"
              leftIcon={<MaterialIcon name="menu_book" className="text-[20px]" />}
              onClick={() => openCreate('sabaq')}
            >
              Add Sabaq
            </Button>
            <Button
              variant="ghost"
              className="border border-white/10 bg-white/5 text-on-primary hover:bg-white/10"
              leftIcon={<MaterialIcon name="history_edu" className="text-[20px]" />}
              onClick={() => openCreate('murajaah')}
            >
              Add Muraja&apos;ah
            </Button>
          </div>
        </div>
        {stats ? (
          <div className="relative z-10 mt-space-lg grid grid-cols-2 gap-space-md rounded-lg bg-tertiary-container/60 p-space-md backdrop-blur-sm sm:grid-cols-4">
            {[
              ['Total lessons', String(stats.totalLessons)],
              ['Sabaq records', String(stats.sabaqCount)],
              ['Muraja\'ah records', String(stats.murajaahCount)],
              ['Lessons today', String(stats.lessonsToday)],
            ].map(([label, value]) => (
              <div key={label}>
                <span className="font-label-sm text-label-sm uppercase text-on-primary-container">{label}</span>
                <p className="mt-1 font-headline-lg text-headline-lg font-bold text-on-primary">{value}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {successMessage ? (
        <div className="rounded-lg border border-primary-container/20 bg-surface-container-low px-space-md py-space-sm font-body-sm text-body-sm text-on-surface">
          {successMessage}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-lg border border-error/30 bg-error-container/40 px-space-md py-space-sm font-body-sm text-body-sm text-error">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-space-sm md:grid-cols-12">
        <SearchInput containerClassName="md:col-span-4" placeholder="Search student…" value={search} onChange={(event) => setSearch(event.target.value)} />
        <Select className="md:col-span-2 h-10" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as typeof typeFilter)}>
          <option value="">All types</option>
          <option value="sabaq">Sabaq</option>
          <option value="murajaah">Muraja&apos;ah</option>
        </Select>
        <Select className="md:col-span-2 h-10" value={surahFilter} onChange={(event) => setSurahFilter(event.target.value)}>
          <option value="">All Surahs</option>
          {surahs.map((surah) => (
            <option key={surah.number} value={surah.number}>
              {surah.number}. {surah.name}
            </option>
          ))}
        </Select>
        <InputDate className="md:col-span-2" label="From" value={dateFrom} onChange={setDateFrom} />
        <InputDate className="md:col-span-2" label="To" value={dateTo} onChange={setDateTo} />
      </div>

      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <SectionCard className="lg:col-span-4" eyebrow="Students" title="Learning roster" bodyClassName="space-y-space-sm max-h-[420px] overflow-y-auto">
          {studentOptions.length === 0 ? (
            <EmptyState title="No students yet" description="Add a Sabaq record to begin tracking." icon="school" />
          ) : (
            studentOptions.map((student) => (
              <button
                key={student.id}
                type="button"
                onClick={() => setSelectedStudentId(student.id)}
                className={cn(
                  'w-full rounded-lg border p-space-sm text-left transition-colors',
                  selectedStudentId === student.id ? 'border-brand-secondary bg-surface-container-low' : 'border-outline-variant/40 hover:bg-surface-container-low/60',
                )}
              >
                <p className="font-title-sm text-title-sm text-on-surface">{student.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{student.className}</p>
                <Link to={`/admin/students/${student.id}`} className="mt-1 inline-block font-label-sm text-label-sm text-brand-secondary hover:underline" onClick={(event) => event.stopPropagation()}>
                  View profile
                </Link>
              </button>
            ))
          )}
        </SectionCard>

        <div className="flex flex-col gap-space-lg lg:col-span-8">
          <QuranStudentPanel summary={studentSummary} loading={summaryLoading} />

          <SectionCard eyebrow="Learning history" title="Recent records">
            {records.length === 0 ? (
              <EmptyState title="No learning records" description="Add Sabaq or Muraja'ah to populate this list." icon="menu_book" />
            ) : (
              <DataTable<QuranLessonRecord>
                minWidthClassName="min-w-[920px]"
                data={records}
                columns={[
                  { key: 'date', header: 'Date', cell: (row) => formatDate(row.date) },
                  {
                    key: 'type',
                    header: 'Type',
                    cell: (row) => (
                      <span className={cn('rounded-full px-2 py-0.5 font-label-sm text-label-sm font-semibold uppercase', row.type === 'sabaq' ? 'bg-brand-secondary/15 text-brand-secondary' : 'bg-primary-container/10 text-primary-container')}>
                        {row.type}
                      </span>
                    ),
                  },
                  { key: 'student', header: 'Student', cell: (row) => row.studentName },
                  { key: 'surah', header: 'Surah', cell: (row) => `${row.surahName} (${row.fromAyah}–${row.toAyah})` },
                  { key: 'juz', header: 'Juz', cell: (row) => row.juz ?? '—' },
                  { key: 'pages', header: 'Pages', cell: (row) => (row.pageFrom && row.pageTo ? `${row.pageFrom}–${row.pageTo}` : '—') },
                  { key: 'assessment', header: 'Assessment', cell: (row) => formatAssessmentLabel(row.teacherAssessment) },
                  {
                    key: 'actions',
                    header: '',
                    className: 'text-right',
                    cell: (row) => (
                      <div className="inline-flex gap-1">
                        <button type="button" className="rounded-lg px-2 py-1 text-label-sm text-primary-container hover:bg-surface-container-low" onClick={() => { setFormType(row.type); setEditingRecord(row); setFormOpen(true); }}>
                          Edit
                        </button>
                        <button type="button" className="rounded-lg px-2 py-1 text-label-sm text-error hover:bg-surface-container-low" onClick={() => setDeleteTarget(row)}>
                          Delete
                        </button>
                      </div>
                    ),
                  },
                ]}
              />
            )}
          </SectionCard>
        </div>
      </div>

      <QuranLessonFormModal
        open={formOpen}
        lessonType={formType}
        surahs={surahs}
        editingRecord={editingRecord}
        defaultStudentId={selectedStudentId}
        onClose={() => {
          setFormOpen(false);
          setEditingRecord(null);
        }}
        onSuccess={() => refreshAll(editingRecord ? 'Learning record updated.' : 'Learning record saved.')}
      />

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Delete learning record?"
        description="This removes the Qur'an lesson record only. The student and other modules are not affected."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="accent" onClick={() => void confirmDelete()} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete record'}
            </Button>
          </>
        }
      />
    </div>
  );
}

function InputDate({ label, value, onChange, className }: { label: string; value: string; onChange: (value: string) => void; className?: string }) {
  return (
    <label className={cn('flex flex-col gap-1 font-body-sm text-body-sm', className)}>
      <span className="text-on-surface-variant">{label}</span>
      <input type="date" className="h-10 rounded-lg border border-outline-variant/70 bg-surface-container-lowest px-3" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
