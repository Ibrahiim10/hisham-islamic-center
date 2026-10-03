import { useState, type FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
import { FormField, Input, Select, Textarea } from '../../components/ui/FormControls';
import { usePageMeta } from '../../hooks/usePageMeta';
import { PUBLIC_SITE } from '../../constants/site';
import { SectionHeading } from '../components/SectionHeading';
import { submitAdmission, type AdmissionStream } from '../../services/public.service';
import { getAuthErrorMessage } from '../../services/auth.service';
import { ageFromDateOfBirth } from '../utils/ageFromDateOfBirth';

const STREAM_OPTIONS: { value: AdmissionStream; label: string }[] = [
  { value: 'regular_tahfidh', label: 'Regular Academic / Tahfidh' },
  { value: 'school_weekend', label: 'School-Going Stream (weekend)' },
  { value: 'school_weekday_evening', label: 'School-Going Stream (weekday evening)' },
  { value: 'womens_section', label: "Women's Section" },
];

export function AdmissionPage() {
  usePageMeta(`Admissions | ${PUBLIC_SITE.name}`, 'Apply for admission to Tahfidh, Farbar, or the Women\'s Section at Hisham Islamic Center.');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccess(null);
    const form = event.currentTarget;
    const fd = new FormData(form);

    const dateOfBirth = String(fd.get('dateOfBirth') ?? '');
    if (!dateOfBirth) {
      setFormError('Date of birth is required.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitAdmission({
        studentFullName: String(fd.get('studentFullName') ?? '').trim(),
        dateOfBirth,
        gender: String(fd.get('gender')) as 'male' | 'female',
        age: ageFromDateOfBirth(dateOfBirth),
        parentGuardianName: String(fd.get('parentGuardianName') ?? '').trim(),
        contactPhone: String(fd.get('contactPhone') ?? '').trim(),
        email: String(fd.get('email') ?? '').trim(),
        residentialAddress: String(fd.get('residentialAddress') ?? '').trim(),
        programStream: String(fd.get('programStream')) as AdmissionStream,
        paymentPreference: String(fd.get('paymentPreference')) as 'cash' | 'mpesa',
        notes: String(fd.get('notes') ?? '').trim() || undefined,
      });
      setSuccess(result.message);
      form.reset();
    } catch (error) {
      setFormError(getAuthErrorMessage(error, 'Unable to submit. Please check your details and try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-space-md py-space-xl lg:px-space-lg">
      <SectionHeading
        eyebrow="Admission"
        title="Apply for admission"
        description="Complete the form below. Our team will contact you regarding program placement and next steps."
      />

      <form className="mt-space-lg space-y-space-lg rounded-2xl border border-outline-variant/50 bg-white p-space-lg shadow-sm" onSubmit={handleSubmit} noValidate>
        {success ? (
          <div className="rounded-lg border border-brand-primary/30 bg-[#e8f2f2] px-3 py-2 font-body-sm text-body-sm text-brand-primary" role="status">
            {success}
          </div>
        ) : null}
        {formError ? (
          <div className="rounded-lg border border-error/30 bg-error-container/40 px-3 py-2 font-body-sm text-body-sm text-error" role="alert">
            {formError}
          </div>
        ) : null}

        <fieldset className="space-y-space-md">
          <legend className="font-headline-md text-headline-md text-brand-primary">Student</legend>
          <FormField label="Full name">
            <Input name="studentFullName" required autoComplete="name" />
          </FormField>
          <div className="grid gap-space-md sm:grid-cols-2">
            <FormField label="Date of birth">
              <Input name="dateOfBirth" type="date" required />
            </FormField>
            <FormField label="Gender">
              <Select name="gender" required defaultValue="">
                <option value="" disabled>
                  Select
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
            </FormField>
          </div>
        </fieldset>

        <fieldset className="space-y-space-md">
          <legend className="font-headline-md text-headline-md text-brand-primary">Parent / guardian</legend>
          <FormField label="Parent / guardian name">
            <Input name="parentGuardianName" required />
          </FormField>
          <div className="grid gap-space-md sm:grid-cols-2">
            <FormField label="Contact phone">
              <Input name="contactPhone" type="tel" required autoComplete="tel" />
            </FormField>
            <FormField label="Email address">
              <Input name="email" type="email" required autoComplete="email" />
            </FormField>
          </div>
          <FormField label="Residential address">
            <Textarea name="residentialAddress" rows={3} required />
          </FormField>
        </fieldset>

        <fieldset className="space-y-space-md">
          <legend className="font-headline-md text-headline-md text-brand-primary">Program & payment</legend>
          <FormField label="Program / stream">
            <Select name="programStream" required defaultValue="">
              <option value="" disabled>
                Select a stream
              </option>
              {STREAM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Payment preference">
            <Select name="paymentPreference" required defaultValue="">
              <option value="" disabled>
                Select
              </option>
              <option value="cash">Cash payment</option>
              <option value="mpesa">M-PESA transfer</option>
            </Select>
          </FormField>
          <FormField label="Additional notes (optional)">
            <Textarea name="notes" rows={3} placeholder="Preferred schedule, questions, etc." />
          </FormField>
        </fieldset>

        <Button type="submit" variant="accent" className="w-full justify-center sm:w-auto" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit admission request'}
        </Button>
      </form>
    </section>
  );
}
