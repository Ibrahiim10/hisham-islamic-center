import { useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionCard } from '../components/ui/SectionCard';
import { Select } from '../components/ui/FormControls';
import { attendanceClasses, attendanceStudentsByClass } from '../data/mock';
import { cn } from '../utils/cn';

type AttendanceStatus = 'present' | 'absent' | null;

export function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState(attendanceClasses[0]!);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState(attendanceStudentsByClass);

  const students = rows[selectedClass] ?? [];

  const summary = useMemo(() => {
    const present = students.filter((s) => s.status === 'present').length;
    const absent = students.filter((s) => s.status === 'absent').length;
    const total = students.length;
    const pct = total ? Math.round((present / total) * 100) : 0;
    return { present, absent, total, pct };
  }, [students]);

  const setStatus = (id: string, status: AttendanceStatus) => {
    setRows((current) => ({
      ...current,
      [selectedClass]: (current[selectedClass] ?? []).map((student) =>
        student.id === id ? { ...student, status } : student,
      ),
    }));
  };

  return (
    <div className="flex flex-col gap-space-lg">
      <PageHeader
        breadcrumbs={['Admin', 'Attendance']}
        title="Daily Attendance Register"
        subtitle="Mark present/absent quickly by class and date"
        actions={
          <Button leftIcon={<MaterialIcon name="save" className="text-[18px]" />}>Save Attendance</Button>
        }
      />

      <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span className="font-label-md text-label-md text-on-surface">Date</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-10 rounded-lg border border-outline-variant/70 bg-surface-container-lowest px-3 font-body-sm text-body-sm"
          />
        </label>
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="font-label-md text-label-md text-on-surface">Class / Section</span>
          <Select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} className="h-10">
            {attendanceClasses.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-3">
        {[
          { label: 'Present', value: summary.present, color: 'text-success-text bg-success-bg border-success-border' },
          { label: 'Absent', value: summary.absent, color: 'text-danger-text bg-danger-bg border-danger-border' },
          { label: 'Attendance Rate', value: `${summary.pct}%`, color: 'text-primary-container bg-surface-container-high border-outline-variant/50' },
        ].map((item) => (
          <div key={item.label} className={cn('rounded-xl border p-space-md shadow-card', item.color)}>
            <p className="font-label-sm text-label-sm uppercase tracking-wider">{item.label}</p>
            <p className="mt-1 font-headline-lg text-headline-lg font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <SectionCard eyebrow="Student Roll Call" title={`${selectedClass} • ${summary.total} students`}>
        <div className="space-y-space-sm">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex flex-col gap-space-sm rounded-lg border border-outline-variant/40 bg-surface-container-low/40 p-space-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-title-sm text-title-sm text-on-surface">{student.fullName}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{student.regNo}</p>
              </div>
              <div className="inline-flex rounded-lg bg-surface-container-lowest p-1">
                <button
                  type="button"
                  onClick={() => setStatus(student.id, 'present')}
                  className={cn(
                    'rounded-md px-3 py-1.5 font-label-md text-label-md',
                    student.status === 'present' ? 'bg-primary-container text-white' : 'text-on-surface-variant',
                  )}
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(student.id, 'absent')}
                  className={cn(
                    'rounded-md px-3 py-1.5 font-label-md text-label-md',
                    student.status === 'absent' ? 'bg-error text-white' : 'text-on-surface-variant',
                  )}
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
