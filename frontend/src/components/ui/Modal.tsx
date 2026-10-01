import { useEffect, type ReactNode } from 'react';
import { MaterialIcon } from './MaterialIcon';
import { cn } from '../../utils/cn';

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function Modal({ open, title, description, onClose, children, footer, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-space-md sm:items-center">
      <button
        type="button"
        aria-label="Close dialog backdrop"
        className="absolute inset-0 bg-primary-container/45"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative z-[101] w-full max-w-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-modal',
          className,
        )}
      >
        <div className="mb-space-md flex items-start justify-between gap-space-md">
          <div>
            <h3 id="modal-title" className="font-headline-md text-headline-md text-on-surface">
              {title}
            </h3>
            {description ? (
              <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-container-low"
          >
            <MaterialIcon name="close" className="text-[20px]" />
          </button>
        </div>
        {children}
        {footer ? <div className="mt-space-lg flex justify-end gap-space-sm">{footer}</div> : null}
      </div>
    </div>
  );
}
