import { BRAND } from '../../constants/brand';
import { cn } from '../../utils/cn';

type HishamLogoVariant = 'full' | 'compact' | 'sidebar';

type HishamLogoProps = {
  variant?: HishamLogoVariant;
  className?: string;
};

const variantClasses: Record<HishamLogoVariant, string> = {
  full: 'h-28 w-auto max-w-[min(100%,240px)] object-contain sm:h-32',
  compact: 'h-9 w-9 object-contain',
  sidebar: 'h-10 w-10 shrink-0 object-contain',
};

export function HishamLogo({ variant = 'full', className }: HishamLogoProps) {
  return (
    <img
      src={BRAND.logoUrl}
      alt={BRAND.logoAlt}
      className={cn(variantClasses[variant], className)}
      decoding="async"
    />
  );
}
