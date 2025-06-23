'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ArrowDown as ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { ArrowUp as ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import Divider from '@mui/material/Divider';
import { Session, SessionStatus } from '@/types/session';
import dayjs from 'dayjs';
import { Session } from 'inspector';
import { table } from 'console';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Chip from '@mui/material/Chip';
import Box from '@mui/system/Box';


export interface UpcomingSessionsProps{
  diff?: number;
  trend: 'up' | 'down';
  sx?: SxProps;
  value: string;
}


export function UpcomingSessions({ diff, trend, sx, value }: UpcomingSessionsProps): React.JSX.Element {
  const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  const trendColor = trend === 'up' ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)';
  const [upcomingSessions, setUpcomingSessions] =  React.useState<Session[]>([]);

const getUpcomingSessions = async ()  => {
        try {

            // set this up after developing the API
            const response = await fetch('https://localhost:7028/api/tutor/20002', {
            method: 'GET',
            });
        
            if (!response.ok) {
            const errorMessage = await response.text();
            return { error: errorMessage || 'Invalid Request' };
            }
            return response.json();
        }
        catch (error) {
            console.error('Request Error:', error);
            // return { error: 'Something went wrong while signing in' };
        }
       

        return [];
    }

  React.useEffect(()   =>   {
    const fetchData = async () => {
        const returnValue = await getUpcomingSessions();
        console.log('returnValue', returnValue);
        
            if ('error' in returnValue) {
      console.error(returnValue.error);
            const errorMessage = returnValue;

      // Optionally, handle error UI here
      return { error: errorMessage || 'Invalid Request' };
    } 
    setUpcomingSessions(returnValue);
  console.log(returnValue);
  
      };

      fetchData();
   
    //initial load 
  }, [])


 

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Upcoming Sessions
              </Typography>  
            </Stack>
          </Stack>
          <Divider/>
     <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              <TableCell>Learner</TableCell>
              <TableCell>Session</TableCell>
              <TableCell sortDirection="desc">Time</TableCell>
              <TableCell>Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {upcomingSessions.map((session:Session) => {
              // const { label, color } = statusMap[order.status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover >
                  <TableCell>{session.learnerName}</TableCell>
                  <TableCell>{session.sessionName}</TableCell>
                  <TableCell>{dayjs(session.sessionTime).format('HH:mm, MMM D, YYYY ')}</TableCell>
                  <TableCell>{session.duration}
                    {/* <Chip color={color} label={label} size="small" /> */}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}