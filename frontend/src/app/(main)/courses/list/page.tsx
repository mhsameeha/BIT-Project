import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { CompaniesFilters } from '@/components/main/integrations/integrations-filters';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';





import { config } from '@/config';
import { AccountDetailsForm } from '@/components/main/account/account-details-form';
import { AccountInfo } from '@/components/main/account/account-info';
import { IntegrationCard } from '@/components/main/integrations/integrations-card';
import type { Integration } from '@/components/main/integrations/integrations-card';



export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;



const integrations = [
  {
    id: 'INTEG-006',
    title: 'Introduction to Programming',
    description: ' Learn the basics of programming using Python. Ideal for complete beginners.',
    level : 'Level : Beginner',
    logo: '/assets/logo-python.png',
    installs: 594,
    updatedAt: dayjs().subtract(12, 'minute').toDate(),
  },
  {
    id: 'INTEG-006',
    title: 'Software Testing & Quality Assurance',
    description: 'Understand the fundamentals of software testing including test cases, manual & automated testing tools.',
    level : 'Level : Beginner–Intermediate',
    logo: '/assets/qa.png',
    installs: 594,
    updatedAt: dayjs().subtract(12, 'minute').toDate(),
  }

] satisfies Integration[];

  export default function Page(): React.JSX.Element {
    return (
      <Stack spacing={3}>
     
        <CompaniesFilters />
        <Grid container spacing={3}>
          {integrations.map((integration) => (
            <Grid key={integration.id} lg={4} md={6} xs={12}>
              <IntegrationCard integration={integration} />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination count={3} size="small" />
        </Box>
      </Stack>
    );
  }
