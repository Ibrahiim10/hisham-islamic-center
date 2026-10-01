import { useLocation } from 'react-router-dom';
import { HishamLogo } from '../brand/HishamLogo';
import { BRAND } from '../../constants/brand';
import { useShell } from '../../context/ShellContext';
import { MaterialIcon } from '../ui/MaterialIcon';
import { SearchInput } from '../ui/SearchInput';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard Overview',
  '/students': 'Students Directory',
  '/attendance': 'Daily Attendance',
  '/fees': 'Fees & Collections',
  '/quran-learning': "Qur'an & Islamic Learning",
  '/reports': 'Institutional Reports',
  '/notifications': 'Parent Notifications',
  '/settings': 'Institution Settings',
};

export function AppHeader() {
  const location = useLocation();
  const { openMobileNav } = useShell();
  const pageTitle = pageTitles[location.pathname] ?? 'Madrasa Portal';

  return (
    <header className="sticky top-0 z-40 flex h-16 min-w-0 shrink-0 items-center justify-between gap-space-md border-b border-outline-variant/40 bg-surface-container-lowest px-space-md md:px-space-lg">
      <div className="flex min-w-0 items-center gap-space-sm">
        <button
          type="button"
          className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low md:hidden"
          onClick={openMobileNav}
          aria-label="Open navigation menu"
        >
          <MaterialIcon name="menu" className="text-[22px]" />
        </button>
        <HishamLogo variant="compact" className="md:hidden" />
        <div className="min-w-0">
          <div className="hidden items-center gap-space-sm md:flex">
            <span className="font-title-sm text-title-sm text-on-surface-variant">Madrasa Portal</span>
            <span className="font-label-sm text-outline">/</span>
            <span className="truncate font-title-sm text-title-sm text-on-surface">{pageTitle}</span>
          </div>
          <span className="truncate font-title-sm text-title-sm text-on-surface md:hidden">{BRAND.name}</span>
        </div>
      </div>

      <SearchInput
        containerClassName="hidden min-w-0 max-w-lg flex-1 md:flex"
        className="h-[38px] border border-outline-variant/60 bg-surface shadow-none"
        placeholder="Search students, parent phone, M-Pesa ref..."
      />

      <div className="flex shrink-0 items-center gap-space-md">
        <span className="hidden rounded-full bg-surface-container-high px-space-sm py-0.5 font-label-sm text-label-sm font-semibold text-primary-container lg:inline-flex">
          Term 2 Active
        </span>
        <button
          type="button"
          className="relative rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
        >
          <MaterialIcon name="notifications" className="text-[22px]" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-error ring-2 ring-surface-container-lowest" />
        </button>
        <div className="hidden h-6 w-px bg-outline-variant/40 sm:block" />
        <button
          type="button"
          className="flex items-center gap-space-sm rounded-lg p-1.5 transition-colors hover:bg-surface-container-low"
        >
          <img alt={BRAND.adminName} className="h-8 w-8 rounded-full object-cover" src={BRAND.adminAvatarUrl} />
          <div className="hidden flex-col text-left sm:flex">
            <span className="font-label-md text-label-md leading-tight text-on-surface">{BRAND.adminName}</span>
            <span className="font-label-sm text-label-sm leading-tight text-on-surface-variant">{BRAND.adminRole}</span>
          </div>
          <MaterialIcon name="expand_more" className="hidden text-[18px] text-outline sm:inline" />
        </button>
      </div>
    </header>
  );
}
