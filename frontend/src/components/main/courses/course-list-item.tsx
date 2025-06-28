'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';

import { BookOpen as BookOpenIcon } from '@phosphor-icons/react/dist/ssr/BookOpen';
import { Student as StudentIcon } from '@phosphor-icons/react/dist/ssr/Student';
import { useRouter } from 'next/navigation';

import type { CourseData } from '@/constants/courses';

export interface CourseListItemProps {
  course: CourseData;
}

export function CourseListItem({ course }: CourseListItemProps): React.JSX.Element {
  const router = useRouter();

  const handleViewCourse = (): void => {
    router.push(`/courses/${course.id}`);
  };

  // Calculate total course duration
  const totalDuration = course.curriculum.reduce((total, section) => {
    const sectionDuration = section.lessons.reduce((sectionTotal, lesson) => {
      const minutes = parseInt(lesson.duration.replace(/\D/g, ''));
      return sectionTotal + minutes;
    }, 0);
    return total + sectionDuration;
  }, 0);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${remainingMinutes}m`;
  };

  return (
    <Card sx={{ p: 0, cursor: 'pointer', '&:hover': { boxShadow: 4 } }} onClick={handleViewCourse}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Course Logo */}
          <Avatar
            src={course.logo}
            sx={{ width: 80, height: 80 }}
            variant="rounded"
          />
          
          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack spacing={2}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {course.title}
                  </Typography>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                    by {course.tutorName}
                  </Typography>
                  
                  {/* Rating and Stats */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Rating value={course.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {course.rating}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        ({course.reviewCount} reviews)
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StudentIcon size={16} />
                      <Typography color="text.secondary" variant="body2">
                        {course.enrolledStudents.toLocaleString()} students
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ClockIcon size={16} />
                      <Typography color="text.secondary" variant="body2">
                        {formatDuration(totalDuration)} total
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <BookOpenIcon size={16} />
                      <Typography color="text.secondary" variant="body2">
                        {course.curriculum.length} sections
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                {/* Price and Action */}
                <Stack alignItems="flex-end" spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {course.currency} {course.fee.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              
              {/* Description */}
              <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 1.6 }}>
                {course.description}
              </Typography>
              
              {/* Course Details */}
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box>
                  <Chip 
                    label={course.level} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                
                <Box>
                  <Chip 
                    label={course.category} 
                    size="small" 
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
                
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Last updated: {new Date(course.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              
              {/* Course Preview - First few curriculum items */}
              {course.curriculum.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    What you&apos;ll learn:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {course.curriculum[0].lessons.slice(0, 3).map((lesson) => (
                      <Typography key={lesson.id} color="text.secondary" variant="body2" sx={{ mb: 0.5 }}>
                        • {lesson.title}
                      </Typography>
                    ))}
                    {course.curriculum[0].lessons.length > 3 && (
                      <Typography color="primary" variant="body2" sx={{ fontWeight: 500 }}>
                        +{course.curriculum[0].lessons.length - 3} more lessons...
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
