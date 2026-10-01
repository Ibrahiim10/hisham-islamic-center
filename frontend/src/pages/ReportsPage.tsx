import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionCard } from '../components/ui/SectionCard';
import { Button } from '../components/ui/Button';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { StatCard } from '../components/ui/StatCard';
import { DataTable } from '../components/ui/DataTable';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { SearchInput } from '../components/ui/SearchInput';
import { Select } from '../components/ui/FormControls';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import type { ReportProgram, ReportTab } from '../types/reports';
import { formatKes } from '../utils/format';
import { downloadCsv } from '../utils/csvExport';
import {
  fetchAttendanceReport,
  fetchFeeReport,
  fetchQuranReport,
  fetchReportsOverview,
  fetchStudentReport,
  getReportsApiErrorMessage,
} from '../services/reports.service';

const TABS: Array<{ id: ReportTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'students', label: 'Students' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'fees', label: 'Fees' },
  { id: 'quran', label: "Qur'an" },
];

function getDefaultMonthValue(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function parseMonthValue(value: string): { month: number; year: number } {
  const [yearPart, monthPart] = value.split('-');
  return { year: Number(yearPart), month: Number(monthPart) };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function programLabel(program: ReportProgram | ''): string {
  if (program === 'tahfidh') return 'Tahfidh';
  if (program === 'farbar') return 'Farbar';
  if (program === 'women') return 'Women Section';
  return 'All programs';
}

export function ReportsPage() {
  const [tab, setTab] = useState<ReportTab>('overview');
  const [monthValue, setMonthValue] = useState(getDefaultMonthValue);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [program, setProgram] = useState<ReportProgram | ''>('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'partial' | 'unpaid' | ''>('');
  const [lessonType, setLessonType] = useState<'sabaq' | 'murajaah' | ''>('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const [overview, setOverview] = useState<Awaited<ReturnType<typeof fetchReportsOverview>> | null>(null);
  const [studentReport, setStudentReport] = useState<Awaited<ReturnType<typeof fetchStudentReport>> | null>(null);
  const [attendanceReport, setAttendanceReport] = useState<Awaited<ReturnType<typeof fetchAttendanceReport>> | null>(null);
  const [feeReport, setFeeReport] = useState<Awaited<ReturnType<typeof fetchFeeReport>> | null>(null);
  const [quranReport, setQuranReport] = useState<Awaited<ReturnType<typeof fetchQuranReport>> | null>(null);

  const { month, year } = useMemo(() => parseMonthValue(monthValue), [monthValue]);

  const queryBase = useMemo(
    () => ({
      month,
      year,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      program: program || undefined,
      search: debouncedSearch || undefined,
    }),
    [month, year, dateFrom, dateTo, program, debouncedSearch],
  );

  const filterSummary = useMemo(() => {
    const parts = [`Period: ${monthValue}`, programLabel(program)];
    if (dateFrom && dateTo) parts.push(`${dateFrom} – ${dateTo}`);
    return parts.join(' · ');
  }, [monthValue, program, dateFrom, dateTo]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (tab === 'overview') {
          const [data, attendanceData, feeData] = await Promise.all([
            fetchReportsOverview(queryBase),
            fetchAttendanceReport({ ...queryBase, limit: 1 }),
            fetchFeeReport({ ...queryBase, limit: 1 }),
          ]);
          if (!cancelled) {
            setOverview(data);
            setAttendanceReport(attendanceData);
            setFeeReport(feeData);
          }
        } else if (tab === 'students') {
          const data = await fetchStudentReport({ ...queryBase, limit: 50 });
          if (!cancelled) setStudentReport(data);
        } else if (tab === 'attendance') {
          const data = await fetchAttendanceReport({ ...queryBase, limit: 50 });
          if (!cancelled) setAttendanceReport(data);
        } else if (tab === 'fees') {
          const data = await fetchFeeReport({
            ...queryBase,
            paymentStatus: paymentStatus || undefined,
            limit: 50,
          });
          if (!cancelled) setFeeReport(data);
        } else {
          const data = await fetchQuranReport({
            ...queryBase,
            type: lessonType || undefined,
            limit: 50,
          });
          if (!cancelled) setQuranReport(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getReportsApiErrorMessage(loadError, 'Unable to load report data.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tab, queryBase, paymentStatus, lessonType, reloadToken]);

  function resetFilters() {
    setMonthValue(getDefaultMonthValue());
    setDateFrom('');
    setDateTo('');
    setProgram('');
    setSearch('');
    setPaymentStatus('');
    setLessonType('');
    setReloadToken((token) => token + 1);
  }

  const handlePrint = useCallback(() => {
    document.body.classList.add('printing-reports');
    window.print();
    window.setTimeout(() => document.body.classList.remove('printing-reports'), 500);
  }, []);

  const handleExport = useCallback(async () => {
    const exportLimit = 5000;
    try {
      if (tab === 'students') {
        const data = await fetchStudentReport({ ...queryBase, limit: exportLimit });
        downloadCsv(
          `students-report-${monthValue}.csv`,
          ['Student ID', 'Full Name', 'Gender', 'DOB', 'Parent Phone', 'Program', 'Monthly Fee', 'Status'],
          data.items.map((row) => [
            row.displayId,
            row.fullName,
            row.gender,
            formatDate(row.dateOfBirth),
            row.parentPhone,
            row.program,
            row.monthlyFee,
            row.status,
          ]),
        );
      } else if (tab === 'attendance') {
        const data = await fetchAttendanceReport({ ...queryBase, limit: exportLimit });
        downloadCsv(
          `attendance-report-${monthValue}.csv`,
          ['Date', 'Student', 'Program', 'Status'],
          data.items.map((row) => [formatDate(row.date), row.studentName, row.program, row.status]),
        );
      } else if (tab === 'fees') {
        const data = await fetchFeeReport({ ...queryBase, paymentStatus: paymentStatus || undefined, limit: exportLimit });
        downloadCsv(
          `fees-report-${monthValue}.csv`,
          ['Student', 'Program', 'Month', 'Year', 'Amount', 'Method', 'M-Pesa Ref', 'Payment Date', 'Status'],
          data.payments.map((row) => [
            row.studentName,
            row.program,
            row.month,
            row.year,
            row.amount,
            row.paymentMethod,
            row.mpesaReference,
            formatDate(row.paymentDate),
            row.status,
          ]),
        );
      } else if (tab === 'quran') {
        const data = await fetchQuranReport({ ...queryBase, type: lessonType || undefined, limit: exportLimit });
        downloadCsv(
          `quran-report-${monthValue}.csv`,
          ['Date', 'Student', 'Type', 'Surah', 'Ayah From', 'Ayah To', 'Juz', 'Pages', 'Assessment', 'Notes'],
          data.items.map((row) => [
            formatDate(row.date),
            row.studentName,
            row.type,
            row.surahName,
            row.fromAyah,
            row.toAyah,
            row.juz ?? '',
            row.pageFrom && row.pageTo ? `${row.pageFrom}-${row.pageTo}` : '',
            row.teacherAssessment,
            row.teacherNotes ?? '',
          ]),
        );
      } else {
        const data = await fetchReportsOverview(queryBase);
        downloadCsv(`reports-overview-${monthValue}.csv`, ['Metric', 'Value'], [
          ['Active students', data.students.active],
          ['Attendance present', data.attendance.present],
          ['Fees collected (KES)', data.fees.collected],
          ['Sabaq sessions', data.quran.sabaq],
          ['Murajaah sessions', data.quran.murajaah],
        ]);
      }
    } catch (exportError) {
      setError(getReportsApiErrorMessage(exportError, 'Unable to export report.'));
    }
  }, [tab, queryBase, monthValue, paymentStatus, lessonType]);

  const attendanceChartData = attendanceReport?.trend ?? [];
  const feeChartData =
    feeReport?.trend.map((point) => ({
      month: point.monthLabel.split(' ')[0] ?? point.monthLabel,
      collected: point.collected,
      outstanding: point.outstanding,
    })) ?? [];

  const studentsByProgramChart =
    studentReport?.byProgramChart.filter((row) => row.studentCount > 0) ??
    (overview
      ? [
          { program: 'Tahfidh', studentCount: overview.students.tahfidh },
          { program: 'Farbar', studentCount: overview.students.farbar },
          { program: 'Women Section', studentCount: overview.students.women },
        ].filter((row) => row.studentCount > 0)
      : []);

  const quranActivityChart = quranReport?.activityByDate ?? [];

  return (
    <div className="flex flex-col gap-space-lg" id="reports-print-root">
      <div className="hidden print:block">
        <p className="font-headline-md text-headline-md text-brand-primary">Hisham Islamic Center</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Institutional Reports · Generated {new Date().toLocaleString('en-KE')}</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{filterSummary}</p>
      </div>

      <PageHeader
        breadcrumbs={['Admin', 'Reports']}
        title="Institutional Reports"
        subtitle="Attendance, fee collection, and student performance summaries"
        actions={
          <>
            <Button variant="subtle" className="reports-no-print" leftIcon={<MaterialIcon name="print" className="text-[18px]" />} onClick={handlePrint}>
              Print
            </Button>
            <Button variant="subtle" className="reports-no-print" leftIcon={<MaterialIcon name="download" className="text-[18px]" />} onClick={() => void handleExport()}>
              Export CSV
            </Button>
          </>
        }
      />

      <SectionCard title="Report filters" className="reports-no-print">
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-4">
          <label className="flex flex-col gap-1 font-body-sm text-body-sm">
            <span className="text-on-surface-variant">Month</span>
            <input type="month" value={monthValue} onChange={(event) => setMonthValue(event.target.value)} className="rounded-lg border border-outline-variant/50 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 font-body-sm text-body-sm">
            <span className="text-on-surface-variant">Date from</span>
            <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="rounded-lg border border-outline-variant/50 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 font-body-sm text-body-sm">
            <span className="text-on-surface-variant">Date to</span>
            <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="rounded-lg border border-outline-variant/50 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 font-body-sm text-body-sm">
            <span className="text-on-surface-variant">Program</span>
            <Select value={program} onChange={(event) => setProgram(event.target.value as ReportProgram | '')}>
              <option value="">All programs</option>
              <option value="tahfidh">Tahfidh</option>
              <option value="farbar">Farbar</option>
              <option value="women">Women Section</option>
            </Select>
          </label>
        </div>
        <div className="mt-space-md flex flex-col gap-space-md md:flex-row md:items-end">
          <SearchInput
            containerClassName="md:max-w-sm"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search student name or ID…"
          />
          {tab === 'fees' ? (
            <label className="flex flex-col gap-1 font-body-sm text-body-sm">
              <span className="text-on-surface-variant">Payment status</span>
              <Select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value as typeof paymentStatus)}>
                <option value="">All statuses</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </Select>
            </label>
          ) : null}
          {tab === 'quran' ? (
            <label className="flex flex-col gap-1 font-body-sm text-body-sm">
              <span className="text-on-surface-variant">Lesson type</span>
              <Select value={lessonType} onChange={(event) => setLessonType(event.target.value as typeof lessonType)}>
                <option value="">Sabaq & Muraja&apos;ah</option>
                <option value="sabaq">Sabaq</option>
                <option value="murajaah">Muraja&apos;ah</option>
              </Select>
            </label>
          ) : null}
          <Button variant="subtle" onClick={resetFilters}>
            Reset filters
          </Button>
        </div>
        <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant">{filterSummary}</p>
      </SectionCard>

      <div className="reports-no-print flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-full px-4 py-2 font-label-md text-label-md ${tab === item.id ? 'bg-brand-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error ? <EmptyState title="Report unavailable" description={error} icon="cloud_off" /> : null}
      {loading ? <LoadingState label="Loading report data from MongoDB…" /> : null}

      {!loading && !error && tab === 'overview' && overview ? (
        <>
          <div className="grid grid-cols-2 gap-space-md lg:grid-cols-4">
            <StatCard label="Active students" value={String(overview.students.active)} />
            <StatCard label="Attendance rate" value={`${overview.attendance.rate}%`} />
            <StatCard label="Fees collected" value={formatKes(overview.fees.collected)} />
            <StatCard label="Sabaq sessions" value={String(overview.quran.sabaq)} />
          </div>
          <div className="grid grid-cols-1 gap-space-lg xl:grid-cols-2">
            <SectionCard eyebrow="Attendance Reports" title="Monthly Attendance Percentage">
              {attendanceChartData.length === 0 ? (
                <EmptyState title="No attendance records" description="No records found for the selected filters." icon="event_busy" />
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d5e3fc" />
                      <XAxis dataKey="monthLabel" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="rate" stroke="#0D2F30" strokeWidth={2} name="Attendance %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </SectionCard>
            <SectionCard eyebrow="Fee Reports" title="Collections vs Outstanding (KES)">
              {feeChartData.length === 0 ? (
                <EmptyState title="No fee data" description="No records found for the selected period." icon="payments" />
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={feeChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d5e3fc" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatKes(Number(value ?? 0))} />
                      <Legend />
                      <Bar dataKey="collected" fill="#0D2F30" name="Collected" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="outstanding" fill="#A5815E" name="Outstanding" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </SectionCard>
          </div>
        </>
      ) : null}

      {!loading && !error && tab === 'students' && studentReport ? (
        <>
          <div className="grid grid-cols-2 gap-space-md lg:grid-cols-5">
            <StatCard label="Active" value={String(studentReport.summary.active)} />
            <StatCard label="Inactive" value={String(studentReport.summary.inactive)} />
            <StatCard label="Tahfidh" value={String(studentReport.summary.tahfidh)} />
            <StatCard label="Farbar" value={String(studentReport.summary.farbar)} />
            <StatCard label="Women" value={String(studentReport.summary.women)} />
          </div>
          <SectionCard eyebrow="Student Reports" title="Students by program">
            {studentsByProgramChart.length === 0 ? (
              <EmptyState title="No students" description="No records found for the selected filters." icon="groups" />
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studentsByProgramChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d5e3fc" />
                    <XAxis dataKey="program" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="studentCount" fill="#0D2F30" name="Students" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </SectionCard>
          <SectionCard title="Student roster">
            {studentReport.items.length === 0 ? (
              <EmptyState title="No students found" description="No records found for the selected filters." icon="search_off" />
            ) : (
              <DataTable
                data={studentReport.items}
                minWidthClassName="min-w-[960px]"
                columns={[
                  { key: 'id', header: 'Student ID', cell: (row) => row.displayId },
                  { key: 'name', header: 'Full Name', cell: (row) => row.fullName },
                  { key: 'gender', header: 'Gender', cell: (row) => (row.gender === 'male' ? 'Male' : 'Female') },
                  { key: 'dob', header: 'Date of Birth', cell: (row) => formatDate(row.dateOfBirth) },
                  { key: 'phone', header: 'Parent Phone', cell: (row) => row.parentPhone },
                  { key: 'program', header: 'Program', cell: (row) => row.program },
                  { key: 'fee', header: 'Monthly Fee', cell: (row) => formatKes(row.monthlyFee) },
                  { key: 'status', header: 'Status', cell: (row) => row.status },
                ]}
              />
            )}
          </SectionCard>
        </>
      ) : null}

      {!loading && !error && tab === 'attendance' && attendanceReport ? (
        <>
          <div className="grid grid-cols-2 gap-space-md lg:grid-cols-4">
            <StatCard label="Total records" value={String(attendanceReport.summary.totalRecords)} />
            <StatCard label="Present" value={String(attendanceReport.summary.present)} />
            <StatCard label="Absent" value={String(attendanceReport.summary.absent)} />
            <StatCard label="Attendance rate" value={`${attendanceReport.summary.attendanceRate}%`} />
          </div>
          <SectionCard eyebrow="Attendance Reports" title="Monthly Attendance Percentage">
            {attendanceReport.trend.length === 0 ? (
              <EmptyState title="No attendance records" description="No records found for the selected filters." icon="event_busy" />
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceReport.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d5e3fc" />
                    <XAxis dataKey="monthLabel" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rate" stroke="#0D2F30" strokeWidth={2} name="Attendance %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </SectionCard>
          <SectionCard title="Attendance register">
            {attendanceReport.items.length === 0 ? (
              <EmptyState title="No attendance rows" description="No records found for the selected filters." icon="search_off" />
            ) : (
              <DataTable
                data={attendanceReport.items}
                columns={[
                  { key: 'date', header: 'Date', cell: (row) => formatDate(row.date) },
                  { key: 'student', header: 'Student', cell: (row) => row.studentName },
                  { key: 'program', header: 'Program', cell: (row) => row.program },
                  { key: 'status', header: 'Status', cell: (row) => row.status },
                ]}
              />
            )}
          </SectionCard>
        </>
      ) : null}

      {!loading && !error && tab === 'fees' && feeReport ? (
        <>
          <div className="grid grid-cols-2 gap-space-md lg:grid-cols-3 xl:grid-cols-6">
            <StatCard label="Expected" value={formatKes(feeReport.summary.expected)} />
            <StatCard label="Collected" value={formatKes(feeReport.summary.collected)} />
            <StatCard label="Outstanding" value={formatKes(feeReport.summary.outstanding)} />
            <StatCard label="Collection rate" value={`${feeReport.summary.collectionRate}%`} />
            <StatCard label="Paid students" value={String(feeReport.summary.studentsPaid)} />
            <StatCard label="Unpaid students" value={String(feeReport.summary.studentsUnpaid)} />
          </div>
          <SectionCard eyebrow="Fee Reports" title="Collections vs Outstanding (KES)">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d5e3fc" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatKes(Number(value ?? 0))} />
                  <Legend />
                  <Bar dataKey="collected" fill="#0D2F30" name="Collected" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outstanding" fill="#A5815E" name="Outstanding" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
          <SectionCard title="Payment ledger">
            {feeReport.payments.length === 0 ? (
              <EmptyState title="No payments" description="No records found for the selected filters." icon="payments" />
            ) : (
              <DataTable
                data={feeReport.payments}
                minWidthClassName="min-w-[980px]"
                columns={[
                  { key: 'student', header: 'Student', cell: (row) => row.studentName },
                  { key: 'program', header: 'Program', cell: (row) => row.program },
                  { key: 'month', header: 'Month', cell: (row) => `${row.month}/${row.year}` },
                  { key: 'amount', header: 'Amount', cell: (row) => formatKes(row.amount) },
                  { key: 'method', header: 'Payment method', cell: (row) => row.paymentMethod },
                  { key: 'ref', header: 'M-Pesa reference', cell: (row) => row.mpesaReference },
                  { key: 'date', header: 'Payment date', cell: (row) => formatDate(row.paymentDate) },
                  { key: 'status', header: 'Status', cell: (row) => row.status },
                ]}
              />
            )}
          </SectionCard>
        </>
      ) : null}

      {!loading && !error && tab === 'quran' && quranReport ? (
        <>
          <div className="grid grid-cols-2 gap-space-md lg:grid-cols-4">
            <StatCard label="Sabaq sessions" value={String(quranReport.summary.sabaqCount)} />
            <StatCard label="Muraja'ah sessions" value={String(quranReport.summary.murajaahCount)} />
            <StatCard label="Students with records" value={String(quranReport.summary.studentsWithLessons)} />
            <StatCard label="Total lessons" value={String(quranReport.summary.totalLessons)} />
          </div>
          <SectionCard title="Learning activity by date">
            {quranActivityChart.length === 0 ? (
              <EmptyState title="No Qur'an activity" description="No records found for the selected filters." icon="menu_book" />
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quranActivityChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d5e3fc" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#A5815E" name="Lessons" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </SectionCard>
          <SectionCard title="Qur'an learning records">
            {quranReport.items.length === 0 ? (
              <EmptyState title="No learning records" description="No records found for the selected filters." icon="search_off" />
            ) : (
              <DataTable
                data={quranReport.items}
                minWidthClassName="min-w-[1100px]"
                columns={[
                  { key: 'date', header: 'Date', cell: (row) => formatDate(row.date) },
                  { key: 'student', header: 'Student', cell: (row) => row.studentName },
                  { key: 'type', header: 'Type', cell: (row) => row.type.toUpperCase() },
                  { key: 'surah', header: 'Surah', cell: (row) => row.surahName },
                  { key: 'ayah', header: 'Ayah range', cell: (row) => `${row.fromAyah}–${row.toAyah}` },
                  { key: 'juz', header: 'Juz', cell: (row) => row.juz ?? '—' },
                  { key: 'pages', header: 'Pages', cell: (row) => (row.pageFrom && row.pageTo ? `${row.pageFrom}–${row.pageTo}` : '—') },
                  { key: 'assessment', header: 'Assessment', cell: (row) => row.teacherAssessment },
                  { key: 'notes', header: 'Teacher notes', cell: (row) => row.teacherNotes ?? '—' },
                ]}
              />
            )}
          </SectionCard>
        </>
      ) : null}
    </div>
  );
}
