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
import { Box, Card, CardContent, Chip, Divider, Grid, IconButton, ListItemText, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Plus, Trash } from '@phosphor-icons/react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';
import { Speciality } from '@/types/speciality';
import { getAllSpecialties } from '@/Services/courses';

 interface Experience {
  id: string;
  position: string;
  company: string;
  timePeriod: string;
}

 interface Education {
  id: string;
  qualification: string;
  institute: string;
  graduationDate: string;
}

 interface Language {
  id: string;
  name: string;
  proficiency: string;
}

const schema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required' }),
  lastName: zod.string().min(1, { message: 'Last name is required' }),
//   dob: zod.date({ required_error: 'Date of Birth is required' })
//     .max(new Date(), { message: 'Invalid Date of Birth' }),
specialities: zod.string().min(1, { message: 'Select at least one' }),
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),
  about: zod.string().optional(),
  rate: zod.number().min(1, { message: 'Rate is required' }),
  terms: zod.boolean().refine((value) => value, 'You must accept terms'),
  languages: zod.array(zod.object({
    name: zod.string().min(1, { message: 'Language is required' }),
    proficiency: zod.string().min(1, { message: 'Proficiency is required' })
  })).optional(),
  experiences: zod.array(zod.object({
    position: zod.string().min(1, { message: 'Position is required' }),
    company: zod.string().min(1, { message: 'Company is required' }),
    timePeriod: zod.string().min(1, { message: 'Time period is required' })
  })).optional(),
  educations: zod.array(zod.object({
    qualification: zod.string().min(1, { message: 'Qualification is required' }),
    institute: zod.string().min(1, { message: 'Institute is required' }),
    graduationDate: zod.string().min(1, { message: 'Graduation date is required' })
  })).optional()
});

type FormValues = zod.infer<typeof schema>;

