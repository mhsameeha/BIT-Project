'use client'
import * as React from 'react';
import { API_BASE_URL } from '@/config';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';
import { Tutors } from '@/types/tutor';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const statusMap = {
  Pending: { label: 'Pending', color: 'warning' },
  Approved: { label: 'Approved', color: 'success' },
  Rejected: { label: 'Rejected', color: 'error' },
} as const;

export interface Order {
  id: string;
  customer: { name: string };
  amount: number;
  status: 'pending' | 'delivered' | 'refunded';
  createdAt: Date;
}

export interface LatestOrdersProps {
  orders?: Order[];
  sx?: SxProps;
}

export function LatestOrders({ orders = [], sx }: LatestOrdersProps): React.JSX.Element {
 const [tutors, setTutors] =  React.useState<Tutors[]>([]);
 

const getAllTutors = async ()  => {
        try {

            // set this up after developing the API
            const response = await fetch(`${API_BASE_URL}/tutor/Tutors`, {
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
        const returnValue = await getAllTutors();
        console.log('returnValue', returnValue);
        
            if ('error' in returnValue) {
      console.error(returnValue.error);
            const errorMessage = returnValue;

      // Optionally, handle error UI here
      return { error: errorMessage || 'Invalid Request' };
    } 
    setTutors(returnValue);
  console.log(returnValue);
  
      };

      fetchData();
   
    //initial load 
  }, [])

const [approve, setApprove] = React.useState(false);
const [reject, setReject] = React.useState(false);


const handleClick = (request:string) => {
  if (request == 'approve'){
    setApprove(true);
    setReject(false);
  }
  else {
    setReject(true);
    setApprove(false);
  }


}
   

  return (
    <Card sx={sx}>

        <CardHeader title="Tutor List" />
       
   
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Tutor Name</TableCell>
                
              <TableCell>Approval Status</TableCell>
              {/* <TableCell sortDirection="desc">Date</TableCell> */}
              <TableCell>Approval Request</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tutors.map((tutor:Tutors) => {
              const { label, color } = statusMap[tutor.approvalStatus] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={tutor.tutorid}>
                  <TableCell>{tutor.tutorName}</TableCell>
                   <TableCell>
                    
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                 < TableCell>
             
                 <Button color='success' onClick={()=> handleClick('approve')} variant={approve ? 'contained':'outlined'} sx={{mr: 2}}>Approve</Button>
                 <Button color='error'onClick={()=> handleClick('reject')} variant={reject ? 'contained':'outlined'}>Reject</Button>

                 
                 </TableCell>
                  {/* <TableCell>{dayjs(order.createdAt).format('MMM D, YYYY')}</TableCell> */}
                 
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
       <Button variant='outlined'>Export to PDF</Button>
    </Card>
  );
}
