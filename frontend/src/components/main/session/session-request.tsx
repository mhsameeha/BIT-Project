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
import Divider from '@mui/material/Divider';

export interface SessionRequestsProps{
  diff?: number;
  trend: 'up' | 'down';
  sx?: SxProps;
  value: string;
}

export function SessionRequests({ diff, trend, sx, value }: SessionRequestsProps): React.JSX.Element {
  const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  const trendColor = trend === 'up' ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)';

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Session Requests
              </Typography>  
            </Stack>
           

          </Stack>
          <Divider/>
          {diff ? (
            <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
              <Stack sx={{ alignItems: 'center' }} direction="row" spacing={0.5}>
              
                <Typography color={trendColor} variant="body2">
     
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="caption">
 
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}