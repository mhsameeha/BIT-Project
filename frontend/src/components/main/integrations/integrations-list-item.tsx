'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import dayjs from 'dayjs';

export interface Integration {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  tutorName: string;
  logo: string;
  enrolledStudents: number;
  rating: number;
  reviewCount: number;
  fee: number;
  updatedAt: Date;
}

export interface IntegrationListItemProps {
  integration: Integration;
}

export function IntegrationListItem({ integration }: IntegrationListItemProps): React.JSX.Element {
  const router = useRouter();
  
  // Extract level text without "Level : " prefix
  const levelText = integration.level.replace('Level : ', '');
  
  // Determine chip color based on level
  const getLevelColor = (level: string): 'success' | 'warning' | 'error' | 'default' => {
    if (level.toLowerCase().includes('beginner')) return 'success';
    if (level.toLowerCase().includes('intermediate')) return 'warning';
    if (level.toLowerCase().includes('advanced')) return 'error';
    return 'default';
  };

  // Determine category color
  const getCategoryColor = (category: string): 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' => {
    switch (category.toLowerCase()) {
      case 'programming': return 'primary';
      case 'mathematics': return 'info';
      case 'graphic designing': return 'secondary';
      case 'data science': return 'success';
      case 'ai': return 'warning';
      case 'cloud computing': return 'error';
      default: return 'primary';
    }
  };

  const handleCourseClick = (): void => {
    router.push(`/courses/${integration.id}`);
  };

  return (
    <Paper 
      elevation={1} 
      onClick={handleCourseClick}
      sx={{ 
        p: 3, 
        mb: 2, 
        '&:hover': { 
          elevation: 3,
          cursor: 'pointer',
          bgcolor: 'action.hover'
        },
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <Stack direction="row" spacing={3} alignItems="flex-start">
        {/* Course Image */}
        <Avatar 
          src={integration.logo} 
          variant="rounded" 
          sx={{ 
            width: 120, 
            height: 80, 
            flexShrink: 0 
          }} 
        />
        
        {/* Course Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={1.5}>
            {/* Title, Category and Level */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                  {integration.title}
                </Typography>
                <Chip 
                  label={integration.category} 
                  size="small" 
                  color={getCategoryColor(integration.category)}
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Chip 
                label={levelText} 
                size="small" 
                color={getLevelColor(levelText)}
                variant="outlined"
              />
            </Stack>
            
            {/* Description */}
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.4
              }}
            >
              {integration.description}
            </Typography>

            {/* Tutor Information */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <UserIcon fontSize="var(--icon-fontSize-sm)" />
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                Tutor: {integration.tutorName}
              </Typography>
            </Stack>
            
            {/* Rating */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Rating 
                value={integration.rating} 
                readOnly 
                precision={0.1} 
                size="small" 
              />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {integration.rating}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({integration.reviewCount} reviews)
              </Typography>
            </Stack>
            
            {/* Meta Information */}
            <Stack direction="row" spacing={3} alignItems="center" sx={{ justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <UsersIcon fontSize="var(--icon-fontSize-sm)" />
                  <Typography variant="body2" color="text.secondary">
                    {integration.enrolledStudents.toLocaleString()} students
                  </Typography>
                </Stack>
                
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <ClockIcon fontSize="var(--icon-fontSize-sm)" />
                  <Typography variant="body2" color="text.secondary">
                    Updated {dayjs(integration.updatedAt).format('MMM D, YYYY')}
                  </Typography>
                </Stack>
              </Stack>

              {/* Course Fee */}
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                LKR {integration.fee.toLocaleString()}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
