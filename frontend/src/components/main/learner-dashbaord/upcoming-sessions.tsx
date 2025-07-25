'use client';

import * as React from 'react';
import { useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Avatar,
} from '@mui/material';
import dayjs, { type Dayjs } from 'dayjs';
import { joinRoom } from '@/components/main/session/jitsi-meet';
import { getUpcomingSessionsByLearner, type LearnerSession } from '@/Services/sessions';

interface JoinSessionProps {
  session: {
    status: string;
    roomName: string;
    time: Dayjs;
  };
  userName: string;
}

function JoinSessionButton({ session, userName }: JoinSessionProps): React.JSX.Element {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);

  const handleJoin = (): void => {
    if (session.status === "Confirmed" && jitsiContainerRef.current) {
      void joinRoom(jitsiContainerRef.current, session.roomName, userName);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        size="small"
        disabled={session.status !== "Confirmed" || session.time.isAfter(dayjs())}
        onClick={handleJoin}
      >
        Join Session
      </Button>

      <div
        ref={jitsiContainerRef}
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1000,
          backgroundColor: "#000",
        }}
      />
    </div>
  );
}

export function UpcomingSessions(): React.JSX.Element {
  const [sessions, setSessions] = React.useState<LearnerSession[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    const fetchSessions = async (): Promise<void> => {
      try {
        setLoading(true);
        const result = await getUpcomingSessionsByLearner();
        
        if ('error' in result) {
          setError(result.error);
        } else {
          setSessions(result);
        }
      } catch (err) {
        setError('Failed to load upcoming sessions');
      } finally {
        setLoading(false);
      }
    };

    void fetchSessions();
  }, []);

  const getStatusColor = (
    status: string
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'success';
      case 'rejected':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Upcoming Sessions</Typography>
          <Typography>Loading sessions...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Upcoming Sessions</Typography>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Upcoming Sessions</Typography>
            <Typography variant="body2" color="text.secondary">
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} scheduled
            </Typography>
          </Stack>
          
          {sessions.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tutor</TableCell>
                    <TableCell>Session</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Cost</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Meeting Link</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.sessionId} hover>
                      {/* Tutor Info */}
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {session.tutorName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {session.tutorName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {session.tutorEmail}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Session Name */}
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {session.sessionName}
                        </Typography>
                      </TableCell>

                      {/* Date & Time */}
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="body2">
                            {dayjs(session.startTime).format('MMM DD, YYYY')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dayjs(session.startTime).format('HH:mm')} - {dayjs(session.endTime).format('HH:mm')}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* Duration */}
                      <TableCell>
                        <Typography variant="body2">
                          {Math.round(dayjs(session.endTime).diff(dayjs(session.startTime), 'hour', true))}h
                        </Typography>
                      </TableCell>

                      {/* Cost */}
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {session.currency} {session.cost.toLocaleString()}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip 
                          label={session.sessionStatus} 
                          color={getStatusColor(session.sessionStatus)} 
                          size="small" 
                          variant="filled" 
                        />
                      </TableCell>

                      {/* Meeting Link */}
                      <TableCell align="center">
                        <JoinSessionButton 
                          session={{
                            status: session.sessionStatus,
                            roomName: session.sessionLink || session.sessionId,
                            time: dayjs(session.startTime)
                          }} 
                          userName="Learner" // This should come from user context
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              No upcoming sessions scheduled. Book a session with a tutor to get started!
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
