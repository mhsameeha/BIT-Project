'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Link,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { styled } from '@mui/material/styles';
import { ArrowLeft, Calendar, Clock, CreditCard, User, GraduationCap, Briefcase, Receipt, Upload } from '@phosphor-icons/react/dist/ssr';
import dayjs, { type Dayjs } from 'dayjs';

import { getTutorById, getTutorAvailability, type TutorDetailData, type TutorAvailabilityResponse, type TutorEducation, type TutorExperience } from '../../../../../Services/tutor';
import { bookSession, type SessionBookingRequest } from '../../../../../Services/session-booking';
import { paths } from '../../../../../paths';

interface SessionBooking {
  date: Dayjs | null;
  selectedTimeSlots: string[];
  duration: number; // in hours
  totalCost: number;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

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
  // If timeSlot already contains a range (e.g., "9:00 AM - 10:00 AM"), return as-is
  if (timeSlot.includes(' - ')) {
    return timeSlot;
  }
  
  // Otherwise, generate the range from start time
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

// Helper function to calculate end time for multiple slots
const calculateEndTime = (sortedTimeSlots: string[]): string => {
  if (sortedTimeSlots.length === 0) return '00:00';
  
  const lastSlot = sortedTimeSlots[sortedTimeSlots.length - 1];
  const lastTime24 = convertTo24Hour(lastSlot);
  const [hours] = lastTime24.split(':');
  const endHour = parseInt(hours, 10) + 1;
  
  return `${endHour.toString().padStart(2, '0')}:00`;
};

// Helper function to parse education data
const parseEducation = (education: string | TutorEducation[]): TutorEducation[] => {
  if (Array.isArray(education)) {
    return education;
  }
  
  try {
    const parsed: unknown = JSON.parse(education);
    if (Array.isArray(parsed)) {
      return parsed.map((item: unknown) => {
        if (typeof item === 'object' && item !== null) {
          const edu = item as Record<string, unknown>;
          return {
            degree: typeof edu.Qualification === 'string' ? edu.Qualification : '',
            institution: typeof edu.Institute === 'string' ? edu.Institute : '',
            year: typeof edu.GraduationDate === 'string' ? edu.GraduationDate : '',
          };
        }
        return { degree: String(item), institution: '', year: '' };
      });
    }
    return [];
  } catch {
    // If it's just a string, return a simple format
    return [{ degree: education, institution: '', year: '' }];
  }
};

// Helper function to parse experience data
const parseExperience = (experience: string | TutorExperience[]): TutorExperience[] => {
  if (Array.isArray(experience)) {
    return experience;
  }
  
  try {
    const parsed: unknown = JSON.parse(experience);
    if (Array.isArray(parsed)) {
      return parsed.map((item: unknown) => {
        if (typeof item === 'object' && item !== null) {
          const exp = item as Record<string, unknown>;
          return {
            position: typeof exp.Position === 'string' ? exp.Position : '',
            company: typeof exp.Company === 'string' ? exp.Company : '',
            duration: typeof exp.TimePeriod === 'string' ? exp.TimePeriod : '',
            description: typeof exp.description === 'string' ? exp.description : '',
          };
        }
        return { position: String(item), company: '', duration: '', description: '' };
      });
    }
    return [];
  } catch {
    // If it's just a string, return a simple format
    return [{ position: experience, company: '', duration: '', description: '' }];
  }
};

export default function SessionBookingPage(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const tutorId = params.tutorId as string;

  const [tutor, setTutor] = React.useState<TutorDetailData | null>(null);
  const [tutorAvailability, setTutorAvailability] = React.useState<TutorAvailabilityResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [booking, setBooking] = React.useState<SessionBooking>({
    date: null,
    selectedTimeSlots: [],
    duration: 0,
    totalCost: 0,
  });

  // Payment modal state
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const [transactionRef, setTransactionRef] = React.useState('');
  const [receiptFile, setReceiptFile] = React.useState<File | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = React.useState(false);
  const [paymentSuccess, setPaymentSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTutorData = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch tutor details
        const tutorResult = await getTutorById(tutorId);
        if ('error' in tutorResult) {
          setError(tutorResult.error);
          return;
        }
        setTutor(tutorResult);

        // Fetch tutor availability
        const availabilityResult = await getTutorAvailability(tutorId);
        if ('error' in availabilityResult) {
          setError(availabilityResult.error);
          return;
        }
        setTutorAvailability(availabilityResult);

      } catch (err) {
        setError('Failed to load tutor data');
      } finally {
        setLoading(false);
      }
    };

