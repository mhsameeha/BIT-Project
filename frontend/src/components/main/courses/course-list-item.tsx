'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BookOpen as BookOpenIcon } from '@phosphor-icons/react/dist/ssr/BookOpen';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { Student as StudentIcon } from '@phosphor-icons/react/dist/ssr/Student';
import { Course, TutorCourse } from '@/types/course';

export interface CourseListItemProps {
  course: TutorCourse;
}

export function CourseListItem({ course }: CourseListItemProps): React.JSX.Element {
  const router = useRouter();

  const handleViewCourse = (): void => {
    router.push(`${course.courseId}`);
  };

  return (
    <Card sx={{ p: 0, cursor: 'pointer', '&:hover': { boxShadow: 4 } }} onClick={handleViewCourse}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Course Logo */}
          <Avatar
            // src={course.logo}
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
                        {course.totalDuration} total
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <BookOpenIcon size={16} />
                      <Typography color="text.secondary" variant="body2">
                        {course.totalLessons} lessons
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Price and Action */}
                <Stack alignItems="flex-end" spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {course.price?.toLocaleString()} LKR
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Description */}
              <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 1.6 }}>
                {course.introduction}
              </Typography>

              {/* Course Details */}
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box>
                  <Chip 
                    label={course.courseDifficultyName} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                <Box>
                  <Chip label={course.categoryName} size="small" color="secondary" variant="outlined" />
                </Box>

                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Last updated: {course.updatedDate?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {/* Course Preview - First few curriculum items */}
              {Boolean(course.courseContent && course.courseContent.length > 0) && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    What you&apos;ll learn:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {course.courseContent!.slice(0, 3).map((content, index) => (
                      <Typography key={content.contentId || index} color="text.secondary" variant="body2" sx={{ mb: 0.5 }}>
                        • {content.contentTitle}
                      </Typography>
                    ))}
                    {course.courseContent!.length > 3 && (
                      <Typography color="primary" variant="body2" sx={{ fontWeight: 500 }}>
                        +{course.courseContent!.length - 3} more topics...
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
