import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { FormField, Input, Select } from '../ui/FormControls';
import { Modal } from '../ui/Modal';
import { fetchStudents } from '../../services/students.service';
import { fetchFeeAccounts, getFeeApiErrorMessage, recordFeePayment } from '../../services/fees.service';
import { useFeeRefresh } from '../../context/FeeRefreshContext';
import { formatKes } from '../../utils/format';

type RecordPaymentModalProps = {
  open: boolean;
  onClose: () => void;
  defaultMonth?: number;
  defaultYear?: number;
  defaultStudentId?: string;
  onSuccess?: () => void;
};

function getDefaultMonthYear(): { month: number; year: number; monthValue: string } {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  return {
    month,
    year,
    monthValue: `${year}-${String(month).padStart(2, '0')}`,
  };
}

export function RecordPaymentModal({
  open,
  onClose,
  defaultMonth,
  defaultYear,
  defaultStudentId,
  onSuccess,
}: RecordPaymentModalProps) {
  const { notifyFeeDataChanged } = useFeeRefresh();
  const initial = getDefaultMonthYear();
  const [monthValue, setMonthValue] = useState(initial.monthValue);
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [mpesaReference, setMpesaReference] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [studentOptions, setStudentOptions] = useState<Array<{ id: string; label: string; monthlyFee: number }>>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { month, year } = useMemo(() => {
    const [yearPart, monthPart] = monthValue.split('-');
    return { month: Number(monthPart), year: Number(yearPart) };
  }, [monthValue]);

  const selectedStudentFee = useMemo(
    () => studentOptions.find((option) => option.id === studentId)?.monthlyFee ?? null,
    [studentId, studentOptions],
  );

  useEffect(() => {
    if (!open) return;
    const monthPart = defaultMonth ?? initial.month;
    const yearPart = defaultYear ?? initial.year;
    setMonthValue(`${yearPart}-${String(monthPart).padStart(2, '0')}`);
    setStudentId(defaultStudentId ?? '');
    setAmount('');
    setMpesaReference('');
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setErrorMessage(null);
  }, [open, defaultMonth, defaultYear, defaultStudentId, initial.month, initial.year]);

  useEffect(() => {
    if (!open || !month || !year) return;
    let cancelled = false;

    (async () => {
      setLoadingStudents(true);
      try {
        const [studentsList, accounts] = await Promise.all([
          fetchStudents({ page: 1, limit: 100, status: 'active' }),
          fetchFeeAccounts({ month, year }),
        ]);
        if (cancelled) return;
        const feeByStudent = new Map(accounts.map((row) => [row.studentId, row.monthlyFee]));
        setStudentOptions(
          studentsList.items.map((student) => ({
            id: student.id,
            label: `${student.fullName} (${student.displayId})`,
            monthlyFee: feeByStudent.get(student.id) ?? student.monthlyFee,
          })),
        );
      } catch {
        if (!cancelled) {
          setStudentOptions([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingStudents(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, month, year]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;

    if (!studentId) {
      setErrorMessage('Select a student.');
      return;
    }
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setErrorMessage('Enter a valid payment amount.');
      return;
    }
    if (!mpesaReference.trim()) {
      setErrorMessage('M-Pesa reference is required.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    try {
      await recordFeePayment({
        studentId,
        month,
        year,
        amount: parsedAmount,
        mpesaReference: mpesaReference.trim(),
        paymentDate: new Date(`${paymentDate}T12:00:00`).toISOString(),
      });
      notifyFeeDataChanged();
      onSuccess?.();
      onClose();
    } catch (error) {
      setErrorMessage(getFeeApiErrorMessage(error, 'Unable to record payment.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record M-Pesa Fee Payment"
      description="Payment details are validated on the server. Expected fee is based on the student's current program."
      className="max-w-lg"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="record-payment-form" disabled={submitting || loadingStudents}>
            {submitting ? 'Saving…' : 'Save Payment'}
          </Button>
        </>
      }
    >
      <form id="record-payment-form" className="space-y-space-md" onSubmit={(event) => void handleSubmit(event)}>
        {errorMessage ? (
          <div className="rounded-lg border border-error/30 bg-error-container/40 px-3 py-2 font-body-sm text-body-sm text-error" role="alert">
            {errorMessage}
          </div>
        ) : null}
        <FormField label="Fee period">
          <Input type="month" value={monthValue} onChange={(event) => setMonthValue(event.target.value)} />
        </FormField>
        <FormField label="Student">
          <Select value={studentId} onChange={(event) => setStudentId(event.target.value)} disabled={loadingStudents}>
            <option value="">{loadingStudents ? 'Loading students…' : 'Select student'}</option>
            {studentOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
          {selectedStudentFee !== null ? (
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Expected monthly fee: {formatKes(selectedStudentFee)}
            </span>
          ) : null}
        </FormField>
        <FormField label="Amount (KES)">
          <Input type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="8000" />
        </FormField>
        <FormField label="M-Pesa transaction / reference">
          <Input value={mpesaReference} onChange={(event) => setMpesaReference(event.target.value)} placeholder="QHX1234567" />
        </FormField>
        <FormField label="Payment date">
          <Input type="date" value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} />
        </FormField>
      </form>
    </Modal>
  );
}
