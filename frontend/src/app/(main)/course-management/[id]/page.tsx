'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Rating,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import {
  ArrowLeft,
  Books,
  PencilSimple,
  Trash,
  Users,
  Clock,
  Student,
  CurrencyDollar,
  VideoCamera,
  FilePdf,
  Star,
} from '@phosphor-icons/react/dist/ssr';
import dayjs from 'dayjs';

import { getCourseById } from '../../../../constants/courses';
import type { TutorCourse } from '../../../../types/course';

export default function CourseDetailsPage(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [course, setCourse] = React.useState<TutorCourse | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (courseId) {
      // Load course details
      const courseData = getCourseById(courseId);
      setCourse(courseData || null);
      setLoading(false);
    }
  }, [courseId]);

  const handleBack = (): void => {
    router.back();
  };

  const handleEdit = (): void => {
    if (course) {
      router.push(`/course-management/${course.id}/edit`);
    }
  };


  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h5" color="error">
            Course not found
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={20} />}
            onClick={handleBack}
          >
            Back to Course Management
          </Button>
        </Stack>
      </Container>
    );
  }

  // Use actual course content or fallback to empty array
  const courseContent = course.contents || [];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack}>
            <ArrowLeft size={24} />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>
              Course Details
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage course information
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<PencilSimple size={20} />}
              onClick={handleEdit}
            >
              Edit Course
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Trash size={20} />}
            >
              Delete Course
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            {/* Basic Information */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                  <Avatar
                    src={course.logo}
                    sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
                  >
                    <Books size={48} />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant="h5" fontWeight="bold">
                        {course.title}
                      </Typography>
                      <Chip
                        label={course.isEnabled ? 'Active' : 'Disabled'}
                        color={course.isEnabled ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {course.category} • {course.level}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={course.rating} readOnly size="small" precision={0.1} />
                      <Typography variant="body2" color="text.secondary">
                        {course.rating} ({course.reviewCount} reviews)
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {course.description}
                </Typography>

                {/* Course Stats */}
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Users size={24} color="#1976d2" style={{ marginBottom: 8 }} />
                      <Typography variant="h6" color="primary.main">
                        {course.enrolledStudents}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Students
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Clock size={24} color="#ed6c02" style={{ marginBottom: 8 }} />
                      <Typography variant="h6" color="warning.main">
                        {course.totalDuration}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duration
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Student size={24} color="#0288d1" style={{ marginBottom: 8 }} />
                      <Typography variant="h6" color="info.main">
                        {course.totalLessons}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lessons
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <CurrencyDollar size={24} color="#2e7d32" style={{ marginBottom: 8 }} />
                      <Typography variant="h6" color="success.main">
                        {course.currency} {course.fee.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fee
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Course Content
                </Typography>
                <Stack spacing={2}>
                  {courseContent.length > 0 ? (
                    courseContent.map((content, index) => (
                    <Card key={content.id} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1" fontWeight="medium" color="primary">
                            {index + 1}. {content.title}
                          </Typography>
                          <Chip
                            label={content.duration}
                            size="small"
                            variant="outlined"
                            icon={<Clock size={14} />}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {content.description}
                        </Typography>

                        {/* Sub-Contents */}
                        {content.subContents.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                              Materials:
                            </Typography>
                            <Stack spacing={1}>
                              {content.subContents.map((subContent) => (
                                <Box
                                  key={subContent.id}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 1.5,
                                    bgcolor: 'grey.50',
                                    borderRadius: 1,
                                  }}
                                >
                                  {subContent.type === 'video' && (
                                    <VideoCamera size={20} color="#1976d2" />
                                  )}
                                  {subContent.type === 'document' && (
                                    <FilePdf size={20} color="#d32f2f" />
                                  )}
                                  {subContent.type === 'both' && (
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                      <VideoCamera size={16} color="#1976d2" />
                                      <FilePdf size={16} color="#d32f2f" />
                                    </Box>
                                  )}
                                  <Box>
                                    <Typography variant="body2" fontWeight="medium">
                                      {subContent.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {subContent.description}
                                    </Typography>
                                  </Box>
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No course content available yet.
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            {/* Course Information */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Course Information
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Languages:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {course.languages.map((language) => (
                        <Chip
                          key={language}
                          label={language}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tags:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {course.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created:
                    </Typography>
                    <Typography variant="body1">
                      {dayjs(course.createdAt).format('MMMM DD, YYYY')}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated:
                    </Typography>
                    <Typography variant="body1">
                      {dayjs(course.updatedAt).format('MMMM DD, YYYY')}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Stack spacing={1}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Users size={16} />}
                  >
                    View Enrollments
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Star size={16} />}
                  >
                    View Reviews
                  </Button>
                 
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
