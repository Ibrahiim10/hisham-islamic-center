import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AppShellLayout } from '../components/layout/AppShellLayout';
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

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
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
