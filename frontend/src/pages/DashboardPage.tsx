import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { SectionCard } from '../components/ui/SectionCard';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { adminPath } from '../constants/adminPaths';
import { BRAND } from '../constants/brand';
import { islamicMotivation } from '../data/mock';
import { fetchDashboardOverview, getDashboardErrorMessage } from '../services/dashboard.service';
import type { DashboardOverview } from '../types/dashboard';
import { formatKes } from '../utils/format';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';
import { useFeeRefresh } from '../context/FeeRefreshContext';
import { RecordPaymentModal } from '../components/fees/RecordPaymentModal';

const FEE_CLASS_LABELS: Record<string, string> = {
  Tahfidh: 'Tahfidh (Full-time Memorization)',
  Farbar: 'Farbar (Evening / Weekend Tajweed)',
  'Women Section': "Women's Halaqah Section",
};

function getDefaultFeeMonthValue(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function parseFeeMonthValue(value: string): { month: number; year: number } {
  const [yearPart, monthPart] = value.split('-');
  return {
    year: Number(yearPart),
    month: Number(monthPart),
  };
}

export function DashboardPage() {
  const { currentUser } = useAuth();
  const { refreshToken: feeRefreshToken } = useFeeRefresh();
  const location = useLocation();
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [analyticsTab, setAnalyticsTab] = useState<'fees' | 'attendance'>('fees');
  const [feeMonthValue, setFeeMonthValue] = useState(getDefaultFeeMonthValue);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const adminName = currentUser?.fullName?.split(' ')[0] ?? BRAND.adminName;

  useEffect(() => {
    let cancelled = false;
    const { month, year } = parseFeeMonthValue(feeMonthValue);

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDashboardOverview({ month, year });
        if (!cancelled) {
          setOverview(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setOverview(null);
          setError(getDashboardErrorMessage(loadError, 'Unable to load dashboard data. Please try again.'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [feeMonthValue, reloadToken, location.key, feeRefreshToken]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setReloadToken((value) => value + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const weeklyAverage = useMemo(() => {
    if (!overview) return 0;
    const completed = overview.weeklyAttendance.filter((day) => !day.isFuture);
    if (completed.length === 0) return 0;
    const total = completed.reduce((sum, day) => sum + day.presentRate, 0);
    return Math.round((total / completed.length) * 10) / 10;
  }, [overview]);

  if (loading && !overview) {
    return (
      <div className="py-space-xl">
        <LoadingState label="Loading dashboard data…" />
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="space-y-space-md">
        <EmptyState title="Dashboard unavailable" description={error ?? 'Unable to load dashboard data.'} icon="cloud_off" />
        <Button variant="subtle" onClick={() => setReloadToken((value) => value + 1)}>
          Retry
        </Button>
      </div>
    );
  }

  const { students, attendance, fees, feeMonthlyTrend, weeklyAttendance, recentPayments } = overview;
  const feePeriod = parseFeeMonthValue(feeMonthValue);

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex flex-col justify-between gap-space-md pb-space-xs lg:flex-row lg:items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-secondary" />
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-brand-secondary">
              Madrasa Operations Overview
            </span>
          </div>
          <h1 className="mt-1 font-headline-lg text-headline-lg tracking-tight text-on-surface">
            Assalamu Alaykum, {adminName}
          </h1>
          <p className="mt-0.5 font-body-md text-body-md text-on-surface-variant">
            Here is what is happening at {BRAND.name} today{' '}
            <span className="font-medium text-on-surface">
              ({new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })})
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-space-sm">
          <label className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 font-body-sm text-body-sm text-on-surface-variant">
            <span>Fee period</span>
            <input
              type="month"
              className="bg-transparent font-medium text-on-surface focus:outline-none"
              value={feeMonthValue}
              onChange={(event) => setFeeMonthValue(event.target.value)}
            />
          </label>
          <Button variant="subtle" leftIcon={<MaterialIcon name="how_to_reg" className="text-[19px] text-brand-secondary" />}>
            Take Daily Attendance
          </Button>
          <Button
            variant="subtle"
            className="bg-surface-container-high text-primary-container hover:bg-surface-container-highest"
            leftIcon={<MaterialIcon name="point_of_sale" className="text-[19px] text-primary-container" />}
            onClick={() => setRecordPaymentOpen(true)}
          >
            Record M-Pesa Fee
          </Button>
          <Link to={adminPath('students')}>
            <Button leftIcon={<MaterialIcon name="person_add" className="text-[20px]" />}>+ Quick Admission</Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant">Refreshing dashboard…</p>
      ) : null}

      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Students"
          accent="primary"
          icon={
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-inner">
              <MaterialIcon name="group" className="text-[19px]" />
            </div>
          }
          value={
            <div className="flex items-baseline gap-space-sm">
              <span className="font-headline-xl text-headline-xl tracking-tight text-on-surface">{students.total}</span>
              <span className="inline-flex items-center rounded-full bg-surface-container px-2 py-0.5 font-label-sm text-label-sm font-semibold text-primary-container">
                Active enrollees
              </span>
            </div>
          }
          footer={
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>
                <strong className="font-semibold text-on-surface">Tahfidh:</strong> {students.tahfidh}
              </span>
              <span>•</span>
              <span>
                <strong className="font-semibold text-on-surface">Farbar:</strong> {students.farbar}
              </span>
              <span>•</span>
              <span>
                <strong className="font-semibold text-on-surface">Women:</strong> {students.women}
              </span>
            </div>
          }
        />
        <StatCard
          label="Present Today"
          accent="secondary"
          icon={
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-high text-primary-container">
              <MaterialIcon name="how_to_reg" filled className="text-[20px]" />
            </div>
          }
          value={
            <div className="flex items-baseline gap-space-sm">
              <span className="font-headline-xl text-headline-xl tracking-tight text-on-surface">{attendance.present}</span>
              <span className="inline-flex items-center rounded-full bg-surface-container-low px-2 py-0.5 font-label-sm text-label-sm font-semibold text-primary-container">
                {attendance.presentRate}% rate
              </span>
            </div>
          }
          footer={
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>{attendance.absent} absent registered</span>
              <span className="font-medium text-primary-container">
                {attendance.markedCount} of {students.total} marked
              </span>
            </div>
          }
        />
        <StatCard
          label="Absent Today"
          accent="error"
          icon={
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-error-container text-on-error-container">
              <MaterialIcon name="person_off" className="text-[20px]" />
            </div>
          }
          value={
            <div className="flex items-baseline gap-space-sm">
              <span className="font-headline-xl text-headline-xl tracking-tight text-on-surface">{attendance.absent}</span>
              <span className="inline-flex items-center rounded-full bg-error-container px-2 py-0.5 font-label-sm text-label-sm font-semibold text-on-error-container">
                {attendance.absenceRate}% absence
              </span>
            </div>
          }
          footer={
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>{attendance.unmarkedCount} students not marked today</span>
              <span className="font-medium text-on-surface-variant">Date: {attendance.date}</span>
            </div>
          }
        />
        <StatCard
          label={`Fees Outstanding · ${fees.monthLabel}`}
          accent="gold"
          icon={
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-inner">
              <MaterialIcon name="account_balance_wallet" className="text-[20px]" />
            </div>
          }
          value={
            <div className="flex items-baseline gap-space-xs">
              <span className="font-title-sm text-title-sm font-semibold text-brand-secondary">KES</span>
              <span className="font-headline-xl text-headline-xl tracking-tight text-on-surface">
                {fees.outstanding.toLocaleString('en-KE')}
              </span>
            </div>
          }
          footer={
            <>
              <div className="mb-1.5 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span>Collected: {formatKes(fees.collected)}</span>
                <span className="font-semibold text-brand-secondary">{fees.collectionRate}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                <div className="h-full rounded-full bg-secondary" style={{ width: `${Math.min(fees.collectionRate, 100)}%` }} />
              </div>
            </>
          }
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
        <div className="flex flex-col gap-space-lg lg:col-span-8">
          <SectionCard
            eyebrow="Institutional Performance"
            title="Attendance & Fee Revenue Trends"
            action={
              <div className="inline-flex rounded-lg bg-surface-container-low p-1">
                <button
                  type="button"
                  onClick={() => setAnalyticsTab('fees')}
                  className={cn(
                    'rounded-md px-3 py-1.5 font-label-md text-label-md transition-all',
                    analyticsTab === 'fees'
                      ? 'bg-primary-container text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface',
                  )}
                >
                  Fee Collections
                </button>
                <button
                  type="button"
                  onClick={() => setAnalyticsTab('attendance')}
                  className={cn(
                    'rounded-md px-3 py-1.5 font-label-md text-label-md transition-all',
                    analyticsTab === 'attendance'
                      ? 'bg-primary-container text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface',
                  )}
                >
                  Weekly Attendance
                </button>
              </div>
            }
          >
            {analyticsTab === 'fees' ? (
              <div className="flex flex-col gap-space-md">
                <div className="grid grid-cols-1 gap-space-sm pt-space-xs sm:grid-cols-2 lg:grid-cols-4 font-body-sm text-body-sm">
                  <div className="rounded-lg bg-surface-container-low px-3 py-2">
                    <p className="text-on-surface-variant">Expected</p>
                    <p className="font-semibold text-on-surface">{formatKes(fees.expected)}</p>
                  </div>
                  <div className="rounded-lg bg-surface-container-low px-3 py-2">
                    <p className="text-on-surface-variant">Collected</p>
                    <p className="font-semibold text-on-surface">{formatKes(fees.collected)}</p>
                  </div>
                  <div className="rounded-lg bg-surface-container-low px-3 py-2">
                    <p className="text-on-surface-variant">Outstanding</p>
                    <p className="font-semibold text-on-surface">{formatKes(fees.outstanding)}</p>
                  </div>
                  <div className="rounded-lg bg-surface-container-low px-3 py-2">
                    <p className="text-on-surface-variant">Collection</p>
                    <p className="font-semibold text-brand-secondary">{fees.collectionRate}%</p>
                  </div>
                </div>
                <div className="rounded-xl bg-surface-container-low p-space-md">
                  <p className="mb-space-sm font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                    Monthly collection trend (last 6 months)
                  </p>
                  <div className="flex h-40 items-end justify-between gap-2">
                    {feeMonthlyTrend.map((point) => {
                      const maxValue = Math.max(point.expected, 1);
                      const collectedHeight = Math.max(8, (point.collected / maxValue) * 100);
                      return (
                        <div key={point.monthKey} className="flex flex-1 flex-col items-center justify-end gap-1">
                          <span className="font-label-sm text-[10px] text-on-surface-variant">{formatKes(point.collected)}</span>
                          <div className="relative flex h-28 w-full max-w-[56px] items-end overflow-hidden rounded-md bg-surface-container-highest">
                            <div className="w-full rounded-t-md bg-primary-container" style={{ height: `${collectedHeight}%` }} />
                          </div>
                          <span className="text-center font-label-sm text-[10px] leading-tight text-on-surface-variant">
                            {point.monthLabel.split(' ')[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex items-center gap-space-md">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded bg-primary-container" /> Collected by class
                    </span>
                  </div>
                  <span className="rounded-md bg-surface-container px-2.5 py-1 font-label-sm text-label-sm font-semibold text-on-surface">
                    Paid: {fees.studentsPaid} · Partial: {fees.studentsPartial} · Unpaid: {fees.studentsUnpaid}
                  </span>
                </div>
                <div className="flex flex-col gap-space-md rounded-xl bg-surface-container-low p-space-md">
                  {fees.byClass.length === 0 ? (
                    <p className="font-body-sm text-body-sm text-on-surface-variant">No active students for fee breakdown.</p>
                  ) : (
                    fees.byClass.map((tier) => {
                      const label = FEE_CLASS_LABELS[tier.className] ?? tier.className;
                      const pct = tier.collectionRate;
                      const barColor =
                        tier.classKey === 'tahfidh'
                          ? 'bg-primary-container'
                          : tier.classKey === 'farbar'
                            ? 'bg-secondary'
                            : 'bg-surface-tint';
                      return (
                        <div key={tier.className} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between font-title-sm text-title-sm text-on-surface">
                            <span>{label}</span>
                            <span className="font-semibold tabular-nums">
                              {formatKes(tier.collected)} / {formatKes(tier.expected)}
                            </span>
                          </div>
                          <div className="relative flex h-5 items-center overflow-hidden rounded-md bg-surface-container-highest">
                            <div
                              className={cn('flex h-full items-center justify-end rounded-md pr-2 font-label-sm text-[10px]', barColor)}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            >
                              {pct}%
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-space-md">
                <div className="flex items-center justify-between pt-space-xs font-body-sm text-body-sm text-on-surface-variant">
                  <span>Roll-call compliance (Mon – Fri)</span>
                  <span className="font-semibold text-primary-container">Weekly Average: {weeklyAverage}%</span>
                </div>
                <div className="flex h-48 items-end justify-between gap-space-md rounded-xl bg-surface-container-low p-space-md">
                  {weeklyAttendance.map((day) => (
                    <div key={day.day} className={cn('flex h-full flex-1 flex-col items-center justify-end gap-1.5', day.isFuture && 'opacity-40')}>
                      <span className={cn('font-label-sm text-label-sm font-semibold', day.isToday ? 'font-bold text-brand-secondary' : 'text-on-surface')}>
                        {day.isFuture ? '--' : `${day.presentRate}%`}
                      </span>
                      <div
                        className={cn('w-full max-w-[48px] rounded-t-md', day.isToday ? 'bg-secondary' : 'bg-primary-container')}
                        style={{ height: day.isFuture ? '10%' : `${Math.max(day.presentRate, 8)}%` }}
                      />
                      <span className={cn('font-label-sm text-label-sm', day.isToday ? 'font-bold text-brand-secondary' : 'text-on-surface-variant')}>
                        {day.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard eyebrow="Ledger Stream" title="Recent Fee Payments (M-Pesa / Bank)" action={<Link to={adminPath('fees')} className="inline-flex items-center gap-1 font-label-md text-label-md font-semibold text-brand-secondary hover:text-primary-container">View All Ledger <MaterialIcon name="arrow_forward" className="text-[16px]" /></Link>} bodyClassName="overflow-x-auto">
            {recentPayments.length === 0 ? (
              <div className="p-space-md">
                <EmptyState title="No payments recorded yet" description="M-Pesa fee payments will appear here once recorded in the ledger." icon="payments" />
              </div>
            ) : (
              <table className="w-full min-w-[760px] text-left font-body-md text-body-md">
                <thead>
                  <tr className="bg-surface-container-low font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    <th className="px-space-md py-3 font-semibold">Student / ID</th>
                    <th className="px-space-md py-3 font-semibold">Class Tier</th>
                    <th className="px-space-md py-3 text-right font-semibold">Amount</th>
                    <th className="px-space-md py-3 font-semibold">Method & Reference</th>
                    <th className="px-space-md py-3 text-right font-semibold">Period</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-surface-container-low/60">
                      <td className="px-space-md py-3.5">
                        <div className="flex flex-col">
                          <span className="font-title-sm text-title-sm font-semibold">{payment.studentName}</span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">{payment.displayId}</span>
                        </div>
                      </td>
                      <td className="px-space-md py-3.5">{payment.className}</td>
                      <td className="px-space-md py-3.5 text-right font-semibold tabular-nums">{formatKes(payment.amount)}</td>
                      <td className="px-space-md py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-label-sm text-[10px] font-bold text-primary-container">{payment.method}</span>
                          <span className="font-mono font-label-sm text-label-sm text-on-surface-variant">{payment.reference}</span>
                        </div>
                      </td>
                      <td className="px-space-md py-3.5 text-right font-label-sm text-label-sm text-on-surface-variant">
                        {payment.month}/{payment.year}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </SectionCard>

          <SectionCard
            eyebrow="Morning & Afternoon Submissions"
            title="Class-by-Class Roll-Call Status"
            action={
              <span className="rounded-full bg-surface-container px-2.5 py-1 font-label-sm text-label-sm font-semibold text-primary-container">
                {attendance.markedCount} marked today
              </span>
            }
          >
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Detailed class-by-class roll-call tracking will connect when the attendance module is fully wired. Today&apos;s totals:{' '}
              <strong className="text-on-surface">{attendance.present} present</strong>,{' '}
              <strong className="text-on-surface">{attendance.absent} absent</strong>,{' '}
              <strong className="text-on-surface">{attendance.unmarkedCount} unmarked</strong>.
            </p>
          </SectionCard>
        </div>

        <div className="flex flex-col gap-space-lg lg:col-span-4">
          <section className="relative flex flex-col gap-space-md overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-card">
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary-container via-brand-secondary to-primary-container" />
            <div className="rounded-lg bg-surface-container-low/50 p-space-md">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm font-semibold uppercase tracking-wider text-brand-secondary">
                  <MaterialIcon name="auto_stories" className="text-[16px] text-brand-secondary" />
                  {islamicMotivation.ayah.label}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{islamicMotivation.ayah.reference}</span>
              </div>
              <p className="py-2 text-right font-arabic text-[23px] leading-[42px] font-semibold text-primary-container" dir="rtl">
                {islamicMotivation.ayah.arabic}
              </p>
              <p className="font-body-md text-body-md italic text-on-surface">“{islamicMotivation.ayah.translation}”</p>
            </div>
            <div className="rounded-lg border border-outline-variant/40 p-space-md">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-primary-container">
                  {islamicMotivation.hadith.label}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{islamicMotivation.hadith.reference}</span>
              </div>
              <p className="text-right font-arabic text-[20px] leading-8 text-primary-container" dir="rtl">
                {islamicMotivation.hadith.arabic}
              </p>
              <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">{islamicMotivation.hadith.translation}</p>
            </div>
          </section>

          <SectionCard eyebrow="Operational Alerts" title="Priority Follow-ups">
            <ul className="space-y-space-sm font-body-sm text-body-sm">
              <li className="flex items-start gap-space-sm rounded-lg bg-surface-container-low p-space-sm">
                <MaterialIcon name="warning" className="mt-0.5 text-[18px] text-error" />
                <div>
                  <p className="font-semibold text-on-surface">
                    {fees.unpaidAccounts} student{fees.unpaidAccounts === 1 ? '' : 's'} with outstanding fees ({fees.monthLabel})
                  </p>
                  <p className="text-on-surface-variant">Total outstanding: {formatKes(fees.outstanding)} for the selected fee period.</p>
                </div>
              </li>
              {attendance.unmarkedCount > 0 ? (
                <li className="flex items-start gap-space-sm rounded-lg bg-surface-container-low p-space-sm">
                  <MaterialIcon name="event_busy" className="mt-0.5 text-[18px] text-brand-secondary" />
                  <div>
                    <p className="font-semibold text-on-surface">{attendance.unmarkedCount} students not marked today</p>
                    <p className="text-on-surface-variant">Complete daily roll-call to update present and absent totals.</p>
                  </div>
                </li>
              ) : null}
            </ul>
          </SectionCard>
        </div>
      </div>

      <RecordPaymentModal
        open={recordPaymentOpen}
        onClose={() => setRecordPaymentOpen(false)}
        defaultMonth={feePeriod.month}
        defaultYear={feePeriod.year}
      />
    </div>
  );
}