    void fetchTutorData();
  }, [tutorId]);

  React.useEffect(() => {
    if (tutor && booking.selectedTimeSlots.length > 0) {
      const duration = booking.selectedTimeSlots.length;
      const totalCost = (tutor.tutorRate || 0) * duration;

      setBooking((prev) => ({
        ...prev,
        duration,
        totalCost,
      }));
    } else {
      setBooking((prev) => ({
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
    setBooking((prev) => ({
      ...prev,
      date: newDate,
      selectedTimeSlots: [], // Reset time slots when date changes
    }));
    
    // Optionally refresh availability when date changes to get the most up-to-date slots
    if (newDate) {
      void refreshTutorAvailability();
    }
  };

  const refreshTutorAvailability = async (): Promise<void> => {
    try {
      const availabilityResult = await getTutorAvailability(tutorId);
      if (!('error' in availabilityResult)) {
        setTutorAvailability(availabilityResult);
      }
    } catch (err) {
      // Silently handle error - availability refresh is not critical
    }
  };

  const handleTimeSlotToggle = (timeSlot: string): void => {
    setBooking((prev) => {
      const currentSlots = prev.selectedTimeSlots;
      const isSelected = currentSlots.includes(timeSlot);

      let newSlots: string[];
      if (isSelected) {
        // Remove the slot (allow deselection)
        newSlots = [];
      } else {
        // Replace with the new slot (only one slot allowed)
        newSlots = [timeSlot];
      }

      return {
        ...prev,
        selectedTimeSlots: newSlots,
      };
    });
  };

  const getAvailableTimeSlots = (): string[] => {
    if (!booking.date || !tutorAvailability) return [];

    // Find availability for the specific selected date
    const selectedDateStr = booking.date.format('YYYY-MM-DD');
    const dateAvailability = tutorAvailability.dateAvailability?.find(
      (avail) => avail.date.split('T')[0] === selectedDateStr
    );

    if (dateAvailability) {
      // Return time slots sorted chronologically
      return dateAvailability.timeSlots.sort((a, b) => 
        convertTo24Hour(a).localeCompare(convertTo24Hour(b))
      );
    }

    return [];
  };

  console.log(tutor?.experience, "tutor experience");

  const shouldDisableDate = (date: Dayjs): boolean => {
    const today = dayjs();

    // Disable past dates
    if (date.isBefore(today, 'day')) return true;

    // Disable dates more than 30 days in the future
    if (date.isAfter(today.add(30, 'day'))) return true;

    // Disable dates when tutor is not available or has no time slots
    if (!tutorAvailability?.dateAvailability) return true;
    
    const selectedDateStr = date.format('YYYY-MM-DD');
    const hasAvailableSlots = tutorAvailability.dateAvailability.some(
      (avail) => avail.date.split('T')[0] === selectedDateStr && avail.timeSlots.length > 0
    );
    
    return !hasAvailableSlots;
  };

  const canProceedToPayment = (): boolean => {
    return Boolean(booking.date && booking.selectedTimeSlots.length > 0 && booking.totalCost > 0);
  };

  const handleProceedToPayment = (): void => {
    if (!canProceedToPayment()) return;
    setPaymentModalOpen(true);
  };

  const handleClosePaymentModal = (): void => {
    setPaymentModalOpen(false);
    setTransactionRef('');
    setReceiptFile(null);
    setUploadError(null);
    setPaymentSuccess(null);
    setIsSubmittingPayment(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (allow images and PDFs)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Please upload a valid image (JPEG, PNG) or PDF file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB');
        return;
      }
      
      setReceiptFile(file);
      setUploadError(null);
    }
  };

  const handleConfirmPayment = async (): Promise<void> => {
    if (!receiptFile) {
      setUploadError('Please upload a payment receipt');
      return;
    }

    if (!tutor) {
      setUploadError('Tutor information is not available');
      return;
    }

    if (!booking.date || booking.selectedTimeSlots.length === 0) {
      setUploadError('Please select a date and time slot');
      return;
    }

    setIsSubmittingPayment(true);
    setUploadError(null);

    try {
      // Calculate start and end times for the single selected time slot
      const selectedTimeSlot = booking.selectedTimeSlots[0];

      const startTime = convertTo24Hour(selectedTimeSlot);
      const endTime = calculateEndTime([selectedTimeSlot]);



      
      // Create start and end datetime strings in local timezone format
      const startDateTime = booking.date.hour(parseInt(startTime.split(':')[0])).minute(parseInt(startTime.split(':')[1])).second(0).format('YYYY-MM-DDTHH:mm:ss');
      const endDateTime = booking.date.hour(parseInt(endTime.split(':')[0])).minute(parseInt(endTime.split(':')[1])).second(0).format('YYYY-MM-DDTHH:mm:ss');
      

      const sessionName = `Session with ${tutor.tutorName}`;
      
      const sessionBookingRequest: SessionBookingRequest = {
        tutorId: tutor.tutorId,
        startTime: startDateTime,
        endTime: endDateTime,
        sessionName,
        sessionFee: booking.totalCost,
        currency: 'LKR',
        transactionReference: transactionRef || undefined,
        paymentProof: receiptFile,
        requestMessage: `Session booking for ${getTimeSlotRange(selectedTimeSlot)} on ${booking.date.format('MMMM DD, YYYY')}`
      };

      const result = await bookSession(sessionBookingRequest);
      
      if ('error' in result) {
        setUploadError(result.error);
        return;
      }
      
      const timeRange = getSelectedTimeRange();
      setPaymentSuccess(`Session booking confirmed! You have successfully booked a session with ${tutor.tutorName} on ${booking.date?.format('MMMM DD, YYYY')} at ${timeRange}. Your booking ID is ${result.sessionId.substring(0, 8)}.`);
      
      // Refresh tutor availability to remove the booked slot
      const refreshedAvailability = await getTutorAvailability(tutorId);
      if (!('error' in refreshedAvailability)) {
        setTutorAvailability(refreshedAvailability);
      }
      
      // Reset booking state
      setBooking(prev => ({
        ...prev,
        selectedTimeSlots: [],
        duration: 0,
        totalCost: 0,
      }));
      
      // Close modal after showing success message
      setTimeout(() => {
        handleClosePaymentModal();
        // Optionally navigate to a success page or dashboard
      }, 4000);
    } catch (paymentError) {
      setUploadError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const getSelectedTimeRange = (): string => {
    if (booking.selectedTimeSlots.length === 0) return 'Not selected';
    if (booking.selectedTimeSlots.length === 1) {
      return getTimeSlotRange(booking.selectedTimeSlots[0]);
    }

    // For multiple slots, show them as individual ranges
    const sortedSlots = booking.selectedTimeSlots.sort((a, b) => convertTo24Hour(a).localeCompare(convertTo24Hour(b)));

    return sortedSlots.map((slot) => getTimeSlotRange(slot)).join(', ');
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">{error}</Alert>
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

  if (!tutor) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">Tutor not found. Please go back and select a valid tutor.</Alert>
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
                <Avatar sx={{ width: 80, height: 80 }}>
                  {tutor.firstName?.[0]}{tutor.lastName?.[0]}
                </Avatar>
                <Stack spacing={1} flex={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h5" component="span">
                      {tutor.tutorName}
                    </Typography>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={handleTutorProfileClick}
                      sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        fontSize: '0.875rem',
                        fontWeight: 'medium',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      (View Profile)
                    </Link>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {tutor.tutorDescription}
                  </Typography>
                  
                  {/* Experience Section */}
                  <Box sx={{ mt: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
                      <Briefcase size={14} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                        Experience
                      </Typography>
                    </Stack>
                    {parseExperience(tutor.experience).slice(0, 2).map((exp, index) => (
                      <Typography key={`exp-${exp.position || exp.company || index}`} variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', ml: 2.5 }}>
                        {exp.position && exp.company ? `${exp.position} at ${exp.company}` : exp.position || exp.company || 'Professional Experience'}
                        {exp.duration ? ` (${exp.duration})` : ''}
                      </Typography>
                    ))}
                  </Box>

                  {/* Education Section */}
                  <Box sx={{ mt: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
                      <GraduationCap size={14} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                        Education
                      </Typography>
                    </Stack>
                    {parseEducation(tutor.education).slice(0, 2).map((edu, index) => (
                      <Typography key={`edu-${edu.degree || edu.institution || index}`} variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', ml: 2.5 }}>
                        {edu.degree && edu.institution ? `${edu.degree} - ${edu.institution}` : edu.degree || edu.institution || 'Qualified Education'}
                        {edu.year ? ` (${edu.year})` : ''}
                      </Typography>
                    ))}
                  </Box>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Specialist in: {tutor.specialities.slice(0, 3).join(', ')}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack alignItems="flex-end" spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Hourly Rate
                  </Typography>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                   LKR {tutor.tutorRate.toLocaleString()}
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
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        * Bookings can only be made for the next 30 days
                      </Typography>
                    </Grid>

                    {/* Time Slots */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>
                        Available Time Slots
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Select one time slot for your session
                      </Typography>
                      {booking.date ? (
                        <Stack spacing={1}>
                          {availableTimeSlots.length > 0 ? (
                            availableTimeSlots.map((timeSlot) => {
                              const isSelected = booking.selectedTimeSlots.includes(timeSlot);
                              const hasOtherSelection = booking.selectedTimeSlots.length > 0 && !isSelected;

                              return (
                                <Button
                                  key={timeSlot}
                                  variant={isSelected ? 'contained' : 'outlined'}
                                  disabled={hasOtherSelection}
                                  onClick={() => {
                                    handleTimeSlotToggle(timeSlot);
                                  }}
                                  startIcon={<Clock />}
                                  sx={{
                                    justifyContent: 'flex-start',
                                    opacity: hasOtherSelection ? 0.5 : 1,
                                  }}
                                >
                                  {getTimeSlotRange(timeSlot)}
                                </Button>
                              );
                            })
                          ) : (
                            <Alert severity="info">
                              No available time slots for {booking.date.format('MMMM DD, YYYY')}. All slots may be booked or the tutor is not available on this day.
                            </Alert>
                          )}
                        </Stack>
                      ) : (
                        <Alert severity="info">Please select a date to see available time slots</Alert>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Booking Summary */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader avatar={<User />} title="Booking Summary" subheader="Review your session details" />
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
                        <Typography variant="body1">{getSelectedTimeRange()}</Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Duration:
                        </Typography>
                        <Typography variant="body1">
                          {booking.duration > 0
                            ? `${booking.duration} hour${booking.duration !== 1 ? 's' : ''}`
                            : 'Not selected'}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider />

                    {/* Cost Breakdown */}
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">Cost Breakdown:</Typography>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Hourly Rate:</Typography>
                        <Typography variant="body2">
                         {tutor.tutorRate.toLocaleString()}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Duration:</Typography>
                        <Typography variant="body2">
                          {booking.duration} hour{booking.duration !== 1 ? 's' : ''}
                        </Typography>
                      </Stack>

                      <Divider />

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6" color="primary">
                          LKR {booking.totalCost.toLocaleString()}
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

        {/* Payment Modal */}
        <Dialog
          open={paymentModalOpen}
          onClose={handleClosePaymentModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Receipt size={24} />
              <Typography variant="h6">Payment for Session with {tutor?.tutorName}</Typography>
            </Stack>
          </DialogTitle>
          
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 1 }}>
              {paymentSuccess ? (
                <Paper elevation={2} sx={{ p: 3, backgroundColor: 'success.light', color: 'success.contrastText' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Payment Submitted Successfully!
                  </Typography>
                  <Typography variant="body2">
                    {paymentSuccess}
                  </Typography>
                </Paper>
              ) : (
                <>
                  {/* Session Details */}
                  <Paper elevation={2} sx={{ p: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Session Details
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Date:</strong> {booking.date ? booking.date.format('MMMM DD, YYYY (dddd)') : 'Not selected'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Time:</strong> {getSelectedTimeRange()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Duration:</strong> {booking.duration} hour{booking.duration !== 1 ? 's' : ''}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mt: 2 }}>
                      Total: LKR {booking.totalCost.toLocaleString()}
                    </Typography>
                  </Paper>

                  {/* Bank Details */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Bank Transfer Details
                    </Typography>
                    <Paper elevation={1} sx={{ p: 2, backgroundColor: 'grey.50' }}>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, width: '100px' }}>Bank:</Typography>
                          <Typography variant="body2">Commercial Bank Pvt Ltd</Typography>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, width: '100px' }}>Branch:</Typography>
                          <Typography variant="body2">Maradana Branch</Typography>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, width: '100px' }}>A/C No:</Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>8420325645</Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>

                  {/* Upload Receipt */}
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                      Upload Payment Receipt *
                    </Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<Upload />}
                      sx={{ mb: 1, width: '100%', height: '56px' }}
                      disabled={isSubmittingPayment}
                    >
                      {receiptFile ? receiptFile.name : 'Choose File'}
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                      />
                    </Button>
                    {uploadError ? (
                      <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        {uploadError}
                      </Typography>
                    ) : null}
                    <Typography variant="caption" color="text.secondary">
                      Supported formats: JPEG, PNG, PDF (Max 5MB)
                    </Typography>
                  </Box>

                  {/* Transaction Reference */}
                  <TextField
                    label="Transaction Reference No (Optional)"
                    placeholder="Enter transaction reference number"
                    value={transactionRef}
                    onChange={(e) => {
                      setTransactionRef(e.target.value);
                    }}
                    fullWidth
                    variant="outlined"
                    disabled={isSubmittingPayment}
                  />

                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    After making the payment, please upload your receipt and click &quot;Confirm Payment&quot;. 
                    Your session booking will be processed once payment is verified.
                  </Typography>
                </>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={handleClosePaymentModal} 
              color="inherit"
              disabled={isSubmittingPayment}
            >
              {paymentSuccess ? 'Close' : 'Cancel'}
            </Button>
            {!paymentSuccess && (
              <Button 
                variant="contained" 
                onClick={handleConfirmPayment}
                disabled={!receiptFile || isSubmittingPayment}
                sx={{ minWidth: '140px' }}
              >
                {isSubmittingPayment ? 'Processing...' : 'Confirm Payment'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
}
