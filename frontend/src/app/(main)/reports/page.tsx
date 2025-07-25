'use client';

import * as React from 'react';
import { Download as DownloadIcon, Assessment as ReportIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
  Alert,
} from '@mui/material';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import { getTutorMonthlyEarnings } from '@/Services/tutor';

// Types for report data
type ReportType = 'earnings' | 'enrollments';
type ExportFormat = 'pdf' | 'excel';

interface EarningsData {
  month: string;
  sessionEarnings: number;
  courseEarnings: number;
  totalEarnings: number;
}

interface EnrollmentData {
  month: string;
  totalEnrollments: number;
  courseData: {
    courseId: string;
    courseName: string;
    enrollments: number;
  }[];
}

// Mock course data for enrollments (keeping this for enrollments report)
const MOCK_COURSES = [
  { id: '1', title: 'Python Programming Fundamentals' },
  { id: '2', title: 'Advanced Python & Data Science' },
  { id: '3', title: 'Web Development with Python' },
  { id: '4', title: 'Machine Learning Basics' },
  { id: '5', title: 'Database Management' },
];

// Mock data generator for enrollments (to be replaced later)
const generateEnrollmentData = (startDate: string, endDate: string): EnrollmentData[] => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const data = [];

  let current = start.startOf('month');
  while (current.isBefore(end) || current.isSame(end, 'month')) {
    const monthStr = current.format('MMM YYYY');

    // Generate enrollment data per course
    const courseData = MOCK_COURSES.slice(0, 5).map((course) => ({
      courseId: course.id,
      courseName: course.title,
      enrollments: Math.floor(Math.random() * 25) + 5,
    }));

    const totalEnrollments = courseData.reduce((sum, course) => sum + course.enrollments, 0);

    data.push({
      month: monthStr,
      totalEnrollments,
      courseData,
    });
    current = current.add(1, 'month');
  }

  return data;
};

