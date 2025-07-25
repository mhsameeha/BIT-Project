'use client'
import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { config } from '@/config';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
const AuthClient = authClient.getBasicUserInfo()


// export const metadata = { title: `Learner | Dashboard | ${config.site.name}` } satisfies Metadata;


// Types
interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  thumbnail: string;
  duration: string;
  lastAccessed: string;
}

interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'late' | 'graded';
  grade?: number;
}

interface Statistic {
  label: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
}

// Helper functions
function getOngoingCourses(): Course[] {
  return [
    {
      id: '1',
      title: 'Introduction to React',
      instructor: 'Jane Smith',
      progress: 65,
      thumbnail: '/assets/course-react.jpg',
      duration: '8 weeks',
      lastAccessed: '2 days ago',
    },
    {
      id: '2',
      title: 'Advanced JavaScript',
      instructor: 'John Doe',
      progress: 30,
      thumbnail: '/assets/course-js.jpg',
      duration: '10 weeks',
      lastAccessed: '1 week ago',
    },
  ];
}

function getPendingAssignments(): Assignment[] {
  return [
    {
      id: '1',
      courseId: '1',
      courseTitle: 'Introduction to React',
      title: 'Build a Todo App',
      dueDate: '2023-12-15',
      status: 'pending',
    },
    {
      id: '2',
      courseId: '2',
      courseTitle: 'Advanced JavaScript',
      title: 'Async/Await Exercises',
      dueDate: '2023-12-20',
      status: 'pending',
    },
  ];
}

function getStatistics(): Statistic[] {
  return [
    {
      label: 'Courses in Progress',
      value: '3',
      change: 10,
      changeType: 'increase',
    },
    {
      label: 'Assignments Due',
      value: '2',
      change: 5,
      changeType: 'increase',
    },
    {
      label: 'Hours Learned',
      value: '24',
      change: 2,
      changeType: 'decrease',
    },
  ];
}
const learnerName = AuthClient?.name;
// Components
function WelcomeHere() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Welcome back, {learnerName}!</Typography>
      <Typography color="text.secondary" variant="body1">
        Continue your learning journey. You have 2 ongoing courses and 2 pending assignments.
      </Typography>
      <div>
        <Button endIcon={<ArrowRightIcon />} variant="contained">
          Explore Courses
        </Button>
      </div>
    </Stack>
  );
}

function OngoingCourses() {
  const courses = getOngoingCourses();
  const router = useRouter();

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6">Ongoing Courses</Typography>
          
          {courses.map((course) => (
            <Stack key={course.id} spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography variant="subtitle1">{course.title}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Instructor: {course.instructor}
                  </Typography>
                </div>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => {
                    router.push(`/courses/${course.id}`);
                  
                  }}
                >
                  View Course
                </Button>
              </Stack>
              
              <Stack spacing={1}>
                <Typography variant="body2">
                  Progress: {course.progress}%
                </Typography>
                <LinearProgress variant="determinate" value={course.progress} />
              </Stack>
              
              <Typography color="text.secondary" variant="caption">
                Last accessed: {course.lastAccessed} • Duration: {course.duration}
              </Typography>
            </Stack>
          ))}

          <Button fullWidth variant="outlined" onClick={() => router.push('/courses/list')}>
            Explore More Courses
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function AssignmentCard() {
  const assignments = getPendingAssignments();

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6">Pending Assignments</Typography>
          
          {assignments.map((assignment) => (
            <Stack key={assignment.id} spacing={1}>
              <Typography variant="subtitle1">{assignment.title}</Typography>
              <Typography color="text.secondary" variant="body2">
                Course: {assignment.courseTitle}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={`Due: ${assignment.dueDate}`} size="small" />
                <Chip 
                  label={assignment.status} 
                  size="small" 
                  color={assignment.status === 'pending' ? 'warning' : 'primary'}
                />
              </Stack>
            </Stack>
          ))}

          <Button fullWidth variant="outlined">
            View All Assignments
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function Statistics() {
  const stats = getStatistics();

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6">Your Statistics</Typography>
          
          <Stack direction="row" spacing={2} justifyContent="space-between">
            {stats.map((stat) => (
              <Stack key={stat.label} spacing={1} alignItems="center">
                <Typography color="text.secondary" variant="body2">
                  {stat.label}
                </Typography>
                <Typography variant="h5">{stat.value}</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {stat.changeType === 'increase' ? (
                    <TrendingUpIcon color="success" fontSize="small" />
                  ) : (
                    <TrendingDownIcon color="error" fontSize="small" />
                  )}
                  <Typography 
                    variant="caption" 
                    color={stat.changeType === 'increase' ? 'success.main' : 'error.main'}
                  >
                    {stat.change}%
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Main Page Component
export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid lg={12} sm={12} xs={12}>
        <WelcomeHere />
      </Grid>
      <Grid lg={6} sm={6} xs={12}>
        <OngoingCourses />
      </Grid>
      <Grid lg={6} sm={6} xs={12}>
        <AssignmentCard />
      </Grid>
      <Grid lg={6} sm={6} xs={12}>
        <Statistics />
      </Grid>
    </Grid>
  );
}