import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { AssignmentCard } from '@/components/main/learner-dashbaord/assignments';
import { OngoingCourses } from '@/components/main/learner-dashbaord/ongoing-courses';
import { Statistics } from '@/components/main/learner-dashbaord/stats';
import { WelcomeHere } from '@/components/main/learner-dashbaord/welcome';
import { SessionRequests } from '@/components/main/tutor-dashboard/session-request';
import { UpcomingSessions } from '@/components/main/tutor-dashboard/upcoming-session';
import { UploadedCourses } from '@/components/main/tutor-dashboard/uploaded-courses';

export const metadata = { title: `Learner | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid lg={12} sm={12} xs={12}>
        <WelcomeHere />
      </Grid>
      <Grid lg={6} sm={6} xs={12}>
        <OngoingCourses />
      </Grid>
      <Grid lg={6} sm={6} xs={12}>
        <AssignmentCard />
      </Grid>
      <Grid lg={6} sm={6} xs={12}>
        <Statistics />
      </Grid>
      {/* <Grid  lg={6} sm={6} xs={12}>
<SessionRequests  diff={16} trend="down" sx={{ height: '100%' }} value="1.6k"/>
</Grid> */}
    </Grid>
  );
}
