'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Plus, Trash } from '@phosphor-icons/react';

interface Education {
  id: string;
  qualification: string;
  institute: string;
  graduationDate: string;
}

export function Education(): React.JSX.Element {
  const [educations, setEducations] = React.useState<Education[]>([]);

  const handleAddEducation = (): void => {
    const newEducation: Education = {
      id: `edu-${Date.now()}`,
      qualification: '',
      institute: '',
      graduationDate: '',
    };
    setEducations([...educations, newEducation]);
  };

  const handleDeleteEducation = (id: string): void => {
    setEducations(educations.filter((edu) => edu.id !== id));
  };

  const handleEducationChange = (id: string, field: keyof Education, value: string): void => {
    setEducations(
      educations.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" color="text.primary">
              Educational Qualifications
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Plus size={14} />}
              onClick={handleAddEducation}
            >
              Add Qualification
            </Button>
          </Box>
          <Stack spacing={2}>
            {educations.map((education) => (
              <Card key={education.id} variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="caption" color="primary">
                      Education
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteEducation(education.id)}
                    >
                      <Trash size={12} />
                    </IconButton>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Qualification/Degree"
                        value={education.qualification}
                        onChange={(e) =>
                          handleEducationChange(education.id, 'qualification', e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Institute/University"
                        value={education.institute}
                        onChange={(e) =>
                          handleEducationChange(education.id, 'institute', e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Graduation Date (MM/YYYY)"
                        placeholder="06/2020"
                        value={education.graduationDate}
                        onChange={(e) =>
                          handleEducationChange(education.id, 'graduationDate', e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}