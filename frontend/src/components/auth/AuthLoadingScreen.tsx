import { HishamLogo } from '../brand/HishamLogo';

export function AuthLoadingScreen({ label = 'Verifying session…' }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-space-md bg-surface px-space-lg">
      <HishamLogo variant="compact" className="opacity-90" />
      <div className="flex items-center gap-space-sm">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-secondary border-t-transparent" />
        <span className="font-body-md text-body-md text-on-surface-variant">{label}</span>
      </div>
    </div>
  );
}
