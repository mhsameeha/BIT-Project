'use client'
import * as React from 'react';
import { useCallback, useState } from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { config } from '@/config';
import { getPaymentApprovals, getPaymentStatusApproved, getPaymentStatusRejected } from '@/Services/admin';
import dayjs from 'dayjs';

// export const metadata = { title: `Payments | Approval | ${config.site.name}` } satisfies Metadata;

export interface Payment {
  paymentId: string;
  learnerName: string;
  paymentType: string;
  status: 'pending verification' | 'completed' | 'rejected';
  paymentProof: string;
  referenceNo: string;
  paymentDate: string;
  amount:number;
}


export default function Page(): React.JSX.Element {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const[isLoading, setIsLoading] = useState(true);

  React.useEffect(()=> {
    const fetchData = async () => {
       try {
            const paymentApprovals = await getPaymentApprovals();

            if ('error' in paymentApprovals) 
            {
                return 'error';
            }
            setPayments(paymentApprovals);
            console.log(paymentApprovals);
            setIsLoading(false);
        }
        catch {
            console.error('error')
        }
    }
    fetchData();
  }, []);


  const handleApproveClick = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
    setOpenApproveDialog(true);
  }, []);

  const handleRejectClick = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
    setOpenRejectDialog(true);
  }, []);

  const handleApproveConfirm = useCallback(() => {
    if (selectedPayment) {
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.paymentId === selectedPayment.paymentId ? { ...payment, status: 'completed' } : payment
        )
      );
    const paymentApproved =  getPaymentStatusApproved(selectedPayment.paymentId);

      // API call would go here
      console.log(`Approved payment ${selectedPayment.paymentId}`);
      setOpenApproveDialog(false);
    }
  }, [selectedPayment]);

  const handleRejectConfirm = useCallback(() => {
    if (selectedPayment) {
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.paymentId === selectedPayment.paymentId ? { ...payment, status: 'rejected' } : payment
        )
      );
      // API call would go here
       const paymentRejected =  getPaymentStatusRejected(selectedPayment.paymentId);
      console.log(`Rejected payment ${selectedPayment.paymentId}`);
      setOpenRejectDialog(false);
    }
  }, [selectedPayment]);

  const handleCloseDialog = useCallback(() => {
    setOpenApproveDialog(false);
    setOpenRejectDialog(false);
    setSelectedPayment(null);
  }, []);

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip color="success" label="Completed" size="small" />;
      case 'rejected':
        return <Chip color="error" label="Rejected" size="small" />;
      default:
        return <Chip color="warning" label="Pending Verification" size="small" />;
    }
  };

  if (isLoading) {
        <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Loading Payment Approvals</Typography>
        </Stack>
        </Box>
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Payment Approvals</Typography>
        
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Learner Name</TableCell>
                <TableCell>Payment Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Proof</TableCell>
                <TableCell>Reference No</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow hover key={payment.paymentId}>
                  <TableCell>
                    <Typography variant="subtitle2">{payment.learnerName}</Typography>
                  </TableCell>
                  <TableCell>{payment.paymentType}</TableCell>
                  <TableCell>{getStatusChip(payment.status?.toLowerCase())}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>
                    <Link href={payment.paymentProof} download>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <DownloadIcon fontSize="small" />
                        <Typography variant="body2">Download</Typography>
                      </Stack>
                    </Link>
                  </TableCell>
                  <TableCell>{payment.referenceNo}</TableCell>
                  <TableCell>{dayjs(payment?.paymentDate).format('DD MMMM YYYY')}</TableCell>
                  <TableCell>
                    {payment.status?.toLowerCase() === 'pending verification' && (
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          color="success"
                          onClick={() => handleApproveClick(payment)}
                          aria-label="approve"
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleRejectClick(payment)}
                          aria-label="reject"
                        >
                          <CloseIcon />
                        </IconButton>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Stack>

      {/* Approve Confirmation Dialog */}
      <Dialog
        open={openApproveDialog}
        onClose={handleCloseDialog}
        aria-labelledby="approve-dialog-title"
      >
        <DialogTitle id="approve-dialog-title">Confirm Approval</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve payment {selectedPayment?.referenceNo} from {selectedPayment?.learnerName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleApproveConfirm} color="success" variant="contained" autoFocus>
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={openRejectDialog}
        onClose={handleCloseDialog}
        aria-labelledby="reject-dialog-title"
      >
        <DialogTitle id="reject-dialog-title">Confirm Rejection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reject payment {selectedPayment?.referenceNo} from {selectedPayment?.learnerName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleRejectConfirm} color="error" variant="contained" autoFocus>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}