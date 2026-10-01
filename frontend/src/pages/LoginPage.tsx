import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthLoadingScreen } from '../components/auth/AuthLoadingScreen';
import { Button } from '../components/ui/Button';
import { FormField, Input } from '../components/ui/FormControls';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { HishamLogo } from '../components/brand/HishamLogo';
import { BRAND } from '../constants/brand';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage } from '../services/auth.service';

type LoginLocationState = {
  from?: string;
};

export function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTarget = (location.state as LoginLocationState | null)?.from ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return <AuthLoadingScreen label="Loading…" />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTarget} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const nextErrors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address';
    }
    if (!password) {
      nextErrors.password = 'Password is required';
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await login(trimmedEmail, password);
      navigate(redirectTarget, { replace: true });
    } catch (error) {
      setFormError(getAuthErrorMessage(error, 'Unable to sign in. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-surface lg:grid-cols-2">
      <div className="relative hidden bg-primary-container p-space-xl text-on-primary lg:flex lg:flex-col lg:justify-between">
        <div>
          <HishamLogo variant="full" className="mb-space-lg" />
          <h1 className="font-headline-xl text-headline-xl">{BRAND.name}</h1>
          <p className="mt-space-sm max-w-md font-body-lg text-body-lg text-on-primary-container">{BRAND.tagline}</p>
          <p className="mt-space-md text-[11px] font-semibold uppercase tracking-[0.14em] text-on-primary-container/70">
            Madrasa Management
          </p>
        </div>
        <p className="font-body-sm text-body-sm text-on-primary-container/80">Secure admin access for madrasa operations.</p>
      </div>
      <div className="flex items-center justify-center p-space-lg">
        <div className="w-full max-w-md rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-space-lg shadow-modal">
          <div className="mb-space-md flex justify-center lg:hidden">
            <HishamLogo variant="full" className="h-24 max-w-[200px]" />
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Admin Login</h2>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">Sign in to manage students, fees, and attendance.</p>
          <form className="mt-space-lg space-y-space-md" onSubmit={handleSubmit} noValidate>
            {formError ? (
              <div
                className="rounded-lg border border-error/30 bg-error-container/40 px-3 py-2 font-body-sm text-body-sm text-error"
                role="alert"
              >
                {formError}
              </div>
            ) : null}
            <FormField label="Email">
              <Input
                type="email"
                autoComplete="email"
                placeholder="admin@hisham.local"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(fieldErrors.email)}
              />
              {fieldErrors.email ? (
                <span className="font-body-sm text-body-sm text-error">{fieldErrors.email}</span>
              ) : null}
            </FormField>
            <FormField label="Password">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="pr-10"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={Boolean(fieldErrors.password)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} className="text-[20px]" />
                </button>
              </div>
              {fieldErrors.password ? (
                <span className="font-body-sm text-body-sm text-error">{fieldErrors.password}</span>
              ) : null}
            </FormField>
            <Button className="w-full justify-center" type="submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
