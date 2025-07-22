'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { CourseData } from '@/constants/courses';
import { getCourseDetails } from '@/Services/courses';
import { submitPayment, type PaymentRequest } from '@/Services/enrollment';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { Receipt as ReceiptIcon } from '@phosphor-icons/react/dist/ssr/Receipt';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

// Types for styled components
interface StyledCardProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

function MainCard({ children, sx = {}, ...props }: StyledCardProps): React.JSX.Element {
  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        borderRadius: 3,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
        boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
        ...(sx as object),
      }}
      {...props}
    >
      {children}
    </Paper>
  );
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

export default function CourseDetailPage(): React.JSX.Element {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [expandedSection, setExpandedSection] = React.useState<number | false>(false);
  const [course, setCourse] = React.useState<CourseData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Payment modal state
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const [transactionRef, setTransactionRef] = React.useState('');
  const [receiptFile, setReceiptFile] = React.useState<File | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = React.useState(false);
  const [paymentSuccess, setPaymentSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCourseData = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      
      try {

        // If not found in static data, try API
        const apiResult = await getCourseDetails(courseId);
        if ('error' in apiResult) {
          setError(apiResult.error);
        } else {
          // Transform API data to match expected CourseData structure
          const transformedCourse: CourseData = {
            id: apiResult.courseId,
            title: apiResult.title,
            description: apiResult.description,
            level: apiResult.courseDifficultyName ?? '',
            category: apiResult.categoryName ?? '',
            tutorName: `${apiResult.tutorFirstName ?? 'Unknown'} ${apiResult.tutorLastName ?? 'Tutor'}`,
            tutorAvatar: '/assets/avatar-1.png',
            tutorFk: apiResult.tutorFk ?? '',// You might want to handle profile pics differently
            logo: '/assets/logo-python.png', // You might want to convert the courseImage
            enrolledStudents: apiResult.enrolledStudents,
            rating: apiResult.averageRating,
            reviewCount: apiResult.reviewCount,
            fee: apiResult.price,
            currency: apiResult.currency,
            updatedAt: new Date(apiResult.updatedDate),
            curriculum: apiResult.courseContent?.map((content, index) => ({
              id: index + 1,
              title: content.contentTitle,
              duration: content.contentDuration,
              lessons: content.subContent?.map((sub, subIndex) => ({
                id: subIndex + 1,
                title: sub.subContentTitle,
                duration: '10 min' // SubContent doesn't have duration in the API
              })) || []
            })) || [],
            reviews: apiResult.reviews?.map(review => ({
              id: parseInt(review.courseReviewId.split('-')[0], 16), // Convert GUID to number for compatibility
              userName: `${review.learnerFirstName} ${review.learnerLastName}`,
              userAvatar: '/assets/avatar-1.png',
              rating: review.rating,
              comment: review.review,
              date: new Date(review.reviewDate || apiResult.createdDate)
            })) || []
          };
          setCourse(transformedCourse);
        }
      } catch (err) {
        setError('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    void fetchCourseData();
  }, [courseId]);

  const handleBackToCourses = (): void => {
    router.push('/courses/list');
  };

  const handleSectionChange = (sectionId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? sectionId : false);
  };

  const handleEnrollNow = (): void => {
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

    if (!course) {
      setUploadError('Course information is not available');
      return;
    }

    setIsSubmittingPayment(true);
    setUploadError(null);

    try {
      const paymentRequest: PaymentRequest = {
        courseId,
        amount: course.fee,
        currency: course.currency || 'LKR',
        transactionReference: transactionRef || undefined,
        paymentProof: receiptFile,
        tutorFk: course.tutorFk
      };

      const result = await submitPayment(paymentRequest);

      if ('error' in result) {
        setUploadError(result.error);
      } else {
        // Success
        setPaymentSuccess(result.message);
        // Close modal after a short delay to show success message
        setTimeout(() => {
          handleClosePaymentModal();
          // You might want to redirect to a success page or show a toast
          router.push('/courses/list?payment=success');
        }, 2000);
      }
    } catch (paymentError) {
      setUploadError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Stack spacing={3} sx={{ py: 4 }}>
          <Box>
            <Button startIcon={<ArrowLeftIcon />} onClick={handleBackToCourses} variant="text" sx={{ mb: 2 }}>
              Back to Courses
            </Button>
          </Box>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Loading Course...
            </Typography>
          </Box>
        </Stack>
      </Container>
    );
  }

  if (error || !course) {
    return (
      <Container maxWidth="lg">
        <Stack spacing={3} sx={{ py: 4 }}>
          <Box>
            <Button startIcon={<ArrowLeftIcon />} onClick={handleBackToCourses} variant="text" sx={{ mb: 2 }}>
              Back to Courses
            </Button>
          </Box>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Course Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {error || "The course you're looking for doesn't exist or has been removed."}
            </Typography>
          </Box>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Stack spacing={4} sx={{ py: 4 }}>
        {/* Back Button */}
        <Box>
          <Button startIcon={<ArrowLeftIcon />} onClick={handleBackToCourses} variant="text" sx={{ mb: 2 }}>
            Back to Courses
          </Button>
        </Box>

        {/* Course Header Section */}
        <MainCard>
          <Stack spacing={3}>
            {/* Course Title and Basic Info */}
            <Box>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                {course.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                {course.description}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Chip label={`Level: ${course.level}`} variant="outlined" />
                <Chip label={course.category} color="primary" />
              </Stack>
            </Box>

            {/* Tutor and Fee Info */}
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={3}
              sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}
            >
              {/* Tutor Info */}
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar src={course.tutorAvatar} alt={course.tutorName} sx={{ width: 56, height: 56 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Instructor
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {course.tutorName}
                  </Typography>
                </Box>
              </Stack>

              {/* Course Fee */}
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="body2" color="text.secondary">
                  Course Fee
                </Typography>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                  LKR {course.fee.toLocaleString()}
                </Typography>
              </Box>
            </Stack>

            {/* Course Stats */}
            <Stack direction="row" spacing={4} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={4} sx={{ alignItems: 'center' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Rating value={course.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {course.rating} ({course.reviewCount} reviews)
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {course.enrolledStudents.toLocaleString()} students enrolled
                </Typography>
              </Stack>

              {/* Enroll Button */}
              <Button
                variant="contained"
                size="large"
                onClick={handleEnrollNow}
                sx={{
                  minWidth: '150px',
                }}
              >
                Enroll Now
              </Button>
            </Stack>
          </Stack>
        </MainCard>

        {/* Curriculum Section */}
        <MainCard>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Course Curriculum
          </Typography>

          {course.curriculum.map((section) => (
            <Accordion
              key={section.id}
              expanded={expandedSection === section.id}
              onChange={handleSectionChange(section.id)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary
                expandIcon={<CaretDownIcon />}
                sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center' } }}
              >
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', width: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, flexGrow: 1 }}>
                    Section {section.id}: {section.title}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <ClockIcon size={16} />
                    <Typography variant="body2" color="text.secondary">
                      {section.duration}
                    </Typography>
                  </Stack>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  {section.lessons.map((lesson) => (
                    <Stack
                      key={lesson.id}
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: 'center',
                        p: 1.5,
                        borderRadius: 1,
                        backgroundColor: 'background.default',
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: '24px' }}>
                        {lesson.id}.
                      </Typography>
                      <Typography variant="body1" sx={{ flexGrow: 1 }}>
                        {lesson.title}
                      </Typography>
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                        <ClockIcon size={14} />
                        <Typography variant="body2" color="text.secondary">
                          {lesson.duration}
                        </Typography>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </MainCard>

        {/* Reviews Section */}
        <MainCard>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Student Reviews
          </Typography>

          <Stack spacing={3}>
            {course.reviews && course.reviews.length > 0 ? (
              course.reviews.map((review) => (
                <Paper key={review.id} elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                  <Stack spacing={2}>
                    {/* Review Header */}
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                      <Avatar src={review.userAvatar} alt={review.userName} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {review.userName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {dayjs(review.date).format('MMMM D, YYYY')}
                        </Typography>
                      </Box>
                      <Rating value={review.rating} readOnly size="small" />
                    </Stack>

                    <Divider />

                    {/* Review Content */}
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {review.comment}
                    </Typography>
                  </Stack>
                </Paper>
              ))
            ) : (
              <Paper elevation={1} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  No reviews yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Be the first to share your experience with this course!
                </Typography>
              </Paper>
            )}
          </Stack>
        </MainCard>
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
            <ReceiptIcon size={24} />
            <Typography variant="h6">Payment for {course?.title}</Typography>
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
                {/* Course Fee */}
                <Paper elevation={2} sx={{ p: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Course Fee
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    LKR {course?.fee?.toLocaleString()}
                  </Typography>
                </Paper>

                {/* Bank Details */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Bank Transfer Details
                  </Typography>
                  <Paper elevation={1} sx={{ p: 2, backgroundColor: 'grey.50' }}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 , width: '100px'}}>Bank:</Typography>
                        <Typography variant="body2">Commercial Bank Pvt Ltd</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 , width: '100px'}}>Branch:</Typography>
                        <Typography variant="body2">Maradana Branch</Typography>
                      </Box>
                      <Box sx={{ display: 'flex',  }}>
                        <Typography variant="body2" sx={{ fontWeight: 500,  width: '100px'}}>A/C No:</Typography>
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
                    startIcon={<UploadIcon />}
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
                  Your enrollment will be processed once payment is verified.
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
  );
}
