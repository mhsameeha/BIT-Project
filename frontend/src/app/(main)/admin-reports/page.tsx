'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  type SelectChangeEvent,
} from '@mui/material';
import {
  Download as DownloadIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';

// Types for admin report data
type AdminReportType = 'active-users' | 'popular-courses' | 'overall-revenue';
type ExportFormat = 'pdf' | 'excel';

interface ActiveUsersData {
  month: string;
  totalStudents: number;
  totalTutors: number;
  totalUsers: number;
}

interface PopularCoursesData {
  month: string;
  courses: {
    courseId: string;
    courseName: string;
    enrollments: number;
    revenue: number;
  }[];
}

interface OverallRevenueData {
  month: string;
  sessionRevenue: number;
  courseRevenue: number;
  totalRevenue: number;
  userGrowth: number;
}

// Mock course data
const MOCK_COURSES = [
  { id: '1', title: 'Python Programming Fundamentals', fee: 15000 },
  { id: '2', title: 'Advanced Python & Data Science', fee: 25000 },
  { id: '3', title: 'Web Development with Python', fee: 20000 },
  { id: '4', title: 'Machine Learning Basics', fee: 30000 },
  { id: '5', title: 'Database Management', fee: 18000 },
  { id: '6', title: 'JavaScript Fundamentals', fee: 12000 },
  { id: '7', title: 'React Development', fee: 22000 },
  { id: '8', title: 'Node.js Backend Development', fee: 24000 },
];

// Mock data generators
const generateActiveUsersData = (startDate: string, endDate: string): ActiveUsersData[] => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const data = [];

  let current = start.startOf('month');
  let baseStudents = 150;
  let baseTutors = 25;

  while (current.isBefore(end) || current.isSame(end, 'month')) {
    const monthStr = current.format('MMM YYYY');
    
    // Simulate growth over time
    const studentGrowth = Math.floor(Math.random() * 30) + 10;
    const tutorGrowth = Math.floor(Math.random() * 8) + 2;
    
    baseStudents += studentGrowth;
    baseTutors += tutorGrowth;

    data.push({
      month: monthStr,
      totalStudents: baseStudents,
      totalTutors: baseTutors,
      totalUsers: baseStudents + baseTutors,
    });
    current = current.add(1, 'month');
  }

  return data;
};

const generatePopularCoursesData = (startDate: string, endDate: string): PopularCoursesData[] => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const data = [];

  let current = start.startOf('month');
  while (current.isBefore(end) || current.isSame(end, 'month')) {
    const monthStr = current.format('MMM YYYY');

    // Generate course data for each month
    const courses = MOCK_COURSES.map(course => {
      const enrollments = Math.floor(Math.random() * 50) + 10;
      return {
        courseId: course.id,
        courseName: course.title,
        enrollments,
        revenue: enrollments * course.fee,
      };
    }).sort((a, b) => b.enrollments - a.enrollments);

    data.push({
      month: monthStr,
      courses: courses.slice(0, 5), // Top 5 courses
    });
    current = current.add(1, 'month');
  }

  return data;
};

const generateOverallRevenueData = (startDate: string, endDate: string): OverallRevenueData[] => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const data = [];

  let current = start.startOf('month');
  while (current.isBefore(end) || current.isSame(end, 'month')) {
    const monthStr = current.format('MMM YYYY');
    
    const sessionRevenue = Math.floor(Math.random() * 200000) + 100000;
    const courseRevenue = Math.floor(Math.random() * 500000) + 300000;
    const userGrowth = Math.floor(Math.random() * 15) + 5;

    data.push({
      month: monthStr,
      sessionRevenue,
      courseRevenue,
      totalRevenue: sessionRevenue + courseRevenue,
      userGrowth,
    });
    current = current.add(1, 'month');
  }

  return data;
};

