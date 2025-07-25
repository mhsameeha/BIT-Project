'use client'
import * as React from 'react';
import { useCallback, useState, useMemo } from 'react';
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
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { config } from '@/config';
import { getPaymentApprovals, getPaymentStatus, getPaymentStatusApproved, getPaymentStatusRejected } from '@/Services/admin';
import { api } from '@/lib/api-client';
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
  amount: number;
}


export default function Page(): React.JSX.Element {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const tabLabels = ['Pending', 'Completed', 'Rejected', 'All'];

  // Filter and sort payments based on active tab
  const filteredPayments = useMemo(() => {
    let filtered = payments;
    
    // Filter by status based on active tab
    if (activeTab !== 3) { // Not "All" tab
      const statusMap = {
        0: 'pending verification',
        1: 'completed',
        2: 'rejected',
        3: 'all'
      };
      const targetStatus = statusMap[activeTab as keyof typeof statusMap];
      
      if (targetStatus === 'pending verification') {
        // Handle both "pending" and "pending verification" for pending tab
        filtered = payments.filter(payment => {
          const status = payment.status?.toLowerCase();
          return status === 'pending' || status === 'pending verification';
        });
      } else {
        filtered = payments.filter(payment => payment.status?.toLowerCase() === targetStatus);
      }
    }
    
    // Sort by payment date descending
    return filtered.sort((a, b) => {
      return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
    });
  }, [payments, activeTab]);

  // Paginated payments for current page
  const paginatedPayments = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredPayments.slice(startIndex, endIndex);
  }, [filteredPayments, page, rowsPerPage]);

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
            // setIsLoading(false);
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

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPage(0); // Reset to first page when changing tabs
  }, []);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleDownloadPaymentProof = useCallback(async (paymentId: string, learnerName: string) => {
    try {
      const response = await api.get(`/Admin/DownloadPaymentProof/${paymentId}`, {
        responseType: 'blob'
      });
      
      if (response instanceof Blob) {
        // Create blob link to download
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `payment-proof-${learnerName}-${paymentId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Response is not a Blob:', response);
      }
    } catch (error) {
      console.error('Error downloading payment proof:', error);
      // You could add a toast notification here to show error to user
    }
  }, []);

  const getStatusChip = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'completed':
        return <Chip color="success" label="Completed" size="small" />;
      case 'rejected':
        return <Chip color="error" label="Rejected" size="small" />;
      case 'pending':
      case 'pending verification':
      default:
        return <Chip color="warning" label="Pending Verification" size="small" />;
    }
  };

  // if (isLoading) {
        <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Loading Payment Approvals</Typography>
        </Stack>
        </Box>
  // }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Payment Approvals</Typography>
        
        {/* Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            aria-label="payment status tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {tabLabels.map((label) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>

          {/* Table */}
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Learner Name</TableCell>
                  <TableCell>Payment Type</TableCell>
                  <TableCell>Amount (LKR)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment Proof</TableCell>
                  <TableCell>Reference No</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPayments.map((payment) => (
                  <TableRow hover key={payment.paymentId}>
                    <TableCell>
                      <Typography variant="subtitle2">{payment.learnerName}</Typography>
                    </TableCell>
                    <TableCell>{payment.paymentType}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {payment.amount ? ` ${payment.amount.toFixed(2).toLocaleString()}` : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(payment.status?.toLowerCase())}</TableCell>
                    <TableCell>
                      <Link 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          void handleDownloadPaymentProof(payment.paymentId, payment.learnerName);
                        }}
                        download
                      >
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <DownloadIcon fontSize="small" />
                          <Typography variant="body2">Download</Typography>
                        </Stack>
                      </Link>
                    </TableCell>
                    <TableCell>{payment.referenceNo}</TableCell>
                    <TableCell>{dayjs(payment?.paymentDate).format('DD MMMM YYYY')}</TableCell>
                    <TableCell>
                      {(payment.status?.toLowerCase() === 'pending verification' || payment.status?.toLowerCase() === 'pending') && (
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            color="success"
                            onClick={() => {
                              handleApproveClick(payment);
                            }}
                            aria-label="approve"
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              handleRejectClick(payment);
                            }}
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
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredPayments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
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