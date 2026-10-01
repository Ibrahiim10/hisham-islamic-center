import type { InputHTMLAttributes } from 'react';
import { MaterialIcon } from './MaterialIcon';
import { cn } from '../../utils/cn';

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  containerClassName?: string;
};

export function SearchInput({ className, containerClassName, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative', containerClassName)}>
      <MaterialIcon
        name="search"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-outline"
      />
      <input
        className={cn(
          'h-10 w-full rounded-lg bg-surface-container-lowest pl-10 pr-space-md font-body-sm text-body-sm text-on-surface shadow-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/20',
          className,
        )}
        {...props}
      />
    </div>
  );
}
