import { adminPath } from '../constants/adminPaths';

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
      { to: adminPath(), label: 'Dashboard', icon: 'dashboard', end: true },
      { to: adminPath('students'), label: 'Students', icon: 'school' },
      { to: adminPath('attendance'), label: 'Attendance', icon: 'event_available' },
      { to: adminPath('fees'), label: 'Fees', icon: 'payments' },
      { to: adminPath('quran-learning'), label: "Qur'an & Learning", icon: 'menu_book' },
      { to: adminPath('reports'), label: 'Reports', icon: 'analytics' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { to: adminPath('notifications'), label: 'Notifications', icon: 'notifications' },
      { to: adminPath('settings'), label: 'Settings', icon: 'settings' },
    ],
  },
];

/** @deprecated Use navSections — kept for any legacy imports */
export const mainNavItems: NavItem[] = navSections.flatMap((section) => section.items);
