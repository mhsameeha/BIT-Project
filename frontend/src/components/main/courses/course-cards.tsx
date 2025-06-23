'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import dayjs from 'dayjs';
import { Course } from '@/types/course';


export interface CourseCardsProps {
  course: Course;
}

export function CourseCards({ course }:CourseCardsProps): React.JSX.Element {
  const [courses, setCourses] =  React.useState<Course[]>([]);

const getCourses = async ()  => {
        try {

            // set this up after developing the API
            const response = await fetch('https://localhost:7028/api/course', {
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
        const returnValue = await getCourses();
        console.log('returnValue', returnValue);
        
            if ('error' in returnValue) {
      console.error(returnValue.error);
            const errorMessage = returnValue;

      // Optionally, handle error UI here
      return { error: errorMessage || 'Invalid Request' };
    }        
    setCourses(returnValue);
    
  
      };

      fetchData();
   
    //initial load 
  }, [])
  

         

  return (
    <>
     {courses.map((course) => {
      console.log(course.categoryName);
    <Card key={course.courseid}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar src={'/assets/logo-python.png'} variant="square" />
        </Box>
        <Stack spacing={1}>
          <Typography align="center" variant="h5">
            {course.courseName}
          </Typography>
          <Typography align="center" variant="body1">
            {course.courseIntro}
          </Typography>
           <Typography align="center" variant="body1">
            {course.categoryName}
          </Typography>
          <Typography align="center" variant="body1">
            {course.fee}
          </Typography>
        <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <ClockIcon fontSize="var(--icon-fontSize-sm)" />
            <Typography color="text.secondary" display="inline" variant="body2">
              Published {dayjs(course.PublishedDate).format('MMM D, YYYY')}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2 }}
        >
       
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <DownloadIcon fontSize="var(--icon-fontSize-sm)" />
          </Stack>
        </Stack>
      </Stack>
    </Card>
})}
</>

  );


}
