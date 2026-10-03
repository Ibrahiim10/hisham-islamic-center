import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AppShellLayout } from '../components/layout/AppShellLayout';
import { ADMIN_BASE, adminPath } from '../constants/adminPaths';
import { AttendancePage } from '../pages/AttendancePage';
import { DashboardPage } from '../pages/DashboardPage';
import { FeesPage } from '../pages/FeesPage';
import { LoginPage } from '../pages/LoginPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { QuranLearningPage } from '../pages/QuranLearningPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { StudentProfilePage } from '../pages/StudentProfilePage';
import { StudentsPage } from '../pages/StudentsPage';
import { PublicLayout } from '../public/layout/PublicLayout';
import { AboutPage } from '../public/pages/AboutPage';
import { AdmissionPage } from '../public/pages/AdmissionPage';
import { ContactPage } from '../public/pages/ContactPage';
import { FarbarPage } from '../public/pages/FarbarPage';
import { HomePage } from '../public/pages/HomePage';
import { ProgramsPage } from '../public/pages/ProgramsPage';
import { TahfidhPage } from '../public/pages/TahfidhPage';
import { WomensSectionPage } from '../public/pages/WomensSectionPage';
import { LegacyAdminRedirect } from './LegacyAdminRedirect';

const LEGACY_ADMIN_PREFIXES = [
  'students',
  'attendance',
  'fees',
  'quran-learning',
  'reports',
  'notifications',
  'settings',
] as const;

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="tahfidh" element={<TahfidhPage />} />
        <Route path="farbar" element={<FarbarPage />} />
        <Route path="womens-section" element={<WomensSectionPage />} />
        <Route path="admission" element={<AdmissionPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      <Route path="/login" element={<Navigate to={adminPath('login')} replace />} />
      {LEGACY_ADMIN_PREFIXES.map((segment) => (
        <Route key={segment} path={`/${segment}/*`} element={<LegacyAdminRedirect />} />
      ))}

      <Route path={adminPath('login')} element={<LoginPage />} />
      <Route path={ADMIN_BASE} element={<ProtectedRoute />}>
        <Route element={<AppShellLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/:id" element={<StudentProfilePage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="fees" element={<FeesPage />} />
          <Route path="quran-learning" element={<QuranLearningPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
