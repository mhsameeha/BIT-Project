'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import type { SxProps, Theme } from '@mui/material/styles';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import dayjs from 'dayjs';
import { getCourseData } from '@/constants/courses';

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
        ...(sx as object)
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}

export default function CourseDetailPage(): React.JSX.Element {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [expandedSection, setExpandedSection] = React.useState<number | false>(false);

  const course = getCourseData(courseId);

  const handleBackToCourses = (): void => {
    router.push('/courses/list');
  };

  const handleSectionChange = (sectionId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? sectionId : false);
  };

  if (!course) {
    return (
      <Container maxWidth="lg">
        <Stack spacing={3} sx={{ py: 4 }}>
          <Box>
            <Button
              startIcon={<ArrowLeftIcon />}
              onClick={handleBackToCourses}
              variant="text"
              sx={{ mb: 2 }}
            >
              Back to Courses
            </Button>
          </Box>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Course Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The course you&apos;re looking for doesn&apos;t exist or has been removed.
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
          <Button
            startIcon={<ArrowLeftIcon />}
            onClick={handleBackToCourses}
            variant="text"
            sx={{ mb: 2 }}
          >
            Back to Courses
          </Button>
        </Box>

        {/* Course Header Section */}
        <MainCard 

>
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
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
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
                  LKR {course.fee}
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
        <MainCard >
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
                        '&:hover': { backgroundColor: 'action.hover' }
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
        <MainCard >
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Student Reviews
          </Typography>
          
          <Stack spacing={3}>
            {course.reviews.map((review) => (
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
            ))}
          </Stack>
        </MainCard>
      </Stack>
    </Container>
  );
}
