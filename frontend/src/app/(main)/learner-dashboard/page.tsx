'use client'
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { EnrollmentData, getEnrollmentsByLearner } from '@/Services/enrollment';
import dayjs from 'dayjs';

export default function LearnerDashboard(): React.JSX.Element {
  const router = useRouter();
  const learnerName = authClient.getBasicUserInfo()?.name;
  const [courses, setCourses] = React.useState<EnrollmentData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const course = await getEnrollmentsByLearner();
        if ('error' in course) {
          console.error('Error fetching enrollments');
          return;
        }
        setCourses(course);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const ongoingCourses = courses.filter(course => 
    course.enrollmentStatus.toLowerCase() === "active" && 
    (course.enrollmentStatus === undefined || course.enrollmentStatus.toLowerCase() !== "completed")
  );

  const completedCourses = courses.filter(course => 
    course.enrollmentStatus.toLowerCase() === "active" && 
    course.enrollmentStatus?.toLowerCase() === "completed"
  );

  // Helper data
  const pendingAssignments = [
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

  const statistics = [
    {
      label: 'Ongoing Courses',
      value: ongoingCourses.length.toString(),
      change: ongoingCourses.length > 0 ? 10 : 0,
      changeType: ongoingCourses.length > 0 ? 'increase' : 'decrease',
    },
    {
      label: 'Completed Courses',
      value: completedCourses.length.toString(),
      change: completedCourses.length > 0 ? 15 : 0,
      changeType: completedCourses.length > 0 ? 'increase' : 'decrease',
    },
    {
      label: 'Assignments Due',
      value: pendingAssignments.length.toString(),
      change: pendingAssignments.length > 0 ? 5 : 0,
      changeType: pendingAssignments.length > 0 ? 'increase' : 'decrease',
    },
  ];

  return (
    <Grid container spacing={3}>
      {/* Welcome Section */}
      <Grid lg={12} sm={12} xs={12}>
        <Stack spacing={2}>
          <Typography variant="h4">Welcome back, {learnerName}!</Typography>
          <Typography color="text.secondary" variant="body1">
            You have {ongoingCourses.length} ongoing courses, {completedCourses.length} completed courses, 
            and {pendingAssignments.length} pending assignments.
          </Typography>
          <div>
            <Button endIcon={<ArrowRightIcon />} variant="contained">
              Explore Courses
            </Button>
          </div>
        </Stack>
        
      </Grid>


      {/* Ongoing Courses */}
      <Grid lg={6} sm={6} xs={12}>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h6">Ongoing Courses</Typography>
              
              {isLoading ? (
                <Typography>Loading courses...</Typography>
              ) : ongoingCourses.length > 0 ? (
                ongoingCourses.map((course) => (
                  <Stack key={course.enrollmentId} spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <div>
                        <Typography variant="subtitle1">{course.courseName}</Typography>
                        {course.progress && (
                          <Stack spacing={1} sx={{ mt: 1 }}>
                            <Typography variant="body2">
                              Progress: {course.progress}%
                            </Typography>
                            <LinearProgress variant="determinate" value={course.progress} />
                          </Stack>
                        )}
                      </div>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => router.push(`/courses/${course.courseId}`)}
                      >
                        Continue
                      </Button>
                    </Stack>
                    <Typography color="text.secondary" variant="caption">
                      Enrolled On: {dayjs(course.enrolledDate).format('DD MM YYYY')}
                    </Typography>
                  </Stack>
                ))
              ) : (
                <Typography>No ongoing courses found</Typography>
              )}

              <Button fullWidth variant="outlined" onClick={() => router.push('/courses/list')}>
                Explore More Courses
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Completed Courses */}
      <Grid lg={6} sm={6} xs={12}>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircleIcon color="success" size={24} />
                <Typography variant="h6">Completed Courses</Typography>
              </Stack>
              
              {isLoading ? (
                <Typography>Loading courses...</Typography>
              ) : completedCourses.length > 0 ? (
                completedCourses.map((course) => (
                  <Stack key={course.enrollmentId} spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <div>
                        <Typography variant="subtitle1">{course.courseName}</Typography>
                        {course.completionDate && (
                          <Typography color="text.secondary" variant="body2">
                            Completed on: {course.completionDate}
                          </Typography>
                        )}
                      </div>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => router.push(`/courses/${course.courseId}`)}
                      >
                        View Course
                      </Button>
                    </Stack>
                    {course.progress && (
                      <LinearProgress variant="determinate" value={100} color="success" />
                    )}
                  </Stack>
                ))
              ) : (
                <Typography>No completed courses yet</Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Pending Assignments */}
      <Grid lg={6} sm={6} xs={12}>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h6">Pending Assignments</Typography>
              
              {pendingAssignments.map((assignment) => (
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
      </Grid>

      {/* Statistics */}
      <Grid lg={6} sm={6} xs={12}>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h6">Your Learning Statistics</Typography>
              
              <Stack direction="row" spacing={2} justifyContent="space-between" flexWrap="wrap">
                {statistics.map((stat) => (
                  <Card key={stat.label} sx={{ minWidth: 120, p: 2, mb: 2 }}>
                    <Stack spacing={1} alignItems="center">
                      <Typography color="text.secondary" variant="body2" align="center">
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
                  </Card>
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}