// Helper function to generate CSV content for Excel
const generateCSV = (data: EarningsData[] | EnrollmentData[], reportType: ReportType): string => {
  if (reportType === 'earnings') {
    const earningsData = data as EarningsData[];
    const headers = ['Month', 'Session Earnings (LKR)', 'Course Earnings (LKR)', 'Total Earnings (LKR)'];
    const rows = earningsData.map((item) => [
      item.month,
      item.sessionEarnings.toString(),
      item.courseEarnings.toString(),
      item.totalEarnings.toString(),
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  const enrollmentData = data as EnrollmentData[];
  const headers = ['Month', 'Total Enrollments', 'Top Course', 'Top Course Enrollments'];
  const rows = enrollmentData.map((item) => {
    const topCourse = item.courseData.reduce((max, course) => (course.enrollments > max.enrollments ? course : max));
    return [item.month, item.totalEnrollments.toString(), topCourse.courseName, topCourse.enrollments.toString()];
  });

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
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
const generatePDF = (
  data: EarningsData[] | EnrollmentData[],
  reportType: ReportType,
  startDate: string,
  endDate: string
): void => {
  // eslint-disable-next-line new-cap -- jsPDF constructor uses lowercase
  const doc = new jsPDF();

  // Set up the document
  doc.setFontSize(20);
  doc.text(`${reportType === 'earnings' ? 'Earnings' : 'Enrollments'} Report`, 20, 30);

  doc.setFontSize(12);
  doc.text(`Period: ${dayjs(startDate).format('MMM YYYY')} to ${dayjs(endDate).format('MMM YYYY')}`, 20, 45);
  doc.text(`Generated on: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`, 20, 55);

  let yPosition = 75;

  if (reportType === 'earnings') {
    const earningsData = data as EarningsData[];

    // Add summary
    const totalEarnings = earningsData.reduce((sum, item) => sum + item.totalEarnings, 0);
    const totalSessionEarnings = earningsData.reduce((sum, item) => sum + item.sessionEarnings, 0);
    const totalCourseEarnings = earningsData.reduce((sum, item) => sum + item.courseEarnings, 0);

    doc.setFontSize(14);
    doc.text('Summary:', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.text(`Total Earnings: LKR ${totalEarnings.toLocaleString()}`, 25, yPosition);
    yPosition += 10;
    doc.text(`Session Earnings: LKR ${totalSessionEarnings.toLocaleString()}`, 25, yPosition);
    yPosition += 10;
    doc.text(`Course Earnings: LKR ${totalCourseEarnings.toLocaleString()}`, 25, yPosition);
    yPosition += 20;

    // Add table header
    doc.setFontSize(14);
    doc.text('Monthly Breakdown:', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.text('Month', 20, yPosition);
    doc.text('Session Earnings', 60, yPosition);
    doc.text('Course Earnings', 110, yPosition);
    doc.text('Total Earnings', 155, yPosition);
    yPosition += 5;

    // Add separator line
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;

    // Add data rows
    earningsData.forEach((item) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(item.month, 20, yPosition);
      doc.text(`LKR ${item.sessionEarnings.toLocaleString()}`, 60, yPosition);
      doc.text(`LKR ${item.courseEarnings.toLocaleString()}`, 110, yPosition);
      doc.text(`LKR ${item.totalEarnings.toLocaleString()}`, 155, yPosition);
      yPosition += 12;
    });
  } else {
    const enrollmentData = data as EnrollmentData[];

    // Add summary
    const totalEnrollments = enrollmentData.reduce((sum, item) => sum + item.totalEnrollments, 0);
    const avgEnrollments = Math.round(totalEnrollments / enrollmentData.length);

    doc.setFontSize(14);
    doc.text('Summary:', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.text(`Total Enrollments: ${totalEnrollments.toLocaleString()}`, 25, yPosition);
    yPosition += 10;
    doc.text(`Average Monthly Enrollments: ${avgEnrollments}`, 25, yPosition);
    yPosition += 20;

    // Add table header
    doc.setFontSize(14);
    doc.text('Monthly Breakdown:', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.text('Month', 20, yPosition);
    doc.text('Total Enrollments', 60, yPosition);
    doc.text('Top Course', 110, yPosition);
    doc.text('Top Course Enrollments', 155, yPosition);
    yPosition += 5;

    // Add separator line
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;

    // Add data rows
    enrollmentData.forEach((item) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      const topCourse = item.courseData.reduce((max, course) => (course.enrollments > max.enrollments ? course : max));

      doc.text(item.month, 20, yPosition);
      doc.text(item.totalEnrollments.toString(), 60, yPosition);
      doc.text(topCourse.courseName.substring(0, 25), 110, yPosition);
      doc.text(topCourse.enrollments.toString(), 155, yPosition);
      yPosition += 12;
    });
  }

  // Download the PDF
  const filename = `${reportType}_report_${dayjs().format('YYYY-MM-DD')}.pdf`;
  doc.save(filename);
};

export default function ReportsPage(): React.JSX.Element {
  const [reportType, setReportType] = React.useState<ReportType>('earnings');
  const [exportFormat, setExportFormat] = React.useState<ExportFormat>('excel');
  const [startDate, setStartDate] = React.useState<string>(dayjs().subtract(6, 'month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = React.useState<string>(dayjs().format('YYYY-MM-DD'));
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const handleReportTypeChange = (event: SelectChangeEvent<ReportType>): void => {
    setReportType(event.target.value as ReportType);
  };

  const handleFormatChange = (event: SelectChangeEvent<ExportFormat>): void => {
    setExportFormat(event.target.value as ExportFormat);
  };

  const handleGenerateAndDownload = async (): Promise<void> => {
    setIsGenerating(true);
    setError('');

    try {
      // Generate data based on report type
      let data: EarningsData[] | EnrollmentData[];
      
      if (reportType === 'earnings') {
        // Fetch real earnings data from API for the current tutor
        const result = await getTutorMonthlyEarnings(startDate, endDate);
        
        if ('error' in result) {
          setError(`Failed to fetch earnings data: ${result.error}`);
          return;
        }
        
        // Transform API data to match our EarningsData interface
        data = result.map(item => ({
          month: item.month,
          sessionEarnings: item.sessionEarnings,
          courseEarnings: item.courseEarnings,
          totalEarnings: item.totalEarnings
        }));
      } else {
        // Use mock data for enrollments (to be replaced later)
        data = generateEnrollmentData(startDate, endDate);
      }

      // Generate and download based on format
      if (exportFormat === 'excel') {
        const content = generateCSV(data, reportType);
        const filename = `${reportType}_report_${dayjs().format('YYYY-MM-DD')}.csv`;
        downloadFile(content, filename, exportFormat);
      } else {
        // Generate PDF directly (no need to return content)
        generatePDF(data, reportType, startDate, endDate);
      }
    } catch (err) {
      setError('An error occurred while generating the report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Generate Reports
      </Typography>

      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardHeader
          title="Download Report"
          avatar={
            <Box
              sx={{
                backgroundColor: 'primary.main',
                borderRadius: 1,
                p: 1,
                color: 'white',
              }}
            >
              <ReportIcon />
            </Box>
          }
        />
        <CardContent>
          {error.length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={3}>
            {/* Report Type Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Report Type
                </Typography>
                <Select value={reportType} onChange={handleReportTypeChange} size="small">
                  <MenuItem value="earnings">Earnings Report</MenuItem>
                  <MenuItem value="enrollments">Enrollments Report</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Export Format Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Export Format
                </Typography>
                <Select value={exportFormat} onChange={handleFormatChange} size="small">
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
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
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
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
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
                {isGenerating
                  ? 'Generating Report...'
                  : `Download ${reportType === 'earnings' ? 'Earnings' : 'Enrollments'} Report (${exportFormat.toUpperCase()})`}
              </Button>
            </Grid>
          </Grid>

          {/* Report Description */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {reportType === 'earnings'
                ? `Download detailed earnings report showing session and course revenue from ${dayjs(startDate).format('MMM YYYY')} to ${dayjs(endDate).format('MMM YYYY')}.`
                : `Download student enrollment report showing total enrollments and course breakdown from ${dayjs(startDate).format('MMM YYYY')} to ${dayjs(endDate).format('MMM YYYY')}.`}
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
