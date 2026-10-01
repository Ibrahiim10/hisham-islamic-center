import { useEffect, useMemo, useState } from 'react';
import { RecordPaymentModal } from '../components/fees/RecordPaymentModal';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { SectionCard } from '../components/ui/SectionCard';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Select } from '../components/ui/FormControls';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useFeeRefresh } from '../context/FeeRefreshContext';
import type { FeeAccountRow, FeeClassConfig, FeePaymentRecord, FeeSummary } from '../types/fees';
import { formatKes } from '../utils/format';
import {
  fetchFeeAccounts,
  fetchFeeClassConfig,
  fetchFeePayments,
  fetchFeeSummary,
  getFeeApiErrorMessage,
} from '../services/fees.service';

function getDefaultMonthValue(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function parseMonthValue(value: string): { month: number; year: number } {
  const [yearPart, monthPart] = value.split('-');
  return { year: Number(yearPart), month: Number(monthPart) };
}

function feeStatusTone(status: FeeAccountRow['status']): 'paid' | 'partial' | 'unpaid' {
  if (status === 'paid') return 'paid';
  if (status === 'partial') return 'partial';
  return 'unpaid';
}

export function FeesPage() {
  const { refreshToken } = useFeeRefresh();
  const [monthValue, setMonthValue] = useState(getDefaultMonthValue);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'paid' | 'partial' | 'unpaid' | ''>('');

  const [summary, setSummary] = useState<FeeSummary | null>(null);
  const [accounts, setAccounts] = useState<FeeAccountRow[]>([]);
  const [payments, setPayments] = useState<FeePaymentRecord[]>([]);
  const [classConfig, setClassConfig] = useState<FeeClassConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recordOpen, setRecordOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { month, year } = useMemo(() => parseMonthValue(monthValue), [monthValue]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const config = await fetchFeeClassConfig();
        if (!cancelled) setClassConfig(config);
      } catch {
        // Non-blocking
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryData, accountRows, paymentData] = await Promise.all([
          fetchFeeSummary({ month, year }),
          fetchFeeAccounts({
            month,
            year,
            search: debouncedSearch || undefined,
            classId: classFilter || undefined,
            status: statusFilter || undefined,
          }),
          fetchFeePayments({ month, year, search: debouncedSearch || undefined, classId: classFilter || undefined, limit: 25 }),
        ]);
        if (!cancelled) {
          setSummary(summaryData);
          setAccounts(accountRows);
          setPayments(paymentData.items);
        }
      } catch (loadError) {
        if (!cancelled) {
          setSummary(null);
          setAccounts([]);
          setPayments([]);
          setError(getFeeApiErrorMessage(loadError, 'Unable to load fee data. Please try again.'));
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
  }, [month, year, debouncedSearch, classFilter, statusFilter, refreshToken]);

  if (loading && !summary) {
    return (
      <div className="py-space-xl">
        <LoadingState label="Loading fee collections…" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="space-y-space-md">
        <PageHeader title="Fees & Collections Management" subtitle="Fee ledger and student billing" />
        <EmptyState title="Fees unavailable" description={error ?? 'Unable to load fee data.'} icon="cloud_off" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-lg">
      <PageHeader
        title="Fees & Collections Management"
        subtitle={`${summary.monthLabel} · Term billing cycle`}
        actions={
          <>
            <label className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 font-body-sm text-body-sm">
              <span className="text-on-surface-variant">Period</span>
              <input type="month" className="bg-transparent font-medium text-on-surface focus:outline-none" value={monthValue} onChange={(event) => setMonthValue(event.target.value)} />
            </label>
            <Button variant="subtle" leftIcon={<MaterialIcon name="file_download" className="text-[18px] text-brand-secondary" />}>
              Export CSV
            </Button>
            <Button leftIcon={<MaterialIcon name="add_circle" className="text-[19px]" />} onClick={() => setRecordOpen(true)}>
              Record Fee Payment
            </Button>
          </>
        }
      />

      {successMessage ? (
        <div className="rounded-lg border border-primary-container/20 bg-surface-container-low px-space-md py-space-sm font-body-sm text-body-sm text-on-surface">
          {successMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Collected"
          accent="primary"
          value={<span className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">{formatKes(summary.totalCollected)}</span>}
          footer={<span className="font-body-sm text-body-sm text-on-surface-variant">{summary.collectionPercentage}% of expected revenue</span>}
        />
        <StatCard
          label="Total Outstanding"
          accent="gold"
          value={<span className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">{formatKes(summary.totalOutstanding)}</span>}
          footer={<span className="font-body-sm text-body-sm text-on-surface-variant">{summary.unpaidAccounts} accounts with balance due</span>}
        />
        <StatCard
          label="Fully Paid Students"
          accent="secondary"
          value={
            <span className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
              {summary.studentsPaid} / {summary.studentsPaid + summary.studentsPartial + summary.studentsUnpaid}
            </span>
          }
          footer={<span className="font-body-sm text-body-sm text-on-surface-variant">{summary.studentsPartial} partial · {summary.studentsUnpaid} unpaid</span>}
        />
        <StatCard
          label="Expected This Month"
          accent="error"
          value={<span className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">{formatKes(summary.totalExpected)}</span>}
          footer={<span className="font-body-sm text-body-sm text-on-surface-variant">Based on active student programs</span>}
        />
      </div>

      <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-card lg:p-space-lg">
        <div className="flex flex-col gap-space-md lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-space-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tertiary-container text-tertiary-fixed">
              <MaterialIcon name="price_change" className="text-[24px]" />
            </div>
            <div>
              <h2 className="font-title-lg text-title-lg text-on-surface">Managed Fee Structures</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Configured monthly tiers from MongoDB fee structures</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-space-sm font-body-sm text-body-sm">
            {classConfig.map((tier) => (
              <span key={tier.classId} className="rounded-full bg-surface-container px-3 py-1">
                {tier.className} — {formatKes(tier.monthlyFee)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-space-sm md:grid-cols-12">
        <SearchInput containerClassName="md:col-span-5" placeholder="Search student name or ID…" value={search} onChange={(event) => setSearch(event.target.value)} />
        <Select className="md:col-span-3 h-10 shadow-sm" value={classFilter} onChange={(event) => setClassFilter(event.target.value)}>
          <option value="">All Categories</option>
          {classConfig.map((tier) => (
            <option key={tier.classId} value={tier.classId}>
              {tier.className}
            </option>
          ))}
        </Select>
        <Select className="md:col-span-4 h-10 shadow-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>
          <option value="">All Payment Statuses</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="unpaid">Unpaid</option>
        </Select>
      </div>

      <SectionCard eyebrow="Student Fee Accounts" title={`Billing Status · ${summary.monthLabel}`}>
        {accounts.length === 0 ? (
          <EmptyState title="No matching student accounts" description="Adjust filters or add students to the register." icon="search_off" />
        ) : (
          <DataTable<FeeAccountRow>
            data={accounts}
            columns={[
              {
                key: 'student',
                header: 'Student',
                cell: (row) => (
                  <div className="flex items-center gap-space-sm">
                    <Avatar name={row.fullName} className="h-8 w-8 text-xs" />
                    <div>
                      <p className="font-title-sm text-title-sm">{row.fullName}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{row.displayId}</p>
                    </div>
                  </div>
                ),
              },
              { key: 'class', header: 'Category', cell: (row) => row.className },
              { key: 'monthlyFee', header: 'Monthly Fee', className: 'text-right tabular-nums', cell: (row) => formatKes(row.monthlyFee) },
              { key: 'paid', header: 'Amount Paid', className: 'text-right tabular-nums', cell: (row) => formatKes(row.amountPaid) },
              { key: 'balance', header: 'Balance', className: 'text-right tabular-nums', cell: (row) => formatKes(row.balance) },
              { key: 'status', header: 'Status', cell: (row) => <StatusBadge tone={feeStatusTone(row.status)} label={row.status.toUpperCase()} /> },
            ]}
          />
        )}
      </SectionCard>

      <SectionCard eyebrow="Payment Ledger" title="Recent M-Pesa Records">
        {payments.length === 0 ? (
          <EmptyState title="No payments for this period" description="Record an M-Pesa payment to populate the ledger." icon="payments" />
        ) : (
          <DataTable<FeePaymentRecord>
            data={payments}
            columns={[
              {
                key: 'student',
                header: 'Student',
                cell: (row) => (
                  <div>
                    <p className="font-title-sm text-title-sm">{row.studentName}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{row.displayId}</p>
                  </div>
                ),
              },
              { key: 'class', header: 'Category', cell: (row) => row.className },
              { key: 'month', header: 'Month', cell: (row) => row.monthLabel },
              { key: 'amount', header: 'Amount', className: 'text-right tabular-nums', cell: (row) => formatKes(row.amount) },
              {
                key: 'method',
                header: 'Payment Method',
                cell: (row) => (
                  <div>
                    <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-label-sm text-[10px] font-bold text-primary-container">{row.paymentMethod}</span>
                    <p className="font-mono font-label-sm text-label-sm text-on-surface-variant">{row.mpesaReference}</p>
                  </div>
                ),
              },
              {
                key: 'date',
                header: 'Payment Date',
                cell: (row) => new Date(row.paymentDate).toLocaleDateString('en-KE'),
              },
            ]}
          />
        )}
      </SectionCard>

      <RecordPaymentModal
        open={recordOpen}
        onClose={() => setRecordOpen(false)}
        defaultMonth={month}
        defaultYear={year}
        onSuccess={() => setSuccessMessage('Payment recorded successfully. Fee totals have been refreshed.')}
      />
    </div>
  );
}