// Helper function to generate CSV content for Excel
const generateCSV = (data: ActiveUsersData[] | PopularCoursesData[] | OverallRevenueData[], reportType: AdminReportType): string => {
  if (reportType === 'active-users') {
    const usersData = data as ActiveUsersData[];
    const headers = ['Month', 'Total Students', 'Total Tutors', 'Total Users'];
    const rows = usersData.map(item => [
      item.month,
      item.totalStudents.toString(),
      item.totalTutors.toString(),
      item.totalUsers.toString()
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
  
  if (reportType === 'popular-courses') {
    const coursesData = data as PopularCoursesData[];
    const headers = ['Month', 'Top Course', 'Enrollments', 'Revenue (LKR)'];
    const rows = coursesData.map(item => {
      const topCourse = item.courses[0];
      return [
        item.month,
        topCourse.courseName,
        topCourse.enrollments.toString(),
        topCourse.revenue.toString()
      ];
    });
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
  
  const revenueData = data as OverallRevenueData[];
  const headers = ['Month', 'Session Revenue (LKR)', 'Course Revenue (LKR)', 'Total Revenue (LKR)', 'User Growth (%)'];
  const rows = revenueData.map(item => [
    item.month,
    item.sessionRevenue.toString(),
    item.courseRevenue.toString(),
    item.totalRevenue.toString(),
    item.userGrowth.toString()
  ]);
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

// Helper function to download file
const downloadFile = (content: string, filename: string, format: ExportFormat): void => {
  if (format === 'excel') {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  // PDF download is handled in generatePDF function
};

// Proper PDF generation using jsPDF
const generatePDF = (data: ActiveUsersData[] | PopularCoursesData[] | OverallRevenueData[], reportType: AdminReportType, startDate: string, endDate: string): void => {
  // eslint-disable-next-line new-cap -- jsPDF constructor uses lowercase
  const doc = new jsPDF();
  
  // Set up the document
  doc.setFontSize(20);
  const reportTitles = {
    'active-users': 'Active Users Report',
    'popular-courses': 'Popular Courses Report',
    'overall-revenue': 'Overall Revenue Report'
  };
  doc.text(reportTitles[reportType], 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Period: ${dayjs(startDate).format('MMM YYYY')} to ${dayjs(endDate).format('MMM YYYY')}`, 20, 45);
  doc.text(`Generated on: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`, 20, 55);
  
  let yPosition = 75;
  
  if (reportType === 'active-users') {
    const usersData = data as ActiveUsersData[];
    
    // Add summary
    const latestData = usersData[usersData.length - 1];
    const firstData = usersData[0];
    const studentGrowth = latestData.totalStudents - firstData.totalStudents;
    const tutorGrowth = latestData.totalTutors - firstData.totalTutors;
    
    doc.setFontSize(14);
    doc.text('Summary:', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.text(`Current Active Students: ${latestData.totalStudents.toLocaleString()}`, 25, yPosition);
    yPosition += 10;
    doc.text(`Current Active Tutors: ${latestData.totalTutors.toLocaleString()}`, 25, yPosition);
    yPosition += 10;
    doc.text(`Total Active Users: ${latestData.totalUsers.toLocaleString()}`, 25, yPosition);
    yPosition += 10;
    doc.text(`Student Growth: +${studentGrowth}`, 25, yPosition);
    yPosition += 10;
    doc.text(`Tutor Growth: +${tutorGrowth}`, 25, yPosition);
    yPosition += 20;
    
    // Add table header
    doc.setFontSize(14);
    doc.text('Monthly Breakdown:', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.text('Month', 20, yPosition);
    doc.text('Students', 60, yPosition);
    doc.text('Tutors', 100, yPosition);
    doc.text('Total Users', 140, yPosition);
    yPosition += 5;
    
    // Add separator line
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    // Add data rows
    usersData.forEach((item) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(item.month, 20, yPosition);
      doc.text(item.totalStudents.toString(), 60, yPosition);
      doc.text(item.totalTutors.toString(), 100, yPosition);
      doc.text(item.totalUsers.toString(), 140, yPosition);
      yPosition += 12;
    });
    
  } else if (reportType === 'popular-courses') {
    const coursesData = data as PopularCoursesData[];
    
    doc.setFontSize(14);
    doc.text('Top Performing Courses by Month:', 20, yPosition);
    yPosition += 20;
    
    coursesData.forEach((monthData) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.text(`${monthData.month}:`, 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      monthData.courses.slice(0, 3).forEach((course, index) => {
        doc.text(`${index + 1}. ${course.courseName}`, 25, yPosition);
        doc.text(`Enrollments: ${course.enrollments}`, 25, yPosition + 8);
        doc.text(`Revenue: LKR ${course.revenue.toLocaleString()}`, 25, yPosition + 16);
        yPosition += 25;
      });
      yPosition += 10;
    });
    
  } else {
    const revenueData = data as OverallRevenueData[];
    
    // Add summary
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalSessionRevenue = revenueData.reduce((sum, item) => sum + item.sessionRevenue, 0);
    const totalCourseRevenue = revenueData.reduce((sum, item) => sum + item.courseRevenue, 0);
    const avgGrowth = revenueData.reduce((sum, item) => sum + item.userGrowth, 0) / revenueData.length;
    
    doc.setFontSize(14);
    doc.text('Summary:', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.text(`Total Revenue: LKR ${totalRevenue.toLocaleString()}`, 25, yPosition);
    yPosition += 10;
    doc.text(`Session Revenue: LKR ${totalSessionRevenue.toLocaleString()}`, 25, yPosition);
    yPosition += 10;
    doc.text(`Course Revenue: LKR ${totalCourseRevenue.toLocaleString()}`, 25, yPosition);
    yPosition += 10;
    doc.text(`Average User Growth: ${avgGrowth.toFixed(1)}%`, 25, yPosition);
    yPosition += 20;
    
    // Add table header
    doc.setFontSize(14);
    doc.text('Monthly Breakdown:', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.text('Month', 20, yPosition);
    doc.text('Session Rev.', 50, yPosition);
    doc.text('Course Rev.', 90, yPosition);
    doc.text('Total Rev.', 130, yPosition);
    doc.text('Growth %', 170, yPosition);
    yPosition += 5;
    
    // Add separator line
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    // Add data rows
    revenueData.forEach((item) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(item.month, 20, yPosition);
      doc.text(`${(item.sessionRevenue / 1000).toFixed(0)}K`, 50, yPosition);
      doc.text(`${(item.courseRevenue / 1000).toFixed(0)}K`, 90, yPosition);
      doc.text(`${(item.totalRevenue / 1000).toFixed(0)}K`, 130, yPosition);
      doc.text(`${item.userGrowth}%`, 170, yPosition);
      yPosition += 12;
    });
  }
  
  // Download the PDF
  const filename = `admin_${reportType}_report_${dayjs().format('YYYY-MM-DD')}.pdf`;
  doc.save(filename);
};

export default function AdminReportsPage(): React.JSX.Element {
  const [reportType, setReportType] = useState<AdminReportType>('active-users');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('excel');
  const [startDate, setStartDate] = useState<string>(dayjs().subtract(6, 'month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleReportTypeChange = (event: SelectChangeEvent<AdminReportType>): void => {
    setReportType(event.target.value as AdminReportType);
  };

  const handleFormatChange = (event: SelectChangeEvent<ExportFormat>): void => {
    setExportFormat(event.target.value as ExportFormat);
  };

  const handleGenerateAndDownload = async (): Promise<void> => {
    setIsGenerating(true);

    // Simulate processing delay
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });

    try {
      // Generate data based on report type
      let data;
      if (reportType === 'active-users') {
        data = generateActiveUsersData(startDate, endDate);
      } else if (reportType === 'popular-courses') {
        data = generatePopularCoursesData(startDate, endDate);
      } else {
        data = generateOverallRevenueData(startDate, endDate);
      }

      // Generate and download based on format
      if (exportFormat === 'excel') {
        const content = generateCSV(data, reportType);
        const filename = `admin_${reportType}_report_${dayjs().format('YYYY-MM-DD')}.csv`;
        downloadFile(content, filename, exportFormat);
      } else {
        // Generate PDF directly (no need to return content)
        generatePDF(data, reportType, startDate, endDate);
      }
      
    } catch (error) {
      // Handle error silently or log to proper logging service
    } finally {
      setIsGenerating(false);
    }
  };

  const getReportDescription = (): string => {
    switch (reportType) {
      case 'active-users':
        return 'Download detailed report showing active students and tutors for the selected period.';
      case 'popular-courses':
        return 'Download report showing most popular courses by enrollment and revenue for the selected period.';
      case 'overall-revenue':
        return 'Download comprehensive revenue report including session and course earnings for the selected period.';
      default:
        return '';
    }
  };

  const getReportTitle = (): string => {
    switch (reportType) {
      case 'active-users':
        return 'Active Users';
      case 'popular-courses':
        return 'Popular Courses';
      case 'overall-revenue':
        return 'Overall Revenue';
      default:
        return '';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Admin Reports
      </Typography>

      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardHeader 
          title="Download Admin Report"
          avatar={
            <Box
              sx={{
                backgroundColor: 'secondary.main',
                borderRadius: 1,
                p: 1,
                color: 'white',
              }}
            >
              <AdminIcon />
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            {/* Report Type Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Report Type
                </Typography>
                <Select
                  value={reportType}
                  onChange={handleReportTypeChange}
                  size="small"
                >
                  <MenuItem value="active-users">Total Active Users</MenuItem>
                  <MenuItem value="popular-courses">Popular Courses</MenuItem>
                  <MenuItem value="overall-revenue">Overall Revenue</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Export Format Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Export Format
                </Typography>
                <Select
                  value={exportFormat}
                  onChange={handleFormatChange}
                  size="small"
                >
                  <MenuItem value="excel">Excel (CSV)</MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Start Date */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Start Date
              </Typography>
              <TextField
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); }}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* End Date */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                End Date
              </Typography>
              <TextField
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); }}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Generate and Download Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleGenerateAndDownload}
                disabled={isGenerating}
                fullWidth
                size="large"
                startIcon={<DownloadIcon />}
                sx={{ mt: 2, py: 1.5 }}
              >
                {isGenerating ? 'Generating Report...' : `Download ${getReportTitle()} Report (${exportFormat.toUpperCase()})`}
              </Button>
            </Grid>
          </Grid>

          {/* Report Description */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {getReportDescription()} Report covers data from {dayjs(startDate).format('MMM YYYY')} to {dayjs(endDate).format('MMM YYYY')}.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Format: {exportFormat === 'excel' ? 'CSV file (opens in Excel)' : 'PDF file'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
