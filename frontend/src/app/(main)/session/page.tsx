import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { config } from '@/config';

import Grid from '@mui/material/Unstable_Grid2';
import { WelcomeHere } from '@/components/main/learner-dashbaord/welcome';
import { TutorList } from '@/components/main/session/tutor-list';
import { UpcomingSessions } from '@/components/main/tutor-dashboard/upcoming-session';
import { SessionRequests } from '@/components/main/tutor-dashboard/session-request';
import { OngoingCourses } from '@/components/main/learner-dashbaord/ongoing-courses';
import { AssignmentCard } from '@/components/main/learner-dashbaord/assignments';
import { Statistics } from '@/components/main/learner-dashbaord/stats';






export const metadata = { title: `Learner | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
     <Grid container spacing={3}>
    <Grid lg={7} sm={4} xs={12}> <TutorList/>
    </Grid>
    <Grid lg={5} sm={4} xs={12}> <SessionRequests trend={'up'} value={''}/></Grid>
    </Grid>
   
  );
}