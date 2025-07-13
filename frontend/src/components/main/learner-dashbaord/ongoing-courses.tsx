'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { API_BASE_URL } from '@/config';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ArrowDown as ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { ArrowUp as ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import {ChalkboardTeacher as Session } from '@phosphor-icons/react/dist/ssr/ChalkboardTeacher';
import Divider from '@mui/material/Divider';
import Box from '@mui/system/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Enrollment } from '@/types/enrollment';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { redirect } from 'next/dist/server/api-utils';
import { paths } from '@/paths';
import { useRouter} from 'next/navigation'


export interface OngoingCourses{

}

export function OngoingCourses(): React.JSX.Element {
    const router = useRouter();
  const [ongoingCourses, setOngoingCourses] =  React.useState<Enrollment[]>([]);

const getOngoingCourses = async ()  => {
        try {

            // set this up after developing the API
            const response = await fetch(`${API_BASE_URL}/enrollment/10001`, {
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
        const returnValue = await getOngoingCourses();
        console.log('returnValue', returnValue);
        
            if ('error' in returnValue) {
      console.error(returnValue.error);
            const errorMessage = returnValue;

      // Optionally, handle error UI here
      return { error: errorMessage || 'Invalid Request' };
    }        
    setOngoingCourses(returnValue);
    
  
      };

      fetchData();
   
    //initial load 
  }, [])



 return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Ongoing Courses
              </Typography>  
            </Stack>
          </Stack>
          <Divider/>
     <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 500 }}>
          {/* <TableHead>
                <TableRow>
                    <TableCell>
                        Course
                    </TableCell>
                </TableRow>
            </TableHead> */}
          <TableBody>
            {ongoingCourses.map((course:Enrollment) => {
              // const { label, color } = statusMap[order.status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover >
                  <TableCell><Typography color="text.secondary" variant="overline">{course?.courseName}</Typography></TableCell>
                  <TableCell>{}</TableCell>
                  {/* <TableCell>{}</TableCell>
                  <TableCell>{} */}
                    {/* <Chip color={color} label={label} size="small" /> */}
              
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Button color="secondary"onClick={() => router.push(paths.main.courses)}> Explore more Courses</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
