import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'subtle';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-container text-on-primary shadow-md hover:bg-tertiary-container',
  secondary: 'bg-secondary text-on-secondary shadow-sm hover:opacity-95',
  accent: 'bg-brand-secondary text-white shadow-sm hover:opacity-95',
  ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container-low',
  subtle:
    'bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-low border border-outline-variant/40',
};

export function Button({
  variant = 'primary',
  className,
  leftIcon,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-9 items-center gap-space-xs rounded-lg px-space-md font-title-sm text-body-sm transition-all disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
    </button>
  );
}
