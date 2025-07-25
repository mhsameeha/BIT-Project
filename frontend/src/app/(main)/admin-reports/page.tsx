'use client';

import * as React from 'react';
import { AdminPanelSettings as AdminIcon, Download as DownloadIcon } from '@mui/icons-material';
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
} from '@mui/material';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import { getMonthlyEarnings } from '@/Services/admin';

// Types for admin report data
type AdminReportType = 'overall-revenue';
type ExportFormat = 'pdf' | 'excel';

interface OverallRevenueData {
  month: string;
  sessionRevenue: number;
  courseRevenue: number;
  totalRevenue: number;
  year: number;
  monthNumber: number;
}

const fetchOverallRevenueData = async (startDate: string, endDate: string): Promise<OverallRevenueData[]> => {
  try {
    const result = await getMonthlyEarnings(startDate, endDate);
    
    if ('error' in result) {
      return [];
    }

    return result.map((item) => ({
      month: item.month,
      sessionRevenue: item.sessionEarnings,
      courseRevenue: item.courseEarnings,
      totalRevenue: item.totalEarnings,
      year: item.year,
      monthNumber: item.monthNumber,
    }));
  } catch (error) {
    return [];
  }
};

// Helper function to generate CSV content for Excel
const generateCSV = (data: OverallRevenueData[]): string => {
  const headers = ['Month', 'Session Revenue (LKR)', 'Course Revenue (LKR)', 'Total Revenue (LKR)'];
  const rows = data.map((item) => [
    item.month,
    item.sessionRevenue.toString(),
    item.courseRevenue.toString(),
    item.totalRevenue.toString(),
  ]);

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
const generatePDF = (data: OverallRevenueData[], startDate: string, endDate: string): void => {
  // eslint-disable-next-line new-cap -- jsPDF constructor uses lowercase
  const doc = new jsPDF();

  // Set up the document
  doc.setFontSize(20);
  doc.text('Overall Revenue Report', 20, 30);

  doc.setFontSize(12);
  doc.text(`Period: ${dayjs(startDate).format('MMM YYYY')} to ${dayjs(endDate).format('MMM YYYY')}`, 20, 45);
  doc.text(`Generated on: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`, 20, 55);

  let yPosition = 75;

  const revenueData = data;

  // Add summary
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalSessionRevenue = revenueData.reduce((sum, item) => sum + item.sessionRevenue, 0);
  const totalCourseRevenue = revenueData.reduce((sum, item) => sum + item.courseRevenue, 0);

  doc.setFontSize(14);
  doc.text('Summary:', 20, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  doc.text(`Total Revenue: LKR ${totalRevenue.toLocaleString()}`, 25, yPosition);
  yPosition += 10;
  doc.text(`Session Revenue: LKR ${totalSessionRevenue.toLocaleString()}`, 25, yPosition);
  yPosition += 10;
  doc.text(`Course Revenue: LKR ${totalCourseRevenue.toLocaleString()}`, 25, yPosition);
  yPosition += 20;

  // Add table header
  doc.setFontSize(14);
  doc.text('Monthly Breakdown:', 20, yPosition);
  yPosition += 15;

  doc.setFontSize(10);
  doc.text('Month', 20, yPosition);
  doc.text('Session Rev.', 60, yPosition);
  doc.text('Course Rev.', 110, yPosition);
  doc.text('Total Rev.', 160, yPosition);
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
    doc.text(`${(item.sessionRevenue / 1000).toFixed(0)}K`, 60, yPosition);
    doc.text(`${(item.courseRevenue / 1000).toFixed(0)}K`, 110, yPosition);
    doc.text(`${(item.totalRevenue / 1000).toFixed(0)}K`, 160, yPosition);
    yPosition += 12;
  });

  // Download the PDF
  const filename = `admin_overall_revenue_report_${dayjs().format('YYYY-MM-DD')}.pdf`;
  doc.save(filename);
};

export default function AdminReportsPage(): React.JSX.Element {
  const [reportType, setReportType] = React.useState<AdminReportType>('overall-revenue');
  const [exportFormat, setExportFormat] = React.useState<ExportFormat>('excel');
  const [startDate, setStartDate] = React.useState<string>(dayjs().subtract(6, 'month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = React.useState<string>(dayjs().format('YYYY-MM-DD'));
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);

  const handleReportTypeChange = (event: SelectChangeEvent<AdminReportType>): void => {
    setReportType(event.target.value as AdminReportType);
  };

  const handleFormatChange = (event: SelectChangeEvent<ExportFormat>): void => {
    setExportFormat(event.target.value as ExportFormat);
  };

  const handleGenerateAndDownload = async (): Promise<void> => {
    setIsGenerating(true);

    try {
      // Generate data based on report type - only overall-revenue is supported
      let data: OverallRevenueData[] = [];
      if (reportType === 'overall-revenue') {
        data = await fetchOverallRevenueData(startDate, endDate);
      }

      if (data.length === 0) {
        // Handle case where no data is returned
        return;
      }

      // Generate and download based on format
      if (exportFormat === 'excel') {
        const content = generateCSV(data);
        const filename = `admin_${reportType}_report_${dayjs().format('YYYY-MM-DD')}.csv`;
        downloadFile(content, filename, exportFormat);
      } else {
        // Generate PDF directly (no need to return content)
        generatePDF(data, startDate, endDate);
      }
    } catch (error) {
      // Handle error silently or log to proper logging service
    } finally {
      setIsGenerating(false);
    }
  };

  const getReportDescription = (): string => {
    switch (reportType) {
      case 'overall-revenue':
        return 'Download comprehensive revenue report including session and course earnings for the selected period.';
      default:
        return '';
    }
  };

  const getReportTitle = (): string => {
    switch (reportType) {
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
                <Select value={reportType} onChange={handleReportTypeChange} size="small">
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
                  : `Download ${getReportTitle()} Report (${exportFormat.toUpperCase()})`}
              </Button>
            </Grid>
          </Grid>

          {/* Report Description */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {getReportDescription()} Report covers data from {dayjs(startDate).format('MMM YYYY')} to{' '}
              {dayjs(endDate).format('MMM YYYY')}.
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
