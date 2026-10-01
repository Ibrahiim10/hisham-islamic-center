import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { FormField, Input, Select, Textarea } from '../ui/FormControls';
import { Modal } from '../ui/Modal';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { fetchStudents } from '../../services/students.service';
import {
  ASSESSMENT_OPTIONS,
  createQuranRecord,
  getQuranApiErrorMessage,
  updateQuranRecord,
} from '../../services/quran.service';
import type { QuranLessonRecord, QuranLessonType, SurahOption } from '../../types/quran';

type QuranLessonFormModalProps = {
  open: boolean;
  lessonType: QuranLessonType;
  surahs: SurahOption[];
  editingRecord?: QuranLessonRecord | null;
  defaultStudentId?: string;
  onClose: () => void;
  onSuccess: () => void;
};

export function QuranLessonFormModal({
  open,
  lessonType,
  surahs,
  editingRecord,
  defaultStudentId,
  onClose,
  onSuccess,
}: QuranLessonFormModalProps) {
  const [studentSearch, setStudentSearch] = useState('');
  const debouncedStudentSearch = useDebouncedValue(studentSearch, 300);
  const [studentOptions, setStudentOptions] = useState<Array<{ id: string; label: string }>>([]);
  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [surahNumber, setSurahNumber] = useState<number | ''>('');
  const [fromAyah, setFromAyah] = useState('');
  const [toAyah, setToAyah] = useState('');
  const [juz, setJuz] = useState('');
  const [pageFrom, setPageFrom] = useState('');
  const [pageTo, setPageTo] = useState('');
  const [teacherAssessment, setTeacherAssessment] = useState('');
  const [teacherNotes, setTeacherNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedSurah = useMemo(() => surahs.find((surah) => surah.number === surahNumber), [surahs, surahNumber]);
  const isMurajaah = lessonType === 'murajaah';

  useEffect(() => {
    if (!open) return;
    if (editingRecord) {
      setStudentId(editingRecord.studentId);
      setDate(editingRecord.date.slice(0, 10));
      setSurahNumber(editingRecord.surahNumber);
      setFromAyah(String(editingRecord.fromAyah));
      setToAyah(String(editingRecord.toAyah));
      setJuz(editingRecord.juz != null ? String(editingRecord.juz) : '');
      setPageFrom(editingRecord.pageFrom != null ? String(editingRecord.pageFrom) : '');
      setPageTo(editingRecord.pageTo != null ? String(editingRecord.pageTo) : '');
      setTeacherAssessment(editingRecord.teacherAssessment);
      setTeacherNotes(editingRecord.teacherNotes ?? '');
    } else {
      setStudentId(defaultStudentId ?? '');
      setDate(new Date().toISOString().slice(0, 10));
      setSurahNumber('');
      setFromAyah('');
      setToAyah('');
      setJuz('');
      setPageFrom('');
      setPageTo('');
      setTeacherAssessment('');
      setTeacherNotes('');
    }
    setErrorMessage(null);
  }, [open, editingRecord, defaultStudentId]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchStudents({
          search: debouncedStudentSearch || undefined,
          limit: 50,
          page: 1,
          status: 'active',
        });
        if (!cancelled) {
          setStudentOptions(
            result.items.map((student) => ({
              id: student.id,
              label: `${student.fullName} (${student.displayId})`,
            })),
          );
        }
      } catch {
        if (!cancelled) setStudentOptions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, debouncedStudentSearch]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    if (!studentId || !surahNumber || !fromAyah || !toAyah || !teacherAssessment) {
      setErrorMessage('Complete all required fields.');
      return;
    }

    const payload = {
      studentId,
      date: new Date(`${date}T12:00:00`).toISOString(),
      type: editingRecord?.type ?? lessonType,
      surahNumber,
      fromAyah: Number(fromAyah),
      toAyah: Number(toAyah),
      juz: juz ? Number(juz) : undefined,
      pageFrom: pageFrom ? Number(pageFrom) : undefined,
      pageTo: pageTo ? Number(pageTo) : undefined,
      teacherAssessment,
      teacherNotes: teacherNotes.trim() || undefined,
    };

    setSubmitting(true);
    setErrorMessage(null);
    try {
      if (editingRecord) {
        await updateQuranRecord(editingRecord.id, payload);
      } else {
        await createQuranRecord(payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      setErrorMessage(getQuranApiErrorMessage(error, 'Unable to save learning record.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingRecord ? 'Edit Learning Record' : isMurajaah ? 'Add Muraja\'ah' : 'Add Sabaq'}
      description={
        isMurajaah
          ? 'Record revision of previously memorized Qur\'an for the selected student.'
          : 'Record new daily memorization (Sabaq) for the selected student.'
      }
      className="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="quran-lesson-form" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save Record'}
          </Button>
        </>
      }
    >
      <form id="quran-lesson-form" className="space-y-space-md" onSubmit={(event) => void handleSubmit(event)}>
        {errorMessage ? (
          <div className="rounded-lg border border-error/30 bg-error-container/40 px-3 py-2 font-body-sm text-body-sm text-error" role="alert">
            {errorMessage}
          </div>
        ) : null}

        <FormField label="Search student">
          <Input value={studentSearch} onChange={(event) => setStudentSearch(event.target.value)} placeholder="Type student name…" />
        </FormField>
        <FormField label="Student">
          <Select value={studentId} onChange={(event) => setStudentId(event.target.value)}>
            <option value="">Select student</option>
            {studentOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Date">
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
        </FormField>
        <FormField label="Surah">
          <Select
            value={surahNumber === '' ? '' : String(surahNumber)}
            onChange={(event) => setSurahNumber(event.target.value ? Number(event.target.value) : '')}
          >
            <option value="">Select Surah</option>
            {surahs.map((surah) => (
              <option key={surah.number} value={surah.number}>
                {surah.number}. {surah.name}
              </option>
            ))}
          </Select>
          {selectedSurah ? (
            <span className="font-body-sm text-body-sm text-on-surface-variant">{selectedSurah.ayahCount} ayahs</span>
          ) : null}
        </FormField>
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
          <FormField label="From Ayah">
            <Input type="number" min={1} value={fromAyah} onChange={(event) => setFromAyah(event.target.value)} required />
          </FormField>
          <FormField label="To Ayah">
            <Input type="number" min={1} value={toAyah} onChange={(event) => setToAyah(event.target.value)} required />
          </FormField>
          <FormField label="Juz (optional)">
            <Input type="number" min={1} max={30} value={juz} onChange={(event) => setJuz(event.target.value)} />
          </FormField>
          <FormField label="Page From (optional)">
            <Input type="number" min={1} value={pageFrom} onChange={(event) => setPageFrom(event.target.value)} />
          </FormField>
          <FormField label="Page To (optional)" className="sm:col-span-2">
            <Input type="number" min={1} value={pageTo} onChange={(event) => setPageTo(event.target.value)} />
          </FormField>
        </div>
        <FormField label="Teacher Assessment">
          <Select value={teacherAssessment} onChange={(event) => setTeacherAssessment(event.target.value)}>
            <option value="">Select assessment</option>
            {ASSESSMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Teacher Notes">
          <Textarea value={teacherNotes} onChange={(event) => setTeacherNotes(event.target.value)} placeholder="Optional notes for this lesson" />
        </FormField>
      </form>
    </Modal>
  );
}
