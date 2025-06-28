'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { GraduationCap as GraduationCapIcon } from '@phosphor-icons/react/dist/ssr/GraduationCap';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { CurrencyCircleDollar as CurrencyIcon } from '@phosphor-icons/react/dist/ssr/CurrencyCircleDollar';

import { useRouter } from 'next/navigation';

import type { TutorData } from '@/constants/tutors';
import { paths } from '@/paths';

export interface TutorListItemProps {
  tutor: TutorData;
}

export function TutorListItem({ tutor }: TutorListItemProps): React.JSX.Element {
  const router = useRouter();

  const handleScheduleSession = (): void => {
    router.push(`/session/book/${tutor.id}`);
  };

  const handleViewProfile = (): void => {
    router.push(paths.main.tutorProfile(tutor.id));
  };

  return (
    <Card sx={{ p: 0 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Avatar */}
          <Avatar
            src={tutor.avatar}
            sx={{ width: 80, height: 80 }}
            variant="rounded"
          />
          
          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack spacing={2}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Link
                    component="button"
                    variant="h6"
                    onClick={handleViewProfile}
                    sx={{
                      textAlign: 'left',
                      textDecoration: 'none',
                      color: 'primary.main',
                      fontWeight: 600,
                      mb: 0.5,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {tutor.name}
                  </Link>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                    {tutor.title}
                  </Typography>
                  
                  {/* Rating and Stats */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Rating value={tutor.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {tutor.rating}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        ({tutor.reviewCount} reviews)
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <UsersIcon size={16} />
                      <Typography color="text.secondary" variant="body2">
                        {tutor.sessionsCompleted} sessions
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CurrencyIcon size={16} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {tutor.currency} {tutor.hourlyRate.toLocaleString()}/hour
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                {/* Action Buttons */}
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" size="small" onClick={handleViewProfile}>
                    View Profile
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={handleScheduleSession}
                    disabled={!tutor.isAvailable}
                  >
                    {tutor.isAvailable ? 'Schedule Session' : 'Unavailable'}
                  </Button>
                </Stack>
              </Box>
              
              {/* Description */}
              <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 1.6 }}>
                {tutor.description}
              </Typography>
              
              {/* Specialties */}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Specialties:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {tutor.specialties.slice(0, 4).map((specialty) => (
                    <Chip 
                      key={specialty} 
                      label={specialty} 
                      size="small" 
                      variant="outlined"
                    />
                  ))}
                  {tutor.specialties.length > 4 && (
                    <Chip 
                      label={`+${tutor.specialties.length - 4} more`} 
                      size="small" 
                      variant="outlined"
                      color="primary"
                    />
                  )}
                </Box>
              </Box>
              
              {/* Education & Languages */}
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <GraduationCapIcon size={16} />
                    Education:
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {tutor.education[0]?.degree} - {tutor.education[0]?.institution}
                  </Typography>
                  {tutor.education.length > 1 && (
                    <Typography color="text.secondary" variant="body2">
                      +{tutor.education.length - 1} more
                    </Typography>
                  )}
                </Box>
                
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Languages:
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {tutor.languages.join(', ')}
                  </Typography>
                </Box>
              </Box>
              
              {/* Availability */}
              {tutor.isAvailable ? (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ClockIcon size={16} />
                    Next Available:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {tutor.availability.slice(0, 3).map((availability) => (
                      <Chip 
                        key={availability.day}
                        label={`${availability.day} - ${availability.timeSlots[0]}`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ))}
                    {tutor.availability.length > 3 && (
                      <Typography color="text.secondary" variant="body2" sx={{ alignSelf: 'center' }}>
                        +{tutor.availability.length - 3} more days
                      </Typography>
                    )}
                  </Box>
                </Box>
              ) : null}
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
