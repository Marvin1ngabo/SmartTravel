import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  console.log('ProtectedRoute - user:', user, 'hasCompletedOnboarding:', user?.hasCompletedOnboarding);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user has completed onboarding
  if (!user.hasCompletedOnboarding) {
    console.log('User has not completed onboarding, redirecting...');
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
