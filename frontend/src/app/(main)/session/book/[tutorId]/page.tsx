'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Rating,
  Stack,
  Typography,
  Avatar,
  Alert,
  Skeleton,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { type Dayjs } from 'dayjs';
import { ArrowLeft, Clock, User, Calendar, CreditCard } from '@phosphor-icons/react/dist/ssr';

import { TUTORS_DATA, type TutorData } from '../../../../../constants/tutors';
import { paths } from '../../../../../paths';

interface SessionBooking {
  date: Dayjs | null;
  selectedTimeSlots: string[];
  duration: number; // in hours
  totalCost: number;
}

// Helper function to convert time string to 24-hour format for comparison
const convertTo24Hour = (timeStr: string): string => {
  const [time, period] = timeStr.split(' ');
  const [hours] = time.split(':');
  let hour24 = parseInt(hours, 10);
  
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  
  return `${hour24.toString().padStart(2, '0')}:00`;
};

// Helper function to get time slot range display
const getTimeSlotRange = (timeSlot: string): string => {
  const time24 = convertTo24Hour(timeSlot);
  const [hours] = time24.split(':');
  const startHour = parseInt(hours, 10);
  const endHour = startHour + 1;
  
  const formatHour = (hour: number): string => {
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
  };
  
  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
};



