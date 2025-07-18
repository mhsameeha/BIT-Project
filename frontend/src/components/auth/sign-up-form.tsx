'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z, z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';
import { Box } from '@mui/system';
import { Columns } from '@phosphor-icons/react';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import { DatePicker, DesktopDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { watch } from 'fs';


const schema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required' }),
  lastName: zod.string().min(1, { message: 'Last name is required' }),
  // dob: zod.string()
  // // .nonempty({ message: 'Date of Birth is required' })
  // .transform((val) => new Date(val))
  // .refine((date) => date > new Date(), {
  //   message: 'Date of Birth must be in the past',
  // }),
  dob: z.coerce
  .date({ required_error: 'Date of Birth is required' }) // Catch empty
  .max(new Date(), { message: 'Invalid Date of Birth' }),
  email: zod.string().min(1, { message: 'Enter a valid Email Address' }).email(),
  password: zod.string().min(1, { message: 'Password is Required' })
  .min(8, { message: "Password must be at least 8 characters long" }),
  role: zod.string().min(1,{message: 'Select your role'}),
  terms: zod.boolean().refine((value) => value, 'You must accept the terms and conditions'),
});



type Values = zod.infer<typeof schema>;

const defaultValues = { firstName: '', lastName: '', dob :new Date() , email: '', password: '', role: '', terms: false } satisfies Values;

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();

  const { checkSession } = useUser();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const [ role,setRole] = React.useState ('');
  // const [clicked, setClicked] = useState(false);

  
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });


  const handleClick =  (_role:string) => {
    
    console.log(_role);
    setValue('role', _role);
//  setRole(_role);

  };

  const onSubmit = React.useCallback(
    async (values: Values) => {
      setIsPending(true);

      const { error } = await authClient.signUp(values);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // UserProvider, for this case, will not refresh the router
      // After refresh, GuestGuard will handle the redirect
      router.refresh();
    },
    [checkSession, router, setError]
  );

  const formRole = watch('role');

  return (
    <Box component="section" sx={{ p: 10, pl:40, pr:40, border: '1px' }}>
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign up</Typography>
        <Typography color="text.secondary" variant="body2">
          Already have an account?{' '}
          <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
            Sign in
          </Link>
        </Typography>
      </Stack>

      <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
     
        <Stack spacing={2}>
      <Stack  direction ="row">
      <Controller
            control={control}
            name="role"
            render={() => (
              <FormControl error={Boolean(errors.role)}>
                <Button type= "button" value="Tutor" variant={ formRole === 'Tutor' ? 'contained' : 'outlined'} onClick = {() => handleClick('Tutor')} sx={{mr: 2}} >As a Tutor</Button>
          {errors.role ? <FormHelperText>{errors.role.message}</FormHelperText> : null} 

                
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="role"
            render={() => (
              <FormControl error={Boolean(errors.role)}>
                <Button id='lbotton' value="Learner" variant={formRole === 'Learner' ? 'contained' : 'outlined'} onClick = {() =>handleClick('Learner')}  sx={{mr: 2}} >As a Learner</Button>
          {errors.role ? <FormHelperText>{errors.role.message}</FormHelperText> : null} 

              </FormControl>
            )}
          /></Stack>
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
            control={control}
            name="dob"
            render={(field) => (
              <FormControl error={Boolean(errors.dob)}>
                <DatePicker label="Date of Birth" {...field} /> 
                {errors.dob ? <FormHelperText>{errors.dob.message}</FormHelperText> : null}
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
                <OutlinedInput {...field} label="Password" type="password" autoComplete='new-password' />
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
          <Button disabled={isPending} type="submit" variant="contained">
            Sign up
          </Button>
        </Stack>
      </form>
    </Stack>
    </Box>
  );
}
