'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid'; // Correct stable Grid import
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Plus, Trash } from '@phosphor-icons/react';

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

const user = {
  name: 'Sofia Rivers',
  avatar: '/assets/avatar.png',
  jobTitle: 'Senior Developer',
  country: 'USA',
  city: 'Los Angeles',
  timezone: 'GTM-7',
} as const;

export function AccountDetailsForm(): React.JSX.Element {
  const [experiences, setExperiences] = React.useState<Experience[]>([]);
  const [educations, setEducations] = React.useState<Education[]>([]);
  // Experience handlers
  const handleAddExperience = (): void => {
    setExperiences([...experiences, {
      id: `exp-${Date.now()}`,
      position: '',
      company: '',
      timePeriod: '',
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

  // Education handlers
  const handleAddEducation = (): void => {
    setEducations([...educations, {
      id: `edu-${Date.now()}`,
      qualification: '',
      institute: '',
      graduationDate: '',
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

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar src={user.avatar} sx={{ height: '80px', width: '80px' }} />
            <Stack spacing={1} sx={{ textAlign: 'center' }}>
              <Typography variant="h5">{user.name}</Typography>
              <Typography color="text.secondary" variant="body2">
                {user.city} {user.country}
              </Typography>
            </Stack>
            <Button 
              component="label"
              variant="outlined"
              size="small"
              sx={{
                maxWidth: '200px',
                alignSelf: 'center',
                textTransform: 'none',
                mb: 2
              }}
            >
              Change Photo
              <input type="file" hidden accept="image/*" />
            </Button>
          </Stack>


          <Grid container spacing={3}>
            {/* Personal Info */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>First name</InputLabel>
                <OutlinedInput defaultValue="Sofia" label="First name" name="firstName" />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput defaultValue="Rivers" label="Last name" name="lastName" />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput defaultValue="sofia@devias.io" label="Email address" name="email" />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <DatePicker label="Date of Birth" />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="About Tutor" placeholder="About me" />
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
                <Stack spacing={3}>
                  {experiences.map((experience) => (
                    <Card key={experience.id} variant="outlined">
                      <CardContent>
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
                <Stack spacing={3}>
                  {educations.map((education) => (
                    <Card key={education.id} variant="outlined">
                      <CardContent>
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
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button variant="contained" size="large">Save Profile</Button>
        </CardActions>
      </Card>
    </form>
  );
}