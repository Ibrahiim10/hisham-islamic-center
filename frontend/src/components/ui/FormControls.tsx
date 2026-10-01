import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type FieldProps = {
  label: string;
  hint?: string;
  className?: string;
};

export function FormField({
  label,
  hint,
  className,
  children,
}: FieldProps & { children: ReactNode }) {
  return (
    <label className={cn('flex flex-col gap-1', className)}>
      <span className="font-label-md text-label-md text-on-surface">{label}</span>
      {children}
      {hint ? <span className="font-body-sm text-body-sm text-on-surface-variant">{hint}</span> : null}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-[38px] rounded-lg border border-outline-variant/70 bg-surface-container-lowest px-3 font-body-sm text-body-sm text-on-surface focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/15',
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-[38px] rounded-lg border border-outline-variant/70 bg-surface-container-lowest px-3 font-body-sm text-body-sm text-on-surface focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/15',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-[96px] rounded-lg border border-outline-variant/70 bg-surface-container-lowest px-3 py-2 font-body-sm text-body-sm text-on-surface focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/15',
        className,
      )}
      {...props}
    />
  );
}
