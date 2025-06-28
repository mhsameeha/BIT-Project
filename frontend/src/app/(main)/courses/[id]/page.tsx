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

// Types
interface Lesson {
  id: number;
  title: string;
  duration: string;
}

interface CurriculumSection {
  id: number;
  title: string;
  duration: string;
  lessons: Lesson[];
}

interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: Date;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  tutorName: string;
  tutorAvatar: string;
  logo: string;
  enrolledStudents: number;
  rating: number;
  reviewCount: number;
  fee: number;
  currency: string;
  curriculum: CurriculumSection[];
  reviews: Review[];
}

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


// Mock course data - in a real app, this would come from an API
const getCourseData = (id: string): CourseData | null => {
  const courses = {
    'INTEG-001': {
      id: 'INTEG-001',
      title: 'Introduction to Programming',
      description: 'Learn the basics of programming using Python. Ideal for complete beginners.',
      level: 'Beginner',
      category: 'Programming',
      tutorName: 'Dr. Sarah Johnson',
      tutorAvatar: '/assets/avatar-1.png',
      logo: '/assets/logo-python.png',
      enrolledStudents: 594,
      rating: 4.5,
      reviewCount: 127,
      fee: 99.99,
      currency: 'USD',
      curriculum: [
        {
          id: 1,
          title: 'Getting Started with Python',
          duration: '45 min',
          lessons: [
            { id: 1, title: 'What is Programming?', duration: '8 min' },
            { id: 2, title: 'Installing Python', duration: '12 min' },
            { id: 3, title: 'Your First Python Program', duration: '15 min' },
            { id: 4, title: 'Understanding Variables', duration: '10 min' }
          ]
        },
        {
          id: 2,
          title: 'Basic Programming Concepts',
          duration: '1hr 20min',
          lessons: [
            { id: 5, title: 'Data Types in Python', duration: '20 min' },
            { id: 6, title: 'Working with Strings', duration: '25 min' },
            { id: 7, title: 'Numbers and Math Operations', duration: '18 min' },
            { id: 8, title: 'Boolean Logic', duration: '17 min' }
          ]
        },
        {
          id: 3,
          title: 'Control Structures',
          duration: '1hr 35min',
          lessons: [
            { id: 9, title: 'If Statements', duration: '22 min' },
            { id: 10, title: 'Loops - For and While', duration: '28 min' },
            { id: 11, title: 'Nested Loops', duration: '20 min' },
            { id: 12, title: 'Break and Continue', duration: '15 min' },
            { id: 13, title: 'Practice Exercises', duration: '10 min' }
          ]
        }
      ],
      reviews: [
        {
          id: 1,
          userName: 'John Smith',
          userAvatar: '/assets/avatar-2.png',
          rating: 5,
          comment: 'Excellent course for beginners! Dr. Johnson explains everything clearly and the hands-on exercises really help solidify the concepts.',
          date: dayjs().subtract(2, 'day').toDate()
        },
        {
          id: 2,
          userName: 'Emily Chen',
          userAvatar: '/assets/avatar-3.png',
          rating: 4,
          comment: 'Great introduction to programming. The pace is perfect for someone with no prior experience. Would recommend!',
          date: dayjs().subtract(1, 'week').toDate()
        },
        {
          id: 3,
          userName: 'Michael Davis',
          userAvatar: '/assets/avatar-4.png',
          rating: 5,
          comment: 'This course gave me the confidence to start my programming journey. The projects are practical and engaging.',
          date: dayjs().subtract(2, 'week').toDate()
        },
        {
          id: 4,
          userName: 'Sarah Wilson',
          userAvatar: '/assets/avatar-5.png',
          rating: 4,
          comment: 'Very well structured course. The instructor is knowledgeable and responsive to questions.',
          date: dayjs().subtract(3, 'week').toDate()
        }
      ]
    },
    'INTEG-002': {
      id: 'INTEG-002',
      title: 'Software Testing & Quality Assurance',
      description: 'Understand the fundamentals of software testing including test cases, manual & automated testing tools.',
      level: 'Beginner–Intermediate',
      category: 'Programming',
      tutorName: 'Mark Thompson',
      tutorAvatar: '/assets/avatar-6.png',
      logo: '/assets/qa.png',
      enrolledStudents: 594,
      rating: 4.3,
      reviewCount: 89,
      fee: 129.99,
      currency: 'USD',
      curriculum: [
        {
          id: 1,
          title: 'Introduction to Software Testing',
          duration: '1hr 10min',
          lessons: [
            { id: 1, title: 'What is Software Testing?', duration: '15 min' },
            { id: 2, title: 'Types of Testing', duration: '20 min' },
            { id: 3, title: 'Testing Life Cycle', duration: '25 min' },
            { id: 4, title: 'Quality Assurance vs Testing', duration: '10 min' }
          ]
        },
        {
          id: 2,
          title: 'Manual Testing Fundamentals',
          duration: '2hr 15min',
          lessons: [
            { id: 5, title: 'Writing Test Cases', duration: '30 min' },
            { id: 6, title: 'Test Execution', duration: '25 min' },
            { id: 7, title: 'Bug Reporting', duration: '40 min' },
            { id: 8, title: 'Test Documentation', duration: '40 min' }
          ]
        }
      ],
      reviews: [
        {
          id: 1,
          userName: 'Alex Johnson',
          userAvatar: '/assets/avatar-7.png',
          rating: 4,
          comment: 'Good coverage of testing fundamentals. The practical examples are very helpful.',
          date: dayjs().subtract(3, 'day').toDate()
        },
        {
          id: 2,
          userName: 'Lisa Rodriguez',
          userAvatar: '/assets/avatar-8.png',
          rating: 5,
          comment: 'Mark is an excellent instructor. This course prepared me well for my QA role.',
          date: dayjs().subtract(1, 'week').toDate()
        }
      ]
    }
  };

  return courses[id as keyof typeof courses] || null;
};

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
                  ${course.fee}
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
