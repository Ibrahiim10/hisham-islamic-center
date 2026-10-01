import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/format';

type AvatarProps = {
  name: string;
  src?: string;
  className?: string;
};

export function Avatar({ name, src, className }: AvatarProps) {
  if (src) {
    return <img src={src} alt={name} className={cn('rounded-full object-cover', className)} />;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary-container font-title-sm text-on-primary',
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
