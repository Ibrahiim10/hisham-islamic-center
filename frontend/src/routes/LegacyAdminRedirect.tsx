import { Navigate, useLocation } from 'react-router-dom';
import { ADMIN_BASE } from '../constants/adminPaths';

/** Preserves bookmarks from pre-public-site admin URLs (e.g. /students → /admin/students). */
export function LegacyAdminRedirect() {
  const { pathname, search, hash } = useLocation();
  const suffix = pathname.replace(/^\//, '');
  const target = suffix ? `${ADMIN_BASE}/${suffix}` : ADMIN_BASE;
  return <Navigate to={`${target}${search}${hash}`} replace />;
}
