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
  Rating,
  Stack,
  Typography,
  Alert,
  Skeleton,
} from '@mui/material';
import { ArrowLeft, Clock, GraduationCap, Users, Star } from '@phosphor-icons/react/dist/ssr';

import { TUTORS_DATA, type TutorData } from '../../../../constants/tutors';
import { paths } from '../../../../paths';

export default function TutorProfilePage(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const tutorId = params.tutorId as string;

  const [tutor, setTutor] = React.useState<TutorData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const tutorData = TUTORS_DATA[tutorId];
      setTutor(tutorData || null);
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [tutorId]);

  const handleBookSession = (): void => {
    router.push(paths.main.sessionBooking(tutorId));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={60} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rectangular" height={400} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    );
  }

  if (!tutor) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">
          Tutor not found. Please go back and select a valid tutor.
        </Alert>
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => {
            router.push(paths.main.session);
          }}
          sx={{ mt: 2 }}
        >
          Back to Tutors
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => {
              router.back();
            }}
            variant="text"
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Tutor Profile
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {/* Main Profile Section */}
          <Grid item xs={12} md={8}>
            {/* Profile Header */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={3} alignItems="flex-start">
                  <Avatar
                    src={tutor.avatar}
                    sx={{ width: 120, height: 120 }}
                  />
                  <Stack spacing={2} flex={1}>
                    <div>
                      <Typography variant="h4" component="h1" gutterBottom>
                        {tutor.name}
                      </Typography>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        {tutor.title}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Rating value={tutor.rating} readOnly size="small" />
                          <Typography variant="body2">
                            {tutor.rating} ({tutor.reviewCount} reviews)
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Users size={16} />
                          <Typography variant="body2">
                            {tutor.sessionsCompleted} sessions completed
                          </Typography>
                        </Stack>
                      </Stack>
                    </div>
                    
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {tutor.specialties.map((specialty) => (
                        <Chip key={specialty} label={specialty} size="small" color="primary" variant="outlined" />
                      ))}
                    </Stack>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {tutor.languages.map((language) => (
                        <Chip key={language} label={language} size="small" />
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  About
                </Typography>
                <Typography variant="body1" paragraph>
                  {tutor.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <GraduationCap />
                  <Typography variant="h6">
                    Education
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  {tutor.education.map((edu) => (
                    <Box key={`${edu.institution}-${edu.year}`}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {edu.degree}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {edu.institution} • {edu.year}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Experience
                </Typography>
                <Stack spacing={3}>
                  {tutor.experience.map((exp) => (
                    <Box key={`${exp.company}-${exp.position}`}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {exp.position}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {exp.company} • {exp.duration}
                      </Typography>
                      <Typography variant="body2">
                        {exp.description}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Booking Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Book a Session
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {tutor.currency} {tutor.hourlyRate.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      per hour
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleBookSession}
                    disabled={!tutor.isAvailable}
                  >
                    {tutor.isAvailable ? 'Schedule Session' : 'Currently Unavailable'}
                  </Button>

                  <Typography variant="caption" color="text.secondary" align="center">
                    Book now and get instant confirmation
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            {/* Availability Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Availability
                </Typography>
                <Stack spacing={1}>
                  {tutor.availability.map((avail) => (
                    <Box key={avail.day}>
                      <Typography variant="subtitle2" gutterBottom>
                        {avail.day}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {avail.timeSlots.map((slot) => (
                          <Chip
                            key={slot}
                            label={slot}
                            size="small"
                            variant="outlined"
                            icon={<Clock />}
                          />
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Statistics
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Member since:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {tutor.joinedDate.toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Sessions completed:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {tutor.sessionsCompleted}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Average rating:</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Star size={16} style={{ color: '#FFA726' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {tutor.rating}/5
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
