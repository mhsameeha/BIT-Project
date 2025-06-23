import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { config } from '@/config';

import Grid from '@mui/material/Unstable_Grid2';
import { TotalSessions } from '@/components/main/tutor-dashboard/total-sessions';
import { TotalEnrollements } from '@/components/main/tutor-dashboard/total-enrollments';
import { UploadedCourses } from '@/components/main/tutor-dashboard/uploaded-courses';
import { UpcomingSessions } from '@/components/main/tutor-dashboard/upcoming-session';
import { SessionRequests } from '@/components/main/tutor-dashboard/session-request';





export const metadata = { title: `Tutor | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <>
     <Grid container spacing={3}>
    <Grid lg={4} sm={6} xs={12}>
    <TotalSessions diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />
  </Grid>
    <Grid lg={4} sm={6} xs={12}>
    <TotalEnrollements diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />
  </Grid>
  <Grid lg={4} sm={6} xs={12}>
    <UploadedCourses diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />
  </Grid>
  <Grid  lg={6} sm={6} xs={12}>
<UpcomingSessions  diff={16} trend="down" sx={{ height: '100%' }} value="1.6k"/>
</Grid>
<Grid  lg={6} sm={6} xs={12}>
<SessionRequests  diff={16} trend="down" sx={{ height: '100%' }} value="1.6k"/>
</Grid>
  </Grid>

</>
  );
}