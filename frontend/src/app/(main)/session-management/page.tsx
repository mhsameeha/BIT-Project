'use client';

import * as React from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  FormControlLabel,
  Checkbox,
  Switch,
  FormGroup,
} from '@mui/material';
import {
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Plus,
  Trash,
} from '@phosphor-icons/react/dist/ssr';
import dayjs from 'dayjs';

import {
  getSessionRequestsByTutor,
  getPendingSessionRequests,
  getConfirmedSessions,
  getRejectedSessions,
  getCompletedSessions,
  updateSessionStatus,
} from '../../../constants/sessions';
import { SessionStatus, type SessionRequest } from '../../../types/session';

// Types for availability management
interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  day: string;
  isAvailable: boolean;
  allDay: boolean;
  timeSlots: TimeSlot[];
}

interface TutorAvailabilitySettings {
  weeklySchedule: DayAvailability[];
  disabledDates: string[]; // ISO date strings
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps): React.JSX.Element {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`session-tabpanel-${index}`}
      aria-labelledby={`session-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface SessionTableProps {
  sessions: SessionRequest[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onViewSession: (session: SessionRequest) => void;
  onActionClick: (session: SessionRequest, action: 'approve' | 'reject') => void;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  emptyMessage: string;
}

function SessionTable({
  sessions,
  totalCount,
  page,
  rowsPerPage,
  onViewSession,
  onActionClick,
  onPageChange,
  onRowsPerPageChange,
  emptyMessage,
}: SessionTableProps): React.JSX.Element {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Session</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <SessionRow 
                key={session.sessionId} 
                session={session} 
                onViewSession={onViewSession}
                onActionClick={onActionClick}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7}>
                <Alert severity="info" sx={{ m: 2 }}>{emptyMessage}</Alert>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </TableContainer>
  );
}

interface AvailabilityManagementProps {
  tutorId: string;
}

function AvailabilityManagement({ tutorId: _tutorId }: AvailabilityManagementProps): React.JSX.Element {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlotOptions = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  // Initialize default availability
  const [availability, setAvailability] = React.useState<TutorAvailabilitySettings>({
    weeklySchedule: daysOfWeek.map(day => ({
      day,
      isAvailable: false,
      allDay: false,
      timeSlots: []
    })),
    disabledDates: []
  });

  const [newDisabledDate, setNewDisabledDate] = React.useState('');
  const [expandedCard, setExpandedCard] = React.useState(false);
  const [timeSlotDialogOpen, setTimeSlotDialogOpen] = React.useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = React.useState<number | null>(null);

  const handleDayAvailabilityChange = (dayIndex: number, isAvailable: boolean): void => {
    setAvailability(prev => ({
      ...prev,
      weeklySchedule: prev.weeklySchedule.map((day, index) =>
        index === dayIndex ? { ...day, isAvailable, timeSlots: isAvailable ? day.timeSlots : [] } : day
      )
    }));
  };

  const handleAllDayChange = (dayIndex: number, allDay: boolean): void => {
    setAvailability(prev => ({
      ...prev,
      weeklySchedule: prev.weeklySchedule.map((day, index) =>
        index === dayIndex ? { ...day, allDay, timeSlots: allDay ? [] : day.timeSlots } : day
      )
    }));
  };

  const handleTimeSlotChange = (dayIndex: number, timeSlot: string, checked: boolean): void => {
    setAvailability(prev => ({
      ...prev,
      weeklySchedule: prev.weeklySchedule.map((day, index) => {
        if (index === dayIndex) {
          const timeSlots = checked
            ? [...day.timeSlots, { start: timeSlot, end: timeSlot }]
            : day.timeSlots.filter(slot => slot.start !== timeSlot);
          return { ...day, timeSlots };
        }
        return day;
      })
    }));
  };

  const openTimeSlotDialog = (dayIndex: number): void => {
    setSelectedDayIndex(dayIndex);
    setTimeSlotDialogOpen(true);
  };

  const closeTimeSlotDialog = (): void => {
    setTimeSlotDialogOpen(false);
    setSelectedDayIndex(null);
  };

  const handleTimeSlotDialogAllDay = (checked: boolean): void => {
    if (selectedDayIndex !== null) {
      handleAllDayChange(selectedDayIndex, checked);
    }
  };

  const formatTimeSlot = (time: string): string => {
    const hour = parseInt(time.split(':')[0]);
    const nextHour = (hour + 1) % 24;
    
    // Format start time
    const startPeriod = hour >= 12 ? 'PM' : 'AM';
    const startDisplayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    
    // Format end time
    const endPeriod = nextHour >= 12 ? 'PM' : 'AM';
    const endDisplayHour = nextHour === 0 ? 12 : nextHour > 12 ? nextHour - 12 : nextHour;
    
    // If both times are in the same period, show period only once at the end
    if (startPeriod === endPeriod) {
      return `${startDisplayHour}:00 - ${endDisplayHour}:00 ${endPeriod}`;
    }
    return `${startDisplayHour}:00 ${startPeriod} - ${endDisplayHour}:00 ${endPeriod}`;
  };

  const addDisabledDate = (): void => {
    if (newDisabledDate && !availability.disabledDates.includes(newDisabledDate)) {
      setAvailability(prev => ({
        ...prev,
        disabledDates: [...prev.disabledDates, newDisabledDate]
      }));
      setNewDisabledDate('');
    }
  };

  const removeDisabledDate = (dateToRemove: string): void => {
    setAvailability(prev => ({
      ...prev,
      disabledDates: prev.disabledDates.filter(date => date !== dateToRemove)
    }));
  };

  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const saveAvailability = (): void => {
    // In a real app, this would save to the backend
    // For now, just show success state
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000); // Hide after 3 seconds
  };

  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  <Calendar size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                  Availability Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your weekly schedule and disabled dates
                </Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={() => {
                  setExpandedCard(!expandedCard);
                }}
                size="small"
              >
                {expandedCard ? 'Collapse' : 'Expand'}
              </Button>
            </Box>

            {saveSuccess ? (
              <Alert severity="success">
                Availability settings saved successfully!
              </Alert>
            ) : null}

            {expandedCard ? (
              <>
                {/* Weekly Schedule */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Weekly Schedule
                  </Typography>
                  <Grid container spacing={2}>
                    {availability.weeklySchedule.map((daySchedule, index) => (
                      <Grid item xs={12} md={6} lg={4} key={daySchedule.day}>
                        <Card variant="outlined">
                          <CardContent sx={{ p: 2 }}>
                            <Stack spacing={2}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={daySchedule.isAvailable}
                                    onChange={(e) => {
                                      handleDayAvailabilityChange(index, e.target.checked);
                                    }}
                                  />
                                }
                                label={daySchedule.day}
                              />

                              {daySchedule.isAvailable ? (
                                <>

                                  {!daySchedule.allDay && (
                                    <Box>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                          openTimeSlotDialog(index);
                                        }}
                                        startIcon={<Calendar size={16} />}
                                      >
                                        {daySchedule.timeSlots.length > 0 
                                          ? `${daySchedule.timeSlots.length} time slots selected`
                                          : 'Add Available Time Slots'
                                        }
                                      </Button>
                                      
                                      {/* Display selected time slots */}
                                      {daySchedule.timeSlots.length > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                          <Typography variant="caption" color="text.secondary" gutterBottom>
                                            Selected time slots:
                                          </Typography>
                                          <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.2 }}>
                                            {daySchedule.timeSlots.map((timeSlot) => formatTimeSlot(timeSlot.start)).join(', ')}
                                          </Typography>
                                        </Box>
                                      )}
                                    </Box>
                                  )}
                                </>
                              ) : null}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Disabled Dates */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                   Unavailable Dates
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <TextField
                        type="date"
                        value={newDisabledDate}
                        onChange={(e) => {
                          setNewDisabledDate(e.target.value);
                        }}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                      <Button
                        variant="outlined"
                        onClick={addDisabledDate}
                        disabled={!newDisabledDate}
                        startIcon={<Plus size={16} />}
                      >
                        Add
                      </Button>
                    </Box>

                    {availability.disabledDates.length > 0 && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Unavailable Dates:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {availability.disabledDates.map((date) => (
                            <Chip
                              key={date}
                              label={dayjs(date).format('MMM DD, YYYY')}
                              onDelete={() => {
                                removeDisabledDate(date);
                              }}
                              deleteIcon={<Trash size={16} />}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Box>

                {/* Save Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={saveAvailability}
                    color="primary"
                  >
                    Save Availability Settings
                  </Button>
                </Box>
              </>
            ) : null}
          </Stack>
        </CardContent>
      </Card>
      
      {/* Time Slot Selection Dialog */}
      {timeSlotDialogOpen && selectedDayIndex !== null ? (
        <Dialog
          open={timeSlotDialogOpen}
          onClose={closeTimeSlotDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Set Available Time Slots - {availability.weeklySchedule[selectedDayIndex].day}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={availability.weeklySchedule[selectedDayIndex].allDay}
                    onChange={(e) => {
                      handleTimeSlotDialogAllDay(e.target.checked);
                    }}
                  />
                }
                label="Available All Day (24 hours)"
              />

              {!availability.weeklySchedule[selectedDayIndex].allDay ? (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Available Time Slots:
                  </Typography>
                  
                  {/* AM Time Slots */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="primary.main" fontWeight="medium" gutterBottom>
                      Morning (AM)
                    </Typography>
                    <FormGroup>
                      <Grid container spacing={1}>
                        {timeSlotOptions.filter(slot => {
                          const hour = parseInt(slot.split(':')[0]);
                          return hour >= 0 && hour < 12;
                        }).map((timeSlot) => (
                          <Grid item xs={6} sm={4} md={3} key={timeSlot}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={availability.weeklySchedule[selectedDayIndex].timeSlots.some((slot: TimeSlot) => slot.start === timeSlot)}
                                  onChange={(e) => {
                                    handleTimeSlotChange(selectedDayIndex, timeSlot, e.target.checked);
                                  }}
                                />
                              }
                              label={formatTimeSlot(timeSlot)}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </FormGroup>
                  </Box>

                  {/* PM Time Slots */}
                  <Box>
                    <Typography variant="body2" color="primary.main" fontWeight="medium" gutterBottom>
                      Afternoon/Evening (PM)
                    </Typography>
                    <FormGroup>
                      <Grid container spacing={1}>
                        {timeSlotOptions.filter(slot => {
                          const hour = parseInt(slot.split(':')[0]);
                          return hour >= 12;
                        }).map((timeSlot) => (
                          <Grid item xs={6} sm={4} md={3} key={timeSlot}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={availability.weeklySchedule[selectedDayIndex].timeSlots.some((slot: TimeSlot) => slot.start === timeSlot)}
                                  onChange={(e) => {
                                    handleTimeSlotChange(selectedDayIndex, timeSlot, e.target.checked);
                                  }}
                                />
                              }
                              label={formatTimeSlot(timeSlot)}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </FormGroup>
                  </Box>
                </Box>
              ) : null}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeTimeSlotDialog}>Close</Button>
            <Button 
              variant="contained" 
              onClick={() => {
                closeTimeSlotDialog();
                // Could add additional save logic here if needed
              }}
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
}

interface SessionRowProps {
  session: SessionRequest;
  onViewSession: (session: SessionRequest) => void;
  onActionClick: (session: SessionRequest, action: 'approve' | 'reject') => void;
}

function SessionRow({ session, onViewSession, onActionClick }: SessionRowProps): React.JSX.Element {
  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case SessionStatus.Pending:
        return 'warning';
      case SessionStatus.Confirmed:
        return 'success';
      case SessionStatus.Rejected:
        return 'error';
      case SessionStatus.Completed:
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <TableRow hover>
      {/* Student Info */}
      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={session.studentAvatar} sx={{ width: 40, height: 40 }}>
            {session.learnerName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {session.learnerName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {session.studentEmail}
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      {/* Session Name */}
      <TableCell>
        <Typography variant="body2" fontWeight="medium">
          {session.sessionName}
        </Typography>
      </TableCell>

      {/* Date & Time */}
      <TableCell>
        <Stack spacing={0.5}>
          <Typography variant="body2">
            {dayjs(session.sessionDate).format('MMM DD, YYYY')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {session.sessionTime}
          </Typography>
        </Stack>
      </TableCell>

      {/* Duration */}
      <TableCell>
        <Typography variant="body2">
          {session.duration}h
        </Typography>
      </TableCell>

      {/* Cost */}
      <TableCell>
        <Typography variant="body2" fontWeight="medium">
          {session.currency} {session.totalCost.toLocaleString()}
        </Typography>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Chip
          label={session.status}
          color={getStatusColor(session.status)}
          size="small"
          variant="filled"
        />
      </TableCell>

      {/* Actions */}
      <TableCell>
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => {
                onViewSession(session);
              }}
            >
              <Eye size={18} />
            </IconButton>
          </Tooltip>
          
          {session.status === SessionStatus.Pending && (
            <>
              <Tooltip title="Approve">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => {
                    onActionClick(session, 'approve');
                  }}
                >
                  <CheckCircle size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    onActionClick(session, 'reject');
                  }}
                >
                  <XCircle size={18} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}

export default function SessionManagementPage(): React.JSX.Element {
  // Mock current tutor ID - in real app, this would come from authentication
  const currentTutorId = 'TUTOR-001';
  
  const [tabValue, setTabValue] = React.useState(0);
  const [sessions, setSessions] = React.useState<SessionRequest[]>([]);
  const [selectedSession, setSelectedSession] = React.useState<SessionRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [actionDialogOpen, setActionDialogOpen] = React.useState(false);
  const [actionType, setActionType] = React.useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = React.useState('');
  
  // Pagination state
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    // Load sessions for current tutor
    const tutorSessions = getSessionRequestsByTutor(currentTutorId);
    setSessions(tutorSessions);
  }, [currentTutorId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
    setPage(0); // Reset pagination when switching tabs
  };

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewSession = (session: SessionRequest): void => {
    setSelectedSession(session);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = (): void => {
    setViewDialogOpen(false);
    setSelectedSession(null);
  };

  const handleActionClick = (session: SessionRequest, action: 'approve' | 'reject'): void => {
    setSelectedSession(session);
    setActionType(action);
    setActionDialogOpen(true);
    setRejectionReason('');
  };

  const handleCloseActionDialog = (): void => {
    setActionDialogOpen(false);
    setSelectedSession(null);
    setRejectionReason('');
  };

  const handleConfirmAction = (): void => {
    if (!selectedSession) return;

    const newStatus = actionType === 'approve' ? SessionStatus.Confirmed : SessionStatus.Rejected;
    const reason = actionType === 'reject' ? rejectionReason : undefined;

    const success = updateSessionStatus(selectedSession.sessionId, newStatus, reason);
    
    if (success) {
      // Refresh sessions
      const updatedSessions = getSessionRequestsByTutor(currentTutorId);
      setSessions(updatedSessions);
      
      handleCloseActionDialog();
    }
  };

  const getFilteredSessions = (): SessionRequest[] => {
    let filtered = sessions;

    switch (tabValue) {
      case 0: // All
        break;
      case 1: // Pending
        filtered = getPendingSessionRequests(currentTutorId);
        break;
      case 2: // Confirmed
        filtered = getConfirmedSessions(currentTutorId);
        break;
      case 3: // Rejected
        filtered = getRejectedSessions(currentTutorId);
        break;
      case 4: // Completed
        filtered = getCompletedSessions(currentTutorId);
        break;
      default:
        break;
    }

    return filtered;
  };

  const getPaginatedSessions = (allSessions: SessionRequest[]): SessionRequest[] => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return allSessions.slice(startIndex, endIndex);
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case SessionStatus.Pending:
        return 'warning';
      case SessionStatus.Confirmed:
        return 'success';
      case SessionStatus.Rejected:
        return 'error';
      case SessionStatus.Completed:
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredSessions = getFilteredSessions();
  const paginatedSessions = getPaginatedSessions(filteredSessions);
  const pendingCount = getPendingSessionRequests(currentTutorId).length;
  const confirmedCount = getConfirmedSessions(currentTutorId).length;
  const rejectedCount = getRejectedSessions(currentTutorId).length;
  const completedCount = getCompletedSessions(currentTutorId).length;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" gutterBottom>
            Session Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your session requests and bookings
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {pendingCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {confirmedCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Confirmed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main">
                  {rejectedCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rejected
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {completedCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Availability Management */}
        <AvailabilityManagement tutorId={currentTutorId} />

        {/* Tabs and Filters */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: '8px'}}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={`All (${sessions.length})`} />
              <Tab label={`Pending (${pendingCount})`} />
              <Tab label={`Confirmed (${confirmedCount})`} />
              <Tab label={`Rejected (${rejectedCount})`} />
              <Tab label={`Completed (${completedCount})`} />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 0 }}>
            <TabPanel value={tabValue} index={0}>
              {/* All Sessions */}
              <SessionTable
                sessions={paginatedSessions}
                totalCount={filteredSessions.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onViewSession={handleViewSession}
                onActionClick={handleActionClick}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                emptyMessage="No session requests found."
              />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {/* Pending Sessions */}
              <SessionTable
                sessions={paginatedSessions}
                totalCount={filteredSessions.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onViewSession={handleViewSession}
                onActionClick={handleActionClick}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                emptyMessage="No pending session requests."
              />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              {/* Confirmed Sessions */}
              <SessionTable
                sessions={paginatedSessions}
                totalCount={filteredSessions.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onViewSession={handleViewSession}
                onActionClick={handleActionClick}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                emptyMessage="No confirmed sessions."
              />
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              {/* Rejected Sessions */}
              <SessionTable
                sessions={paginatedSessions}
                totalCount={filteredSessions.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onViewSession={handleViewSession}
                onActionClick={handleActionClick}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                emptyMessage="No rejected sessions."
              />
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
              {/* Completed Sessions */}
              <SessionTable
                sessions={paginatedSessions}
                totalCount={filteredSessions.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onViewSession={handleViewSession}
                onActionClick={handleActionClick}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                emptyMessage="No completed sessions."
              />
            </TabPanel>
          </CardContent>
        </Card>

        {/* View Session Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={handleCloseViewDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Session Details</DialogTitle>
          <DialogContent>
            {selectedSession ? (
              <Stack spacing={3} sx={{ mt: 1 }}>
                {/* Student Info */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Student Information
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={selectedSession.studentAvatar} sx={{ width: 60, height: 60 }}>
                      {selectedSession.learnerName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {selectedSession.learnerName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedSession.studentEmail}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                {/* Session Info */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Session Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Session Name:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedSession.sessionName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Date:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {dayjs(selectedSession.sessionDate).format('MMMM DD, YYYY')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Time:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedSession.sessionTime}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Duration:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedSession.duration} hour{selectedSession.duration !== 1 ? 's' : ''}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Cost:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedSession.currency} {selectedSession.totalCost.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Status:
                      </Typography>
                      <Chip
                        label={selectedSession.status}
                        color={getStatusColor(selectedSession.status)}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>

                {selectedSession.requestMessage ? (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Student Message
                      </Typography>
                      <Typography variant="body1">
                        {selectedSession.requestMessage}
                      </Typography>
                    </Box>
                  </>
                ) : null}

                {selectedSession.rejectionReason ? (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Rejection Reason
                      </Typography>
                      <Typography variant="body1">
                        {selectedSession.rejectionReason}
                      </Typography>
                    </Box>
                  </>
                ) : null}
              </Stack>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewDialog}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Action Confirmation Dialog */}
        <Dialog
          open={actionDialogOpen}
          onClose={handleCloseActionDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {actionType === 'approve' ? 'Approve Session' : 'Reject Session'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography>
                Are you sure you want to {actionType} this session request?
              </Typography>
              
              {selectedSession ? (
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2">
                    {selectedSession.sessionName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedSession.learnerName} • {dayjs(selectedSession.sessionDate).format('MMM DD, YYYY')} • {selectedSession.sessionTime}
                  </Typography>
                </Box>
              ) : null}

              {actionType === 'reject' && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Rejection Reason"
                  placeholder="Please provide a reason for rejecting this session..."
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                  }}
                  required
                />
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseActionDialog}>Cancel</Button>
            <Button
              variant="contained"
              color={actionType === 'approve' ? 'success' : 'error'}
              onClick={handleConfirmAction}
              disabled={actionType === 'reject' && !rejectionReason.trim()}
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
}
