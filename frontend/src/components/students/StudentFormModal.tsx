import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { FormField, Input, Select, Textarea } from '../ui/FormControls';
import { Modal } from '../ui/Modal';
import type { StudentClassOption, StudentDetail, StudentFormValues } from '../../types/student';
import { formatKes } from '../../utils/format';

type StudentFormModalProps = {
  open: boolean;
  mode: 'create' | 'edit';
  classes: StudentClassOption[];
  initialStudent?: StudentDetail | null;
  submitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (values: StudentFormValues) => Promise<void>;
};

const emptyValues: StudentFormValues = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  parentPhone: '',
  address: '',
  classId: '',
};

function toDateInputValue(iso: string): string {
  return iso.slice(0, 10);
}

export function StudentFormModal({
  open,
  mode,
  classes,
  initialStudent,
  submitting,
  errorMessage,
  onClose,
  onSubmit,
}: StudentFormModalProps) {
  const [values, setValues] = useState<StudentFormValues>(emptyValues);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof StudentFormValues, string>>>({});

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initialStudent) {
      setValues({
        fullName: initialStudent.fullName,
        dateOfBirth: toDateInputValue(initialStudent.dateOfBirth),
        gender: initialStudent.gender,
        parentPhone: initialStudent.parentPhone,
        address: initialStudent.address,
        classId: initialStudent.classId,
      });
    } else {
      setValues(emptyValues);
    }
    setFieldErrors({});
  }, [open, mode, initialStudent]);

  const selectedFee = useMemo(() => {
    const match = classes.find((item) => item.id === values.classId);
    return match ? formatKes(match.monthlyFee) : null;
  }, [classes, values.classId]);

  function validate(): boolean {
    const errors: Partial<Record<keyof StudentFormValues, string>> = {};
    if (!values.fullName.trim()) errors.fullName = 'Full name is required';
    if (!values.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!values.gender) errors.gender = 'Gender is required';
    if (!values.parentPhone.trim()) errors.parentPhone = 'Parent phone is required';
    if (!values.address.trim()) errors.address = 'Address is required';
    if (!values.classId) errors.classId = 'Program/class is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate() || submitting) return;
    await onSubmit(values);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Register New Student' : 'Edit Student'}
      description={
        mode === 'create'
          ? 'Admission form aligned with the Hisham Islamic Center student registration flow.'
          : 'Update student information. Historical fee payments are not changed when class changes.'
      }
      className="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="student-form" disabled={submitting}>
            {submitting ? 'Saving…' : mode === 'create' ? 'Save Student' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <form id="student-form" className="space-y-space-md" onSubmit={(event) => void handleSubmit(event)}>
        {errorMessage ? (
          <div className="rounded-lg border border-error/30 bg-error-container/40 px-3 py-2 font-body-sm text-body-sm text-error" role="alert">
            {errorMessage}
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
          <FormField label="Full Name" className="sm:col-span-2">
            <Input
              value={values.fullName}
              onChange={(event) => setValues((prev) => ({ ...prev, fullName: event.target.value }))}
              placeholder="Student full name"
            />
            {fieldErrors.fullName ? <span className="font-body-sm text-body-sm text-error">{fieldErrors.fullName}</span> : null}
          </FormField>
          <FormField label="Date of Birth">
            <Input
              type="date"
              value={values.dateOfBirth}
              onChange={(event) => setValues((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
            />
            {fieldErrors.dateOfBirth ? (
              <span className="font-body-sm text-body-sm text-error">{fieldErrors.dateOfBirth}</span>
            ) : null}
          </FormField>
          <FormField label="Gender">
            <Select
              value={values.gender}
              onChange={(event) => setValues((prev) => ({ ...prev, gender: event.target.value as StudentFormValues['gender'] }))}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
            {fieldErrors.gender ? <span className="font-body-sm text-body-sm text-error">{fieldErrors.gender}</span> : null}
          </FormField>
          <FormField label="Program / Class">
            <Select
              value={values.classId}
              onChange={(event) => setValues((prev) => ({ ...prev, classId: event.target.value }))}
            >
              <option value="">Select class</option>
              {classes.map((classOption) => (
                <option key={classOption.id} value={classOption.id}>
                  {classOption.name}
                </option>
              ))}
            </Select>
            {selectedFee ? (
              <span className="font-body-sm text-body-sm text-on-surface-variant">Expected monthly fee: {selectedFee}</span>
            ) : null}
            {fieldErrors.classId ? <span className="font-body-sm text-body-sm text-error">{fieldErrors.classId}</span> : null}
          </FormField>
          <FormField label="Parent / Guardian Phone">
            <Input
              value={values.parentPhone}
              onChange={(event) => setValues((prev) => ({ ...prev, parentPhone: event.target.value }))}
              placeholder="+254..."
            />
            {fieldErrors.parentPhone ? (
              <span className="font-body-sm text-body-sm text-error">{fieldErrors.parentPhone}</span>
            ) : null}
          </FormField>
          <FormField label="Address" className="sm:col-span-2">
            <Textarea
              value={values.address}
              onChange={(event) => setValues((prev) => ({ ...prev, address: event.target.value }))}
              placeholder="Residential address"
            />
            {fieldErrors.address ? <span className="font-body-sm text-body-sm text-error">{fieldErrors.address}</span> : null}
          </FormField>
        </div>
      </form>
    </Modal>
  );
}
