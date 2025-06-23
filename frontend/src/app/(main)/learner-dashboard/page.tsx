import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { config } from '@/config';

import Grid from '@mui/material/Unstable_Grid2';
import { WelcomeHere } from '@/components/main/learner-dashbaord/welcome';
import { UploadedCourses } from '@/components/main/tutor-dashboard/uploaded-courses';
import { UpcomingSessions } from '@/components/main/tutor-dashboard/upcoming-session';
import { SessionRequests } from '@/components/main/tutor-dashboard/session-request';
import { OngoingCourses } from '@/components/main/learner-dashbaord/ongoing-courses';
import { AssignmentCard } from '@/components/main/learner-dashbaord/assignments';
import { Statistics } from '@/components/main/learner-dashbaord/stats';





export const metadata = { title: `Learner | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (


     <Grid container spacing={3}>
    <Grid lg={12} sm={12} xs={12}>
      <WelcomeHere/>
  </Grid>
    <Grid lg={6} sm={6} xs={12}>
<OngoingCourses/>
  </Grid>
  <Grid lg={6} sm={6} xs={12}>
    <AssignmentCard/>
  </Grid>
  <Grid  lg={6} sm={6} xs={12}>
<Statistics/>
</Grid>
{/* <Grid  lg={6} sm={6} xs={12}>
<SessionRequests  diff={16} trend="down" sx={{ height: '100%' }} value="1.6k"/>
</Grid> */}
  </Grid>


  );
}