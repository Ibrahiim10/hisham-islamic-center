import { Outlet } from 'react-router-dom';
import { useShell } from '../../context/ShellContext';
import { cn } from '../../utils/cn';
import { AppHeader } from './AppHeader';
import { SidebarNav } from './SidebarNav';

export function AppShellLayout() {
  const { mobileNavOpen, closeMobileNav, sidebarCollapsed } = useShell();

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-surface">
      <div
        className={cn(
          'hidden shrink-0 md:block',
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]',
        )}
      >
        <div className="sticky top-0 h-screen">
          <SidebarNav />
        </div>
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-brand-primary/50"
            onClick={closeMobileNav}
          />
          <div className="relative h-full w-[260px] max-w-[85vw] shadow-modal">
            <SidebarNav onNavigate={closeMobileNav} forceExpanded />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="min-w-0 flex-1 bg-surface">
          <div className="mx-auto min-w-0 max-w-7xl p-space-lg lg:p-space-xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
