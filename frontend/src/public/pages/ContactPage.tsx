import { useState, type FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
import { FormField, Input, Textarea } from '../../components/ui/FormControls';
import { usePageMeta } from '../../hooks/usePageMeta';
import { PUBLIC_SITE } from '../../constants/site';
import { SectionHeading } from '../components/SectionHeading';
import { submitContact } from '../../services/public.service';
import { getAuthErrorMessage } from '../../services/auth.service';

export function ContactPage() {
  usePageMeta(`Contact | ${PUBLIC_SITE.name}`, `Contact Hisham Islamic Center — ${PUBLIC_SITE.address.full}. Phone ${PUBLIC_SITE.phone}.`);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccess(null);
    const form = event.currentTarget;
    const fd = new FormData(form);

    setSubmitting(true);
    try {
      const result = await submitContact({
        fullName: String(fd.get('fullName') ?? '').trim(),
        email: String(fd.get('email') ?? '').trim(),
        phone: String(fd.get('phone') ?? '').trim() || undefined,
        subject: String(fd.get('subject') ?? '').trim() || undefined,
        message: String(fd.get('message') ?? '').trim(),
      });
      setSuccess(result.message);
      form.reset();
    } catch (error) {
      setFormError(getAuthErrorMessage(error, 'Unable to send your message. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="bg-surface-container-low px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto grid max-w-6xl gap-space-lg lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Contact" title="Get in touch" description="Visit our campus in Parklands or send an enquiry below." />
            <address className="mt-space-lg not-italic">
              <p className="font-headline-md text-headline-md text-brand-primary">{PUBLIC_SITE.name}</p>
              <p className="mt-space-sm font-body-md text-body-md text-on-surface-variant">{PUBLIC_SITE.address.lines.join(', ')}</p>
              <a href={`tel:${PUBLIC_SITE.phoneTel}`} className="mt-space-md block font-headline-md text-headline-md text-brand-secondary">
                {PUBLIC_SITE.phone}
              </a>
            </address>
          </div>
          <div className="rounded-2xl border border-outline-variant/40 bg-white p-space-lg shadow-sm">
            <h2 className="font-headline-md text-headline-md text-brand-primary">Enquiry form</h2>
            <form className="mt-space-md space-y-space-md" onSubmit={handleSubmit} noValidate>
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
              <FormField label="Your name">
                <Input name="fullName" required autoComplete="name" />
              </FormField>
              <div className="grid gap-space-md sm:grid-cols-2">
                <FormField label="Email">
                  <Input name="email" type="email" required autoComplete="email" />
                </FormField>
                <FormField label="Phone (optional)">
                  <Input name="phone" type="tel" autoComplete="tel" />
                </FormField>
              </div>
              <FormField label="Subject (optional)">
                <Input name="subject" />
              </FormField>
              <FormField label="Message">
                <Textarea name="message" rows={5} required minLength={10} />
              </FormField>
              <Button type="submit" variant="accent" className="w-full justify-center" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send message'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-space-md py-space-xl lg:px-space-lg" aria-label="Location">
        <SectionHeading title="Location" description={PUBLIC_SITE.address.full} align="center" />
        <div className="mt-space-lg flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-white/60 p-space-lg text-center font-body-md text-body-md text-on-surface-variant">
          <p>
            5th Parklands, Iregi Road, Rodol Diamond — Nairobi, Kenya
            <br />
            <span className="text-body-sm">Use your preferred maps app for directions to our campus.</span>
          </p>
        </div>
      </section>
    </>
  );
}
