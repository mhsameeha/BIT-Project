'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Tooltip,
  IconButton,
  Stack,
  Link,
} from '@mui/material';
import { CheckCircle, XCircle } from '@phosphor-icons/react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  FormControl,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  Event as EventIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { AdminDashboardData } from '@/types/admin-dashboard-data';
import { approveTutorApplication, getAdminDashboardData, rejectTutorApplication } from '@/Services/admin';
import { useRouter } from 'next/navigation';

// Services
// import { getAdminDashboardData } from '@/Services/admin';

export default function AdminDashboardPage(): React.JSX.Element {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAdminDashboardData();
        if ('error' in data) {
          return;
        }
        else
        {setDashboardData(data);

        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // State for dialogs and selected tutor
const [approveDialogOpen, setApproveDialogOpen] = useState(false);
const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
const [selectedTutor, setSelectedTutor] = useState<any>(null); 


  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };


  const calculateApprovalRate = (pending: number, approved: number): number => {
    const total = pending + approved;
    return total > 0 ? Math.round((approved / total) * 100) : 0;
  };


  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Loading dashboard...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Error loading dashboard
        </Typography>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Tutors */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    backgroundColor: 'primary.main',
                    borderRadius: 1,
                    p: 1,
                    color: 'white',
                  }}
                >
                  <SchoolIcon />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    Total Tutors
                  </Typography>
                  <Typography variant="h4">{dashboardData?.totalTutors || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dashboardData?.pendingTutorApprovals || 0} pending approval
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Students */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    backgroundColor: 'success.main',
                    borderRadius: 1,
                    p: 1,
                    color: 'white',
                  }}
                >
                  <PeopleIcon />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    Total Students
                  </Typography>
                  <Typography variant="h4">{dashboardData?.totalStudents || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dashboardData?.newStudentsThisMonth || 0} new this month
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Income */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    backgroundColor: 'warning.main',
                    borderRadius: 1,
                    p: 1,
                    color: 'white',
                  }}
                >
                  <MoneyIcon />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    Total Income
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData ? formatCurrency(dashboardData.totalRevenue) : 'LKR 0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dashboardData ? formatCurrency(dashboardData.monthlyRevenue) : 'LKR 0'} this month
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Admin Cards */}
      <Grid container spacing={3}>
        {/* Tutor Approval Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Tutor Approvals"
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AssignmentIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Approval Rate
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={dashboardData ? calculateApprovalRate(
                      dashboardData.pendingTutorApprovals,
                      dashboardData.approvedTutors
                    ) : 0}
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  /> 
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {dashboardData ? `${dashboardData.approvedTutors} approved` : '0 approved'} •{' '}
                    {dashboardData ? `${dashboardData.pendingTutorApprovals} pending` : '0 pending'}
                  </Typography>
                </Box> 
                 
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* System Alerts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="System Alerts"
              avatar={
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <WarningIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Unresolved Issues
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {/* {dashboardData?.unresolvedIssues || 0} */}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}