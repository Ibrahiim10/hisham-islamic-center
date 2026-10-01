import { MaterialIcon } from './MaterialIcon';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: string;
};

export function EmptyState({ title, description, icon = 'inbox' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant/70 bg-surface-container-low/40 px-space-lg py-space-xl text-center">
      <MaterialIcon name={icon} className="mb-space-sm text-[28px] text-outline" />
      <p className="font-title-sm text-title-sm text-on-surface">{title}</p>
      {description ? (
        <p className="mt-1 max-w-md font-body-sm text-body-sm text-on-surface-variant">{description}</p>
      ) : null}
    </div>
  );
}
