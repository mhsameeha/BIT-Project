'use client';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';

type WithRoleGuardProps = {
  allowedRoles: string[];
  children: ReactNode;
};

export function WithRoleGuard({ allowedRoles, children }: WithRoleGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const user = authClient.getBasicUserInfo();
    if (!user || !allowedRoles.includes(user.role?.toLowerCase())) {
      // Redirect to home or unauthorized page
      router.replace('/');
    }
  }, [allowedRoles, router]);

  return <>{children}</>;
}