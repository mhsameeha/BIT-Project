'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
  Typography,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  FormControl,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  School as SchoolIcon, 
  Event as EventIcon, 
  AttachMoney as MoneyIcon 
} from '@mui/icons-material';
import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Chart } from '@/components/core/chart';
import { getConfirmedSessions, getCompletedSessions } from '@/constants/sessions';
import { SessionRequest } from '@/types/session';
import { getSessionsByTutor } from '@/Services/sessions';
import { getCoursesByTutor, getTutorDashboardData } from '@/Services/tutor';
import { TutorCourse } from '@/types/course';
import { EnrollmentData, getEnrollmentStats, getMyEnrollments } from '@/Services/enrollment';
import { EnrollmentStats } from '@/types/tutor-dashboard-data';
import { TutorProfileData } from '@/types/tutor-profile-data';

// Initialize dayjs plugin
extend(relativeTime);


// Helper function to calculate monthly income



// Mock income data for chart
const getIncomeChartData = (timeRange: number): { months: string[]; sessionData: number[]; courseData: number[] } => {
  const months = [];
  const sessionData = [];
  const courseData = [];
  
  for (let i = timeRange - 1; i >= 0; i--) {
    const month = dayjs().subtract(i, 'month');
    months.push(month.format('MMM YYYY'));
    sessionData.push(Math.floor(Math.random() * 30000) + 15000);
    courseData.push(Math.floor(Math.random() * 50000) + 20000);
  }
  
  return { months, sessionData, courseData };
};

// Mock data for student enrollment over time
const getStudentEnrollmentData = (timeRange: number): { months: string[]; enrollmentData: number[] } => {
  const months = [];
  const enrollmentData = [];
  
  for (let i = timeRange - 1; i >= 0; i--) {
    const month = dayjs().subtract(i, 'month');
    months.push(month.format('MMM YYYY'));
    enrollmentData.push(Math.floor(Math.random() * 25) + 10); // 10-35 students per month
  }
  
  return { months, enrollmentData };
};

// Mock data for total income over time
const getTotalIncomeData = (timeRange: number): { months: string[]; totalIncomeData: number[] } => {
  const months = [];
  const totalIncomeData = [];
  
  for (let i = timeRange - 1; i >= 0; i--) {
    const month = dayjs().subtract(i, 'month');
    months.push(month.format('MMM YYYY'));
    totalIncomeData.push(Math.floor(Math.random() * 100000) + 50000); // 50k-150k LKR per month
  }
  
  return { months, totalIncomeData };
};

// Mock data for sessions count over time
const getSessionsCountData = (timeRange: number): { months: string[]; sessionsData: number[] } => {
  const months = [];
  const sessionsData = [];
  
  for (let i = timeRange - 1; i >= 0; i--) {
    const month = dayjs().subtract(i, 'month');
    months.push(month.format('MMM YYYY'));
    // Use fixed data to ensure it works
    sessionsData.push(Math.floor(Math.random() * 20) + 5); // 5-25 sessions per month
  }
  
  return { months, sessionsData };
};

