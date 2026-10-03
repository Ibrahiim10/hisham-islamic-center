import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HishamLogo } from '../../components/brand/HishamLogo';
import { Button } from '../../components/ui/Button';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { PUBLIC_NAV, PUBLIC_SITE } from '../../constants/site';
import { cn } from '../../utils/cn';

export function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/40 bg-[#FFFCF7]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-space-md py-3 lg:px-space-lg">
        <Link to="/" className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <HishamLogo variant="sidebar" className="h-11 w-11" />
          <span className="hidden font-title-sm text-title-sm font-semibold text-brand-primary sm:block">{PUBLIC_SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {PUBLIC_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 font-body-sm text-body-sm transition-colors',
                  isActive ? 'bg-brand-primary/10 font-semibold text-brand-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link to="/admission">
            <Button variant="accent" className="shadow-sm">
              Apply for Admission
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low lg:hidden"
          aria-expanded={open}
          aria-controls="public-mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <MaterialIcon name={open ? 'close' : 'menu'} className="text-[24px]" />
        </button>
      </div>

      {open ? (
        <nav id="public-mobile-nav" className="border-t border-outline-variant/30 bg-surface-container-lowest px-space-md py-space-md lg:hidden" aria-label="Mobile primary">
          <ul className="flex flex-col gap-1">
            {PUBLIC_NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-lg px-3 py-2.5 font-body-md text-body-md',
                      isActive ? 'bg-brand-primary/10 font-semibold text-brand-primary' : 'text-on-surface',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <Link to="/admission" onClick={() => setOpen(false)}>
                <Button variant="accent" className="w-full justify-center">
                  Apply for Admission
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
