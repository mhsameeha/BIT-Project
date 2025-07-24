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
  Paper,
  TablePagination,
  Alert,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  Event as EventIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { CheckCircle, XCircle, Eye } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { AdminDashboardData, TutorApplication } from '@/types/admin-dashboard-data';
import { approveTutorApplication, getAdminDashboardData, rejectTutorApplication } from '@/Services/admin';
import { useRouter } from 'next/navigation';

export default function TutorManagementPage(): React.JSX.Element {
  const [applications, setApplications] = useState<TutorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Stats state
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    approvalRate: 0,
  });

  // State for dialogs and selected tutor
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = React.useState<TutorApplication|null>(null);

  // Fetch tutor applications
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAdminDashboardData();
        
        if ('error' in data) {
          setError(data.error);
          return;
        }

        setApplications(data.tutorApplications);

        console.log('app/n', data);
        
        // Calculate stats
        const pending = data.tutorApplications?.filter(app => app.status === 'Pending')?.length;
        const approved = data.tutorApplications?.filter(app => app.status === 'Approved')?.length;
        const rejected = data.tutorApplications?.filter(app => app.status === 'Rejected')?.length;
        const total = data.tutorApplications?.length;
        const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

        setStats({
          totalApplications: total,
          pending,
          approved,
          rejected,
          approvalRate,
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tutor applications');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Dialog handlers
  const handleOpenApproveDialog = (tutor: TutorApplication) => {
    setSelectedTutor(tutor);
    setApproveDialogOpen(true);
  };

  const handleCloseApproveDialog = () => {
    setApproveDialogOpen(false);
    setSelectedTutor(null);
  };

  const handleOpenRejectDialog = (tutor: TutorApplication) => {
    setSelectedTutor(tutor);
    setRejectDialogOpen(true);
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setSelectedTutor(null);
  };

  const handleOpenViewDialog = (tutorId: string) => {

    router.push(`/tutors/${tutorId}`);
    // setSelectedTutor(tutor);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedTutor(null);
  };

  // Action handlers
  const handleApproveTutor = async (tutor: TutorApplication) => {
    try {
      const result = await approveTutorApplication(tutor.tutorId);
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app.tutorId === tutor.tutorId ? { ...app, status: 'Approved' } : app
      ));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1,
        approvalRate: Math.round(((prev.approved + 1) / prev.totalApplications) * 100)
      }));
      
      handleCloseApproveDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve tutor');
    }
  };

  const handleRejectTutor = async (tutor: TutorApplication) => {
    try {
      const result = await rejectTutorApplication(tutor.tutorId);
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app.tutorId === tutor.tutorId ? { ...app, status: 'Rejected' } : app
      ));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1,
        approvalRate: Math.round((prev.approved / prev.totalApplications) * 100)
      }));
      
      handleCloseRejectDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject tutor');
    }
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter applications by status
  const filteredApplications = applications;
  const paginatedApplications = filteredApplications?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Loading tutor applications...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Error loading tutor applications
        </Typography>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Tutor Approval Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Applications */}
        <Grid item xs={12} sm={6} md={3}>
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
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    Total Applications
                  </Typography>
                  <Typography variant="h4">{stats.totalApplications}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Approvals */}
        <Grid item xs={12} sm={6} md={3}>
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
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    Pending Approval
                  </Typography>
                  <Typography variant="h4">{stats.pending}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Approved Tutors */}
        <Grid item xs={12} sm={6} md={3}>
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
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    Approved Tutors
                  </Typography>
                  <Typography variant="h4">{stats.approved}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Rejected Tutors */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    backgroundColor: 'error.main',
                    borderRadius: 1,
                    p: 1,
                    color: 'white',
                  }}
                >
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    Rejected Tutors
                  </Typography>
                  <Typography variant="h4">{stats.rejected}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Approval Rate Card */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Approval Rate"
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
                    Current approval rate
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stats.approvalRate}
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {stats.approved} approved • {stats.rejected} rejected • {stats.pending} pending
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tutor Applications Table */}
      <Card>
        <CardHeader
          title="Pending Tutor Applications"
          subheader={`${filteredApplications?.length} applications awaiting review`}
          avatar={
            <Avatar sx={{ bgcolor: 'warning.main' }}>
              <SchoolIcon />
            </Avatar>
          }
        />
        <CardContent>
          {filteredApplications?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tutor</TableCell>
                    <TableCell>Application Date</TableCell>
                    <TableCell>Specialities</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedApplications.map((application) => (
                    <TableRow key={application.tutorId}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box>
                            <Typography variant="subtitle2">{application.tutorName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {application.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {dayjs(application.approvalRequestDate).format('DD/MM/YYYY')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {application.specialities?.map((value) =>
                        <Typography variant="body2">
                        <Chip key={value} size = "small" label = {value}/>
                        </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={application.status}
                          color={
                            application.status === 'Approved' ? 'success' :
                            application.status === 'Rejected' ? 'error' : 'warning'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenViewDialog(application.tutorId)}
                            >
                              <Eye size={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Approve">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleOpenApproveDialog(application)}
                            >
                              <CheckCircle size={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleOpenRejectDialog(application)}
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
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredApplications?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          ) : (
            <Alert severity="info">
              No pending tutor applications to review.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* View Tutor Dialog
      <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
        <DialogTitle>Tutor Application Details</DialogTitle>
        <DialogContent>
          {selectedTutor && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Box>
                  <Typography variant="h5">{selectedTutor.tutorName}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {selectedTutor.email}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Applied on {dayjs(selectedTutor.applicationDate).format('MMMM D, YYYY')}
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              <Box>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Phone Number:
                    </Typography>
                    <Typography variant="body1">{selectedTutor.phone || 'Not provided'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Date of Birth:
                    </Typography>
                    <Typography variant="body1">
                      {selectedTutor.dob ? dayjs(selectedTutor.dob).format('MMMM D, YYYY') : 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Address:
                    </Typography>
                    <Typography variant="body1">{selectedTutor.address || 'Not provided'}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" gutterBottom>
                  Professional Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Qualifications:
                    </Typography>
                    <Stack spacing={0.5}>
                      {selectedTutor.qualifications.map((qual, index) => (
                        <Typography key={index} variant="body1">
                          • {qual}
                        </Typography>
                      ))}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Subjects:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {selectedTutor.subjects.map((subject, index) => (
                        <Chip key={index} label={subject} size="small" />
                      ))}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Teaching Experience:
                    </Typography>
                    <Typography variant="body1">
                      {selectedTutor.experience || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Bio:
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {selectedTutor.bio || 'Not provided'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {selectedTutor.additionalInfo && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Additional Information
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {selectedTutor.additionalInfo}
                    </Typography>
                  </Box>
                </>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog> */}

      {/* Approve Confirmation Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={handleCloseApproveDialog}
        aria-labelledby="approve-dialog-title"
      >
        <DialogTitle id="approve-dialog-title">Confirm Approval</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this tutor application? This will grant them full tutor privileges.
          </DialogContentText>
          {selectedTutor && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2">{selectedTutor.tutorName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Applied on {dayjs(selectedTutor.approvalRequestDate).format('MMMM D, YYYY')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApproveDialog}>Cancel</Button>
          <Button 
            onClick={() => selectedTutor && handleApproveTutor(selectedTutor)}
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
            Are you sure you want to reject this tutor application? This action cannot be undone.
          </DialogContentText>
          {selectedTutor && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2">{selectedTutor.tutorName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Applied on {dayjs(selectedTutor.approvalRequestDate).format('MMMM D, YYYY')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>Cancel</Button>
          <Button 
            onClick={() => selectedTutor && handleRejectTutor(selectedTutor)}
            color="error"
            autoFocus
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}