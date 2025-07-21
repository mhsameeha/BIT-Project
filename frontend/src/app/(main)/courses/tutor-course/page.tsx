import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { grid } from '@mui/system';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { Course } from '@/types/course';
import { config } from '@/config';
import { AccountDetailsForm } from '@/components/main/account/account-details-form';
import { AccountInfo } from '@/components/main/account/account-info';
import { AddCourseForm } from '@/components/main/courses/add-course';
import { CourseCards } from '@/components/main/courses/course-cards';
import { IntegrationCard } from '@/components/main/integrations/integrations-card';
import type { Integration } from '@/components/main/integrations/integrations-card';
import { CompaniesFilters } from '@/components/main/integrations/integrations-filters';

export const metadata = { title: `Course | Dashboard | ${config.site.name}` } satisfies Metadata;

export interface tutorpage {
  course: Course;
}

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Courses</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <AddCourseForm />
          </Stack>
        </Stack>
      </Stack>
      <CompaniesFilters />

      <Typography variant="h4">My Courses</Typography>
      {/* <Grid container spacing={3}>
          {courses.map((course)=>(
            <Grid key= {course.courseid} lg={4} md={6} xs={12} >
              <CourseCards course = {course}/>
            </Grid>
          ))}
          
        </Grid> */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination count={3} size="small" />
      </Box>
    </Stack>
  );
}
