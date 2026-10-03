import { Outlet } from 'react-router-dom';
import { PublicFooter } from '../components/PublicFooter';
import { PublicNavbar } from '../components/PublicNavbar';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#FAF7F2] text-on-surface">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
