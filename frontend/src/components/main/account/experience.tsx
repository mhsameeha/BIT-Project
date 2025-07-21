'use client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Plus, Trash } from '@phosphor-icons/react';
import React from 'react';

interface Experience {
  id: string;
  position: string;
  company: string;
  timePeriod: string;
}

export function Experience(): React.JSX.Element {
  const [experiences, setExperiences] = React.useState<Experience[]>([]);

  const handleAddExperience = (): void => {
    const newExperience: Experience = {
      id: `exp-${Date.now()}`,
      position: '',
      company: '',
      timePeriod: '',
    };
    setExperiences([...experiences, newExperience]);
  };

  const handleDeleteExperience = (id: string): void => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const handleExperienceChange = (id: string, field: keyof Experience, value: string): void => {
    setExperiences(
      experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" color="text.primary">
              Professional Experience
            </Typography>
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
              <Card key={experience.id} variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="caption" color="primary">
                      Experience
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteExperience(experience.id)}
                    >
                      <Trash size={12} />
                    </IconButton>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Position"
                        value={experience.position}
                        onChange={(e) =>
                          handleExperienceChange(experience.id, 'position', e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Company"
                        value={experience.company}
                        onChange={(e) =>
                          handleExperienceChange(experience.id, 'company', e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Time Period (e.g., 2020-2023)"
                        value={experience.timePeriod}
                        onChange={(e) =>
                          handleExperienceChange(experience.id, 'timePeriod', e.target.value)
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