import { cn } from '../../utils/cn';

type MaterialIconProps = {
  name: string;
  className?: string;
  filled?: boolean;
};

export function MaterialIcon({ name, className, filled }: MaterialIconProps) {
  return (
    <span
      className={cn('material-symbols-outlined leading-none', className)}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden
    >
      {name}
    </span>
  );
}