export function TutorRegistrationForm(): React.JSX.Element {
  const router = useRouter();
  const { checkSession } = useUser();
  const [isPending, setIsPending] = React.useState(false);
  const [languages, setLanguages] = React.useState<Language[]>([]);
  const [experiences, setExperiences] = React.useState<Experience[]>([]);
  const [educations, setEducations] = React.useState<Education[]>([]);
  const [allSpecialities,setAllSpecialties] = React.useState<Speciality[]>([]);
  const [selectedSpeciality,setSelectedSpeciality] = React.useState<string[]>([]);


  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      about: '',
      rate: 0,
      terms: false,
      languages: [],
      experiences: [],
      educations: [],
      specialities:'',
    }
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const returnValue = await getAllSpecialties();
      if ('error' in returnValue) {
        // Optionally, handle error UI here
        return;

      }

      console.log(returnValue);
      setAllSpecialties(returnValue);
    };
     fetchData();
  }, []);

  const handleAddLanguage = (): void => {
    setLanguages([...languages, {
      id: `lang-${Date.now()}`,
      name: '',
      proficiency: ''
    }]);
  };

  const handleDeleteLanguage = (id: string): void => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  const handleLanguageChange = (id: string, field: keyof Language, value: string): void => {
    setLanguages(languages.map(lang => 
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  const handleSpecialityChange = (event: SelectChangeEvent<string[]>): void => {
    const value = event.target.value;
    setSelectedSpeciality(typeof value === 'string' ? value.split(',') : value);
  };


   const handleAddSpeciality = (): void => {
    setAllSpecialties([...allSpecialities, {
      specialityId: `exp-${Date.now()}`,
      specialityName: '',
    }]);
  };

    const handleAddExperience = (): void => {
    setExperiences([...experiences, {
      id: `exp-${Date.now()}`,
      position: '',
      company: '',
      timePeriod: ''
    }]);
  };
  const handleDeleteExperience = (id: string): void => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const handleExperienceChange = (id: string, field: keyof Experience, value: string): void => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const handleAddEducation = (): void => {
    setEducations([...educations, {
      id: `edu-${Date.now()}`,
      qualification: '',
      institute: '',
      graduationDate: ''
    }]);
  };

  const handleDeleteEducation = (id: string): void => {
    setEducations(educations.filter(edu => edu.id !== id));
  };

  const handleEducationChange = (id: string, field: keyof Education, value: string): void => {
    setEducations(educations.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const onSubmit = async (data: FormValues): Promise<void> => {
  setIsPending(true);
  
  try {
    const success = await authClient.tutorSignUp({
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
      email: data.email,
      password: data.password,
      role: 'Tutor',
      tutorDescription: data.about || '',
      tutorRate: data.rate,
      status: 'Pending', // Assuming new tutors need approval
      approvalRequestDate: new Date(),
      specialities: allSpecialities.map(spec => ({
        specialityId: spec.specialityId,
        specialityName: spec.specialityName,
      })),
      experience: experiences.map(exp => ({
        position: exp.position,
        company: exp.company,
        timePeriod: exp.timePeriod
      })),
      education: educations.map(edu => ({
        qualification: edu.qualification,
        institute: edu.institute,
        graduationDate: edu.graduationDate
      })),
      language: languages.map(lang => ({
        name: lang.name,
        proficiency: lang.proficiency
      }))
    });

    if (success.error) {
      setError('root', { type: 'server', message: success.error });
      return;
    }
    console.log("tutor", success)

    await checkSession?.();
    router.refresh();
    router.push('/auth/sign-in');
  } catch (err) {
    setError('root', { 
      type: 'server', 
      message: err instanceof Error ? err.message : 'An unexpected error occurred'
    });
  } finally {
    setIsPending(false);
  }
};

  return (
    <Box component="section" sx={{  p: 10, pl: 40, pr: 40, border: '1px'  }}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h4">Tutor Registration</Typography>
            <Typography color="text.secondary" variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
                Sign in
              </Link>
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                {/* Basic Info */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.firstName)}>
                        <InputLabel>First name</InputLabel>
                        <OutlinedInput {...field} label="First name" />
                        {errors.firstName && <FormHelperText>{errors.firstName.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.lastName)}>
                        <InputLabel>Last name</InputLabel>
                        <OutlinedInput {...field} label="Last name" />
                        {errors.lastName && <FormHelperText>{errors.lastName.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="dob"
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.dob)}>
                        <DatePicker
                          label="Date of Birth"
                          onChange={field.onChange}
                          slotProps={{
                            textField: {
                              error: Boolean(errors.dob),
                              helperText: errors.dob?.message
                            }
                          }}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.email)}>
                        <InputLabel>Email address</InputLabel>
                        <OutlinedInput {...field} label="Email address" type="email" />
                        {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.password)}>
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput {...field} label="Password" type="password" />
                        {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="rate"
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.rate)}>
                        <InputLabel>Rate per session ($)</InputLabel>
                        <OutlinedInput 
                          {...field} 
                          label="Rate per session ($)" 
                          type="number"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        {errors.rate && <FormHelperText>{errors.rate.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                        <Grid item xs={12} lg={6}>
                        <Controller
                            control={control}
                            name="specialities"
                            defaultValue={''} // Important for multi-select
                            render={({ field }) => (
                            <FormControl fullWidth error={Boolean(errors.specialities)}>
                                <InputLabel>Speciality</InputLabel>
                                <Select
                                {...field}
                                // multiple
                                label="Speciality"
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {/* {selected.map((value, index) => ( */}
                                        <Chip key={selected} label={selected} size="small" />
                                     {/* ))} */}
                                 
                                    </Box>
                                )}
                                >
                                {allSpecialities.map((speciality: Speciality) => (
                                    <MenuItem 
                                    key={speciality.specialityId} 
                                    value={speciality.specialityName}
                                    >
                                    <Checkbox checked={field.value.includes(speciality.specialityName)} />
                                    {speciality.specialityName}
                                    </MenuItem>
                                ))}
                                </Select>
                                {errors.specialities && (
                                <FormHelperText>{errors.specialities.message}</FormHelperText>
                                )}
                            </FormControl>
                            )}
                        />
                        </Grid>

                    

                {/* Languages Section */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Languages</Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Plus size={14} />}
                        onClick={handleAddLanguage}
                      >
                        Add Language
                      </Button>
                    </Box>
                    <Stack spacing={2}>
                      {languages.map((language) => (
                        <Card key={language.id} variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteLanguage(language.id)}
                              >
                                <Trash size={16} />
                              </IconButton>
                            </Box>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Language"
                                  value={language.name}
                                  onChange={(e) => handleLanguageChange(language.id, 'name', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Proficiency"
                                  value={language.proficiency}
                                  onChange={(e) => handleLanguageChange(language.id, 'proficiency', e.target.value)}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </Box>
                </Grid>

                {/* Experience Section */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Professional Experience</Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Plus size={14} />}
                        onClick={handleAddExperience}
                      >
                        Add Experience
                      </Button>
                    </Box>
                    <Stack spacing={2}>
                      {experiences.map((experience) => (
                        <Card key={experience.id} variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteExperience(experience.id)}
                              >
                                <Trash size={16} />
                              </IconButton>
                            </Box>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Position"
                                  value={experience.position}
                                  onChange={(e) => handleExperienceChange(experience.id, 'position', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Company"
                                  value={experience.company}
                                  onChange={(e) => handleExperienceChange(experience.id, 'company', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Time Period"
                                  placeholder="2020-2023"
                                  value={experience.timePeriod}
                                  onChange={(e) => handleExperienceChange(experience.id, 'timePeriod', e.target.value)}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </Box>
                </Grid>

                {/* Education Section */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Education</Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Plus size={14} />}
                        onClick={handleAddEducation}
                      >
                        Add Education
                      </Button>
                    </Box>
                    <Stack spacing={2}>
                      {educations.map((education) => (
                        <Card key={education.id} variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteEducation(education.id)}
                              >
                                <Trash size={16} />
                              </IconButton>
                            </Box>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Degree"
                                  value={education.qualification}
                                  onChange={(e) => handleEducationChange(education.id, 'qualification', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Institution"
                                  value={education.institute}
                                  onChange={(e) => handleEducationChange(education.id, 'institute', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Graduation Date"
                                  placeholder="June 2020"
                                  value={education.graduationDate}
                                  onChange={(e) => handleEducationChange(education.id, 'graduationDate', e.target.value)}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </Box>
                </Grid>

                {/* Terms and Submit */}
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="terms"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.terms)}>
                        <FormControlLabel
                          control={<Checkbox {...field} />}
                          label={
                            <React.Fragment>
                              I agree to the <Link href="#">terms and conditions</Link>
                            </React.Fragment>
                          }
                        />
                        {errors.terms && <FormHelperText>{errors.terms.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                {errors.root && (
                  <Grid item xs={12}>
                    <Alert severity="error">{errors.root.message}</Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isPending}
                  >
                    {isPending ? 'Registering...' : 'Register as Tutor'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}