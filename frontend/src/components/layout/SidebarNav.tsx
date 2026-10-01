import { NavLink, useNavigate } from 'react-router-dom';
import { navSections, type NavItem } from '../../config/navigation';
import { HishamLogo } from '../brand/HishamLogo';
import { BRAND } from '../../constants/brand';
import { useAuth } from '../../context/AuthContext';
import { useShell } from '../../context/ShellContext';
import { cn } from '../../utils/cn';
import { MaterialIcon } from '../ui/MaterialIcon';

type SidebarNavProps = {
  onNavigate?: () => void;
  className?: string;
  /** Mobile drawer always shows expanded labels */
  forceExpanded?: boolean;
};

function SidebarNavItem({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      title={collapsed ? item.label : undefined}
      aria-label={item.label}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex h-11 items-center rounded-lg transition-[background-color,color] duration-200',
          collapsed ? 'justify-center px-0' : 'gap-3 px-3',
          isActive
            ? 'bg-[rgba(165,129,94,0.18)] font-semibold text-brand-secondary'
            : 'text-white/85 hover:bg-white/[0.06]',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <span
              aria-hidden
              className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r bg-brand-secondary"
            />
          ) : null}
          <MaterialIcon
            name={item.icon}
            className={cn(
              'shrink-0 text-[20px] leading-none',
              isActive ? 'text-brand-secondary' : 'text-white/60 group-hover:text-white/85',
            )}
          />
          {!collapsed ? <span className="truncate text-[14px] leading-5">{item.label}</span> : null}
        </>
      )}
    </NavLink>
  );
}

export function SidebarNav({ onNavigate, className, forceExpanded = false }: SidebarNavProps) {
  const { sidebarCollapsed, toggleSidebarCollapsed } = useShell();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const collapsed = forceExpanded ? false : sidebarCollapsed;

  async function handleSignOut() {
    await logout();
    onNavigate?.();
    navigate('/login', { replace: true });
  }

  return (
    <aside
      className={cn(
        'flex h-full min-h-0 flex-col border-r border-white/10 bg-brand-primary text-white',
        collapsed ? 'w-[72px]' : 'w-[260px]',
        className,
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className={cn('border-b border-white/10 px-4 pb-4 pt-5', collapsed && 'px-2')}>
          <div className={cn('flex items-center', collapsed ? 'justify-center' : 'gap-3')}>
            <HishamLogo variant="sidebar" />
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold leading-tight tracking-tight">{BRAND.name}</p>
                <p className="truncate text-[10px] font-medium uppercase tracking-[0.14em] text-white/55">
                  Madrasa Management
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto overflow-x-hidden px-4 py-4">
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed ? (
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  {section.label}
                </p>
              ) : null}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <SidebarNavItem key={item.to} item={item} collapsed={collapsed} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className={cn('mt-auto border-t border-white/10 px-4 py-4', collapsed && 'px-2')}>
        {!forceExpanded ? (
          <button
            type="button"
            onClick={toggleSidebarCollapsed}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'mb-3 flex h-9 w-full items-center rounded-lg text-white/70 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white',
              collapsed ? 'justify-center px-0' : 'gap-3 px-3',
            )}
          >
            <MaterialIcon name={collapsed ? 'chevron_right' : 'chevron_left'} className="text-[20px]" />
            {!collapsed ? <span className="text-[13px]">Collapse</span> : null}
          </button>
        ) : null}

        <button
          type="button"
          className={cn(
            'mb-2 flex w-full items-center rounded-lg border border-white/10 bg-white/[0.04] text-left transition-colors duration-200 hover:bg-white/[0.06]',
            collapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3 py-2.5',
          )}
          title={collapsed ? BRAND.academicSession : undefined}
        >
          <MaterialIcon name="calendar_today" className="shrink-0 text-[18px] text-brand-secondary" />
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-[12px] font-semibold leading-tight text-white">2024–2025</span>
              <span className="block truncate text-[11px] leading-tight text-white/55">Term 2</span>
            </span>
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => void handleSignOut()}
          className={cn(
            'flex h-10 w-full items-center rounded-lg text-white/65 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white',
            collapsed ? 'justify-center px-0' : 'gap-3 px-3',
          )}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <MaterialIcon name="logout" className="text-[20px]" />
          {!collapsed ? <span className="text-[14px] font-medium">Sign Out</span> : null}
        </button>
      </div>
    </aside>
  );
}
