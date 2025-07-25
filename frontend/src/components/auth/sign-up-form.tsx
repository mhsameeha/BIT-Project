'use client';
import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { DatePicker, DesktopDatePicker } from '@mui/x-date-pickers';
import { Columns } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z, z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required' }),
  lastName: zod.string().min(1, { message: 'Last name is required' }),
  dob: z.coerce
    .date({ required_error: 'Date of Birth is required' }) // Catch empty
    .max(new Date(), { message: 'Invalid Date of Birth' }),
  email: zod.string().min(1, { message: 'Enter a valid Email Address' }).email(),
  password: zod
    .string()
    .min(1, { message: 'Password is Required' })
    .min(8, { message: 'Password must be at least 8 characters long' }),
  terms: zod.boolean().refine((value) => value, 'You must accept the terms and conditions'),
   role: zod.literal('Learner').default('Learner'),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  firstName: '',
  lastName: '',
  dob: new Date(),
  email: '',
  password: '',
  terms: false,
  role:'Learner'
} satisfies Values;

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();

  const { checkSession } = useUser();

  const [isPending, setIsPending] = React.useState<boolean>(false);


  const {
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });


  const onSubmit = React.useCallback(
    async (values: Values) => {
      setIsPending(true);
      control.register('role', { value: 'Learner' });
      const { error } = await authClient.signUp(values);
      console.log(values);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }
      router.push('/auth/sign-in')
      await checkSession?.();
      router.refresh();
    },
    [checkSession, router, setError]
  );


  return (
    <Box component="section" sx={{ p: 10, pl: 40, pr: 40, border: '1px' }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4">Sign up</Typography>
          <Typography color="text.secondary" variant="body2">
           
              Sign up {' '}
            <Link component={RouterLink} href={paths.auth.tutorSignUp} underline="hover" variant="subtitle2">
              As a Tutor
            </Link>
            <br />
            Already have an account?{' '}
            <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
              Sign in
            </Link>
      
          </Typography>
        </Stack>

        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormControl error={Boolean(errors.firstName)}>
                  <InputLabel>First name</InputLabel>
                  <OutlinedInput {...field} label="First name" />
                  {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormControl error={Boolean(errors.firstName)}>
                  <InputLabel>Last name</InputLabel>
                  <OutlinedInput {...field} label="Last name" />
                  {errors.lastName ? <FormHelperText>{errors.lastName.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <FormControl error={Boolean(errors.dob)} fullWidth>
                    <DatePicker
                      label="Date of Birth"
                      // value={dayjs || null}
                      onChange={(date) => field.onChange(date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: Boolean(errors.dob),
                          helperText: errors.dob?.message || '',
                        },
                      }}
                    />
                  </FormControl>
                )}
              />
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(errors.email)}>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput {...field} label="Email address" type="email" />
                  {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.password)}>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput {...field} label="Password" type="password" autoComplete="new-password" />
                  {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <div>
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label={
                      <React.Fragment>
                        I have read the <Link>terms and conditions</Link>
                      </React.Fragment>
                    }
                  />
                  {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
                </div>
              )}
            />
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
            <Button disabled={isPending} type='submit' variant="contained">
              Sign up
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}
