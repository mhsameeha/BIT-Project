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
const [selectedTutor, setSelectedTutor] = useState<any>(null); // Replace 'any' with your tutor type

// Dialog handlers
const handleOpenApproveDialog = (tutor: any) => {
  setSelectedTutor(tutor);
  setApproveDialogOpen(true);
};

const handleCloseApproveDialog = () => {
  setApproveDialogOpen(false);
};

const handleOpenRejectDialog = (tutor: any) => {
  setSelectedTutor(tutor);
  setRejectDialogOpen(true);
};

const handleCloseRejectDialog = () => {
  setRejectDialogOpen(false);
};

// Action handlers
const handleApproveTutor = (tutor: any) => {
  const fetchData = async () => {
  const req = await approveTutorApplication(tutor.tutorId)
}
fetchData();
 console.log('Approving tutor:', tutor);
};

const handleRejectTutor = (tutor: any) => {
  // Implement your rejection logic here
 
  const fetchData = async () => {
  const req = await rejectTutorApplication(tutor.tutorId)
}
fetchData();
 console.log('Rejecting tutor:', tutor);
};
  // Helper function to format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper function to calculate approval rate
  const calculateApprovalRate = (pending: number, approved: number): number => {
    const total = pending + approved;
    return total > 0 ? Math.round((approved / total) * 100) : 0;
  };

  // Helper function to get recent activity
  // const getRecentActivity = () => {
  //   if (!dashboardData) return [];
    
  //   return [
  //     ...dashboardData.recentTutorSignups.map(tutor => ({
  //       type: 'Tutor Signup',
  //       name: `${tutor.firstName} ${tutor.lastName}`,
  //       date: tutor.signupDate,
  //       status: tutor.status,
  //     })),
  //     ...dashboardData.recentStudentSignups.map(student => ({
  //       type: 'Student Signup',
  //       name: `${student.firstName} ${student.lastName}`,
  //       date: student.signupDate,
  //       status: 'Active',
  //     })),
  //   ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  //   .slice(0, 5);
  // };

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

                 {dashboardData?.pendingTutorApprovals > 0 && ( 
                           <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Recent Applications
                            </Typography>
                            <TableContainer>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Tutor</TableCell>
                                    <TableCell>Applied</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {dashboardData?.recentTutorApplications?.slice(0, 3).map((tutor) => (
                                    <TableRow 
                                    key={tutor.tutorId}
                                    >
                                      <TableCell>
                                        <Link
                                          href={`/tutors/${tutor.tutorId}`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            router.push(`/tutors/${tutor.tutorId}`);
                                          }}
                                          sx={{
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            '&:hover': {
                                              textDecoration: 'underline',
                                              color: 'primary.main',
                                              cursor: 'pointer',
                                            },
                                          }}
                                        >
                                          <Typography variant="body2">
                                            {tutor.tutorName} 
                                          </Typography>
                                        </Link>
                                      </TableCell>
                                      <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                          {dayjs(tutor.approvalRequestDate).format('DD/MM/YYYY')}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                          <Tooltip title="Approve">
                                            <IconButton
                                              size="small"
                                              color="success"
                                              onClick={() => handleOpenApproveDialog(tutor)}
                                            >
                                              <CheckCircle size={18} />
                                            </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Reject">
                                            <IconButton
                                              size="small"
                                              color="error"
                                              onClick={() => handleOpenRejectDialog(tutor)}
                                            >
                                              <XCircle size={18} />
                                            </IconButton>
                                          </Tooltip>
                                        </Stack>
                                      </TableCell>
                                      
                                    </TableRow>
                                   ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                            </Box>
                 )}


                  {/* Approve Confirmation Dialog */}
                  <Dialog
                    open={approveDialogOpen}
                    onClose={handleCloseApproveDialog}
                    aria-labelledby="approve-dialog-title"
                  >
                    <DialogTitle id="approve-dialog-title">Confirm Approval</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Are you sure you want to approve this tutor application?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseApproveDialog}>Cancel</Button>
                      <Button 
                        onClick={() => {
                          handleApproveTutor(selectedTutor);
                          handleCloseApproveDialog();
                        }}
                        color="success"
                        autoFocus
                      >
                        Approve
                      </Button>
                    </DialogActions>
                  </Dialog>

                  {/* Reject Confirmation Dialog */}
                  <Dialog
                    open={rejectDialogOpen}
                    onClose={handleCloseRejectDialog}
                    aria-labelledby="reject-dialog-title"
                  >
                    <DialogTitle id="reject-dialog-title">Confirm Rejection</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Are you sure you want to reject this tutor application?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseRejectDialog}>Cancel</Button>
                      <Button 
                        onClick={() => {
                          handleRejectTutor(selectedTutor);
                          handleCloseRejectDialog();
                        }}
                        color="error"
                        autoFocus
                      >
                        Reject
                      </Button>
                    </DialogActions>
                  </Dialog>
                 
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

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Recent Activity
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* {getRecentActivity().map((activity, index) => ( */}
                          {/* <TableRow key={index}> */}
                            <TableCell>
                              {/* <Typography variant="body2">{activity.type}</Typography> */}
                            </TableCell>
                            <TableCell>
                              {/* <Typography variant="body2">{activity.name}</Typography> */}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {/* {dayjs(activity.date).format('MMM D')} */}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Chip
                                // label={activity.status}
                                // size="small"
                                // color={
                                //   activity.status === 'Approved' ? 'success' : 
                                //   activity.status === 'Pending' ? 'warning' : 'default'
                                // }
                              />
                            </TableCell>
                          {/* </TableRow> */}
                        {/* ))} */}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}