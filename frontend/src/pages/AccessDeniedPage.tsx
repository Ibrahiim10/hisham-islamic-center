import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { HishamLogo } from '../components/brand/HishamLogo';

export function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-space-lg">
      <div className="w-full max-w-md rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-space-lg text-center shadow-modal">
        <HishamLogo variant="compact" className="mx-auto mb-space-md" />
        <h1 className="font-headline-md text-headline-md text-on-surface">Access denied</h1>
        <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant">
          Your account does not have permission to use this administration portal.
        </p>
        <Button type="button" className="mt-space-lg w-full justify-center" onClick={() => navigate('/login')}>
          Return to login
        </Button>
      </div>
    </div>
  );
}
