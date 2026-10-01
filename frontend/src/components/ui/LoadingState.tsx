export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-space-sm rounded-xl bg-surface-container-lowest p-space-xl shadow-card">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-container border-t-transparent" />
      <span className="font-body-md text-body-md text-on-surface-variant">{label}</span>
    </div>
  );
}
