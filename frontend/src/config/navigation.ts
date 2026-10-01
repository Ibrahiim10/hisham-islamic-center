export type NavItem = {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    label: 'MAIN',
    items: [
      { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
      { to: '/students', label: 'Students', icon: 'school' },
      { to: '/attendance', label: 'Attendance', icon: 'event_available' },
      { to: '/fees', label: 'Fees', icon: 'payments' },
      { to: '/quran-learning', label: "Qur'an & Learning", icon: 'menu_book' },
      { to: '/reports', label: 'Reports', icon: 'analytics' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { to: '/notifications', label: 'Notifications', icon: 'notifications' },
      { to: '/settings', label: 'Settings', icon: 'settings' },
    ],
  },
];

/** @deprecated Use navSections — kept for any legacy imports */
export const mainNavItems: NavItem[] = navSections.flatMap((section) => section.items);