export default function SessionBookingPage(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const tutorId = params.tutorId as string;

  const [tutor, setTutor] = React.useState<TutorData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [booking, setBooking] = React.useState<SessionBooking>({
    date: null,
    selectedTimeSlots: [],
    duration: 0,
    totalCost: 0,
  });

  // Mock booked sessions - in real app, this would come from API
  const [bookedSessions] = React.useState<{ date: string; timeSlot: string }[]>([
    { date: '2024-01-15', timeSlot: '10:00 AM' },
    { date: '2024-01-17', timeSlot: '02:00 PM' },
    { date: '2024-01-19', timeSlot: '09:00 AM' },
  ]);

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const tutorData = TUTORS_DATA[tutorId];
      setTutor(tutorData || null);
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [tutorId]);

  React.useEffect(() => {
    if (tutor && booking.selectedTimeSlots.length > 0) {
      const duration = booking.selectedTimeSlots.length;
      const totalCost = tutor.hourlyRate * duration;
      
      setBooking(prev => ({
        ...prev,
        duration,
        totalCost,
      }));
    } else {
      setBooking(prev => ({
        ...prev,
        duration: 0,
        totalCost: 0,
      }));
    }
  }, [tutor, booking.selectedTimeSlots]);

  const handleTutorProfileClick = (): void => {
    router.push(paths.main.tutorProfile(tutorId));
  };

  const handleDateChange = (newDate: Dayjs | null): void => {
    setBooking(prev => ({
      ...prev,
      date: newDate,
      selectedTimeSlots: [], // Reset time slots when date changes
    }));
  };

  const handleTimeSlotToggle = (timeSlot: string): void => {
    setBooking(prev => {
      const currentSlots = prev.selectedTimeSlots;
      const isSelected = currentSlots.includes(timeSlot);
      
      let newSlots: string[];
      if (isSelected) {
        // Remove the slot
        newSlots = currentSlots.filter(slot => slot !== timeSlot);
      } else {
        // Add the slot
        newSlots = [...currentSlots, timeSlot];
      }
      
      return {
        ...prev,
        selectedTimeSlots: newSlots,
      };
    });
  };

  const getAvailableTimeSlots = (): string[] => {
    if (!booking.date || !tutor) return [];

    const selectedDay = booking.date.format('dddd');
    const availability = tutor.availability.find(avail => avail.day === selectedDay);
    
    if (!availability) return [];

    const selectedDateStr = booking.date.format('YYYY-MM-DD');
    const bookedSlotsForDate = bookedSessions
      .filter(session => session.date === selectedDateStr)
      .map(session => session.timeSlot);

    return availability.timeSlots.filter(slot => !bookedSlotsForDate.includes(slot));
  };

  const shouldDisableDate = (date: Dayjs): boolean => {
    const today = dayjs();
    const dayName = date.format('dddd');
    
    // Disable past dates
    if (date.isBefore(today, 'day')) return true;
    
    // Disable dates more than 30 days in the future
    if (date.isAfter(today.add(30, 'day'))) return true;
    
    // Disable days when tutor is not available
    if (!tutor) return true;
    return !tutor.availability.some(avail => avail.day === dayName);
  };

  const canProceedToPayment = (): boolean => {
    return Boolean(booking.date && booking.selectedTimeSlots.length > 0 && booking.totalCost > 0);
  };

  const handleProceedToPayment = (): void => {
    if (!canProceedToPayment()) return;
    
    const timeRange = getSelectedTimeRange();
    
    // In real app, this would navigate to payment page with booking details
    // eslint-disable-next-line no-alert -- This is a demo placeholder for payment flow
    alert(`Proceeding to payment for session with ${tutor?.name} on ${booking.date?.format('MMMM DD, YYYY')} at ${timeRange} for ${booking.duration} hour(s). Total: ${tutor?.currency} ${booking.totalCost.toLocaleString()}`);
  };

  const getSelectedTimeRange = (): string => {
    if (booking.selectedTimeSlots.length === 0) return 'Not selected';
    if (booking.selectedTimeSlots.length === 1) {
      return getTimeSlotRange(booking.selectedTimeSlots[0]);
    }
    
    // For multiple slots, show them as individual ranges
    const sortedSlots = booking.selectedTimeSlots
      .sort((a, b) => convertTo24Hour(a).localeCompare(convertTo24Hour(b)));
    
    return sortedSlots
      .map(slot => getTimeSlotRange(slot))
      .join(', ');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={60} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rectangular" height={400} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={400} />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    );
  }

  if (!tutor) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">
          Tutor not found. Please go back and select a valid tutor.
        </Alert>
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => {
            router.push(paths.main.session);
          }}
          sx={{ mt: 2 }}
        >
          Back to Tutors
        </Button>
      </Container>
    );
  }

  const availableTimeSlots = getAvailableTimeSlots();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              startIcon={<ArrowLeft />}
              onClick={() => {
                router.push(paths.main.session);
              }}
              variant="text"
            >
              Back to Tutors
            </Button>
            <Typography variant="h4" component="h1">
              Book a Session
            </Typography>
          </Stack>

          {/* Tutor Info Card */}
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={tutor.avatar}
                  sx={{ width: 80, height: 80 }}
                />
                <Stack spacing={1} flex={1}>
                  <Link
                    component="button"
                    variant="h5"
                    onClick={handleTutorProfileClick}
                    sx={{
                      textAlign: 'left',
                      textDecoration: 'none',
                      color: 'primary.main',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {tutor.name}
                  </Link>
                  <Typography variant="body2" color="text.secondary">
                    {tutor.title}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Rating value={tutor.rating} readOnly size="small" />
                    <Typography variant="body2">
                      {tutor.rating} ({tutor.reviewCount} reviews)
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    {tutor.specialties.slice(0, 3).map((specialty) => (
                      <Chip key={specialty} label={specialty} size="small" />
                    ))}
                  </Stack>
                </Stack>
                <Stack alignItems="flex-end" spacing={1}>
                  <Chip
                    icon={<CreditCard />}
                    label={`${tutor.currency} ${tutor.hourlyRate.toLocaleString()}/hour`}
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {tutor.sessionsCompleted} sessions completed
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {/* Calendar and Time Selection */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader
                  avatar={<Calendar />}
                  title="Select Date & Time"
                  subheader="Choose your preferred session date and time slots"
                />
                <CardContent>
                  <Grid container spacing={3}>
                    {/* Calendar */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>
                        Select Date
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 1 }}>
                        <DateCalendar
                          value={booking.date}
                          onChange={handleDateChange}
                          shouldDisableDate={shouldDisableDate}
                        />
                      </Paper>
                    </Grid>

                    {/* Time Slots */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>
                        Available Time Slots
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Select any available time slots for your session
                      </Typography>
                      {booking.date ? (
                        <Stack spacing={1}>
                          {availableTimeSlots.length > 0 ? (
                            availableTimeSlots.map((timeSlot) => {
                              const isSelected = booking.selectedTimeSlots.includes(timeSlot);
                              
                              return (
                                <Button
                                  key={timeSlot}
                                  variant={isSelected ? 'contained' : 'outlined'}
                                  onClick={() => {
                                    handleTimeSlotToggle(timeSlot);
                                  }}
                                  startIcon={<Clock />}
                                  sx={{ 
                                    justifyContent: 'flex-start'
                                  }}
                                >
                                  {getTimeSlotRange(timeSlot)}
                                </Button>
                              );
                            })
                          ) : (
                            <Alert severity="info">
                              No available time slots for {booking.date.format('MMMM DD, YYYY')}
                            </Alert>
                          )}
                        </Stack>
                      ) : (
                        <Alert severity="info">
                          Please select a date to see available time slots
                        </Alert>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Booking Summary */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader
                  avatar={<User />}
                  title="Booking Summary"
                  subheader="Review your session details"
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Divider />

                    {/* Booking Details */}
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">Session Details:</Typography>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Date:
                        </Typography>
                        <Typography variant="body1">
                          {booking.date ? booking.date.format('MMMM DD, YYYY (dddd)') : 'Not selected'}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Time:
                        </Typography>
                        <Typography variant="body1">
                          {getSelectedTimeRange()}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Duration:
                        </Typography>
                        <Typography variant="body1">
                          {booking.duration > 0 ? `${booking.duration} hour${booking.duration !== 1 ? 's' : ''}` : 'Not selected'}
                        </Typography>
                      </Box>

                      
                    </Stack>

                    <Divider />

                    {/* Cost Breakdown */}
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">Cost Breakdown:</Typography>
                      
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          Hourly Rate:
                        </Typography>
                        <Typography variant="body2">
                          {tutor.currency} {tutor.hourlyRate.toLocaleString()}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          Duration:
                        </Typography>
                        <Typography variant="body2">
                          {booking.duration} hour{booking.duration !== 1 ? 's' : ''}
                        </Typography>
                      </Stack>

                      <Divider />

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h6">
                          Total:
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {tutor.currency} {booking.totalCost.toLocaleString()}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={!canProceedToPayment()}
                      onClick={handleProceedToPayment}
                      startIcon={<CreditCard />}
                    >
                      Proceed to Payment
                    </Button>

                    {!canProceedToPayment() && (
                      <Typography variant="caption" color="text.secondary" align="center">
                        Please select date and time slots to continue
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </LocalizationProvider>
  );
}
