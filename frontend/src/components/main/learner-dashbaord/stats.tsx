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
import Divider from '@mui/material/Divider';


export interface Statistics{

}

export function Statistics(): React.JSX.Element {


  return (
    <Card >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
         <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Statistics
              </Typography>  
            </Stack>
            


              <Session size={32} color="#ffffff" />

          </Stack>
<Divider/>
        </Stack>
      </CardContent>
    </Card>
  );
}