export default function TutorDashboardPage(): React.JSX.Element {
  const tutorId = 'TUTOR-001'; // This would come from authentication context
  const [timeRange, setTimeRange] = useState<number>(6); // Default to 6 months
  const [sessions, setSessions] = React.useState<SessionRequest[]>([]);
  const [courses,setCourses] = React.useState<TutorCourse[]>([])
  const [enrollments,setEnrollments] = React.useState<EnrollmentStats[]>([])
  const [tutorData,setTutorData] = React.useState<TutorProfileData>();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  

const page = 1;

      React.useEffect(() => {
        const fetchData = async () => {
        try{         
          const tutorSessions = await getSessionsByTutor();
          if ('error' in tutorSessions) {
            // Optionally, handle error UI here
            return;
          }
          setSessions(tutorSessions);
          console.log("sess",tutorSessions)
        
          const tutorEnrollments = await getEnrollmentStats();
      if ('error' in tutorEnrollments) {
            // Optionally, handle error UI here
            return;
          }
          setEnrollments(tutorEnrollments);

          const tutorDashboardData = await getTutorDashboardData();
      if ('error' in tutorDashboardData) {
            // Optionally, handle error UI here
            return;
          }
          setTutorData(tutorDashboardData);
        }
      catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
         fetchData();
     }, []);



const upcomingSession = sessions.filter(session => session.sessionStatus.toLowerCase()=="confirmed");
  const upcomingSessions = upcomingSession.filter(session => 
    dayjs(session.startTime).isAfter(dayjs())
  ).slice(0, 5);

  const completedSession = sessions.filter(session => session.sessionStatus.toLowerCase() == "completed")

  const calculateMonthlyIncome = (): { total: number; sessions: number; courses: number } => {
  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();
  
  // Get completed sessions for current month
  const completedSessions = completedSession.filter(session => 
    dayjs(session.startTime).month() === currentMonth && 
    dayjs(session.startTime).year() === currentYear
  );
  
  const sessionIncome = completedSessions.reduce((total, session) => total + session.cost, 0);
  
  // Mock course enrollments income for the month
const enrollmentsByCourse = enrollments.reduce((acc, enrollment) => {
  const courseId = enrollment.courseId;
  if (!courseId) return acc;

  if (!acc[courseId]) {
    acc[courseId] = {
      courseName: enrollment.courseName,
      coursePrice: enrollment.coursePrice || 0,
      count: 0
    };
  }

  acc[courseId].count += 1;
  return acc;
}, {} as Record<string, { courseName: string; coursePrice: number; count: number }>);

const courseRevenueList = Object.entries(enrollmentsByCourse).map(([courseId, info]) => {
  return {
    courseId,
    courseName: info.courseName,
    enrollmentCount: info.count,
    coursePrice: info.coursePrice,
    revenue: info.count * info.coursePrice
  };
});

const courseIncome = courseRevenueList.reduce((sum, course) => sum + course.revenue, 0);

  
  return {
    total: sessionIncome + courseIncome,
    sessions: sessionIncome,
    courses: courseIncome
  };
};
    const monthlyIncome = calculateMonthlyIncome();
  // Handle time range change
  const handleTimeRangeChange = (event: SelectChangeEvent<number>): void => {
    setTimeRange(event.target.value as number);
  };
  const newlyEnrollments = enrollments.filter(enrollment => dayjs(enrollment.enrolledDate) == dayjs(enrollment.enrolledDate).subtract(7,'day'));
  const totalEnrollments = enrollments.length;

   const enrolledStudents = totalEnrollments;
                      // const completionRate = Math.floor(Math.random() * 40) + 60;
  const monthlyRevenue = tutorData?.monthlyIncome;
  const totalRevenue = tutorData?.totalIncome;
  // Get chart data based on selected time range
  const { months, sessionData, courseData } = getIncomeChartData(timeRange);
  const { months: enrollmentMonths, enrollmentData } = getStudentEnrollmentData(timeRange);
  const { months: incomeMonths, totalIncomeData } = getTotalIncomeData(timeRange);
  const { months: sessionMonths, sessionsData } = getSessionsCountData(timeRange);
  
  const incomeChartOptions = {
    chart: {
      type: 'area' as const,
      toolbar: { show: false },
    },
    colors: ['#2563eb', '#7c3aed'],
    dataLabels: { enabled: false },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    grid: { show: false },
    legend: { position: 'top' as const },
    stroke: { curve: 'smooth' as const, width: 2 },
    xaxis: {
      categories: months,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `LKR ${value.toLocaleString()}`,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `LKR ${value.toLocaleString()}`,
      },
    },
  };

  const incomeChartSeries = [
    {
      name: 'Session Income',
      data: sessionData,
    },
    {
      name: 'Course Income',
      data: courseData,
    },
  ];

  const enrollmentChartOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: { show: false },
    },
    colors: ['#8b5cf6'],
    dataLabels: { enabled: false },
    grid: { show: true, borderColor: '#f1f5f9' },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
      },
    },
    xaxis: {
      categories: sessionMonths,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value} sessions`,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} sessions conducted`,
      },
    },
  };

  const enrollmentChartSeries = [
    {
      name: 'Sessions Conducted',
      data: sessionsData,
    },
  ];

  // New bar chart options for student enrollment over 6 months
  const studentBarChartOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: { show: false },
    },
    colors: ['#3b82f6'],
    dataLabels: { enabled: false },
    grid: { show: true, borderColor: '#f1f5f9' },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
      },
    },
    xaxis: {
      categories: enrollmentMonths,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value} students`,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} students enrolled`,
      },
    },
  };

  const studentBarChartSeries = [
    {
      name: 'Students Enrolled',
      data: enrollmentData,
    },
  ];

  // New bar chart options for total income over 6 months
  const incomeBarChartOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: { show: false },
    },
    colors: ['#10b981'],
    dataLabels: { enabled: false },
    grid: { show: true, borderColor: '#f1f5f9' },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
      },
    },
    xaxis: {
      categories: incomeMonths,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `LKR ${value.toLocaleString()}`,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `LKR ${value.toLocaleString()}`,
      },
    },
  };

  const incomeBarChartSeries = [
    {
      name: 'Total Income',
      data: totalIncomeData,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Tutor Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
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
                  <SchoolIcon />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    New Students
                  </Typography>
                  <Typography variant="h4">
                    {newlyEnrollments.length}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    This week
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

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
                  <MoneyIcon />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    Monthly Income
                  </Typography>
                  <Typography variant="h4">
                    LKR {monthlyIncome.total.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

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
                  <EventIcon />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    Session Income
                  </Typography>
                  <Typography variant="h4">
                    LKR {monthlyIncome.sessions.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This month
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    backgroundColor: 'info.main',
                    borderRadius: 1,
                    p: 1,
                    color: 'white',
                  }}
                >
                  <TrendingUpIcon />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    Course Income
                  </Typography>
                  <Typography variant="h4">
                    LKR {monthlyIncome.courses.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This month
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Time Range Selector */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Analytics Overview
        </Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        

        {/* Newly Enrolled Students */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Newly Enrolled Students" 
              subheader={`${newlyEnrollments.length} new students this week`}
            />
            <CardContent>
              <Stack spacing={2}>
                {newlyEnrollments.map((student) => (
                  <Stack
                    key={student.enrollmentId}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Avatar src={student.learnerProfPic} alt={student.learnerName} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">
                        {student.learnerName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.courseName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Enrolled {dayjs(student.enrolledDate).fromNow()}
                      </Typography>
                    </Box>
                    <Chip
                      label="New"
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Sessions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Upcoming Sessions" 
              subheader={`${upcomingSessions.length} sessions scheduled`}
            />
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Session</TableCell>
                      <TableCell>Date & Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {upcomingSessions.map((session) => (
                      <TableRow key={session.sessionId}>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar 
                              src={session.learnerProfPic} 
                              alt={session.learnerName}
                              sx={{ width: 32, height: 32 }}
                            />
                            <Typography variant="body2">
                              {session.learnerName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap>
                            {session.sessionName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {dayjs(session.startTime).format('MMM DD')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dayjs(session.startTime).format('HH:mm a')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {upcomingSessions.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No upcoming sessions scheduled
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Course Performance */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Course Performance" />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course Name</TableCell>
                      <TableCell>Enrolled Students</TableCell>
                      <TableCell>Completion Rate</TableCell>
                      <TableCell align="right">Monthly Revenue</TableCell>
                      <TableCell align="right">Total Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      
                      {/* {courseRevenueList.map((course) => {
                        return (
                        <TableRow key={course.courseId}>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {course.courseTitle}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {course.category}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {enrolledStudents} students
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={completionRate}
                                sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                {completionRate}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              LKR {monthlyRevenue.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              LKR {totalRevenue.toLocaleString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        );
                    })} */}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}