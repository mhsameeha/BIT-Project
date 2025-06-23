'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ArrowDown as ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { ArrowUp as ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import {ChalkboardTeacher as Session } from '@phosphor-icons/react/dist/ssr/ChalkboardTeacher';
import { User } from '@/types/user';


export interface WelcomeHereProps{

}

export function WelcomeHere(): React.JSX.Element {

      const [learnerDetails, setLearnerDetails] =  React.useState<User[]>([]);
    
    const getLearnerDetails = async ()  => {
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
            const returnValue = await getLearnerDetails();
            console.log('returnValue', returnValue);
            
                if ('error' in returnValue) {
          console.error(returnValue.error);
                const errorMessage = returnValue;
    
          // Optionally, handle error UI here
          return { error: errorMessage || 'Invalid Request' };
        } 
        setLearnerDetails(returnValue);
      
          };
    
          fetchData();
       
        //initial load 
      }, [])

  return (
    <Card >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>


            <Typography color="text.secondary" variant="overline" fontSize={20}>
               Hello, { "Sameeha "} 
              </Typography>    

          </Stack>

        </Stack>
      </CardContent>
    </Card>
  );
}
