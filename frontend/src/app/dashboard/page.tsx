'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';

import { UserContext } from '@/contexts/user-context';

export default function DashboardPage(): React.JSX.Element {
  const router = useRouter();
  const userContext = React.useContext(UserContext);

  useEffect(() => {
    if (!userContext) {
      // If no user context, redirect to sign in
      router.replace('/auth/sign-in');
      return;
    }

    const { user, isLoading } = userContext;

    if (isLoading) return;

    if (!user) {
      router.replace('/auth/sign-in');
      return;
    }

    // Get user role and redirect accordingly
    const userRole = (user.role as string)?.toLowerCase() || 'learner';
    
    switch (userRole) {
      case 'tutor':
        router.replace('/tutor-dashboard');
        break;
      case 'admin':
        router.replace('/admin-dashboard');
        break;
      case 'learner':
      default:
        router.replace('/learner-dashboard');
        break;
    }
  }, [userContext, router]);

  // Show loading while determining redirect
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: 2
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="h6" color="text.secondary">
        Redirecting to your dashboard...
      </Typography>
    </Box>
  );
}
