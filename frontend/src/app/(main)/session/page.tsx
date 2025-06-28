'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import { TutorListItem } from '@/components/main/session/tutor-list-item';
import { getAllTutors, getAllSpecialties, searchTutors, type TutorData } from '@/constants/tutors';

export default function Page(): React.JSX.Element {
  const [tutors, setTutors] = React.useState<TutorData[]>(getAllTutors());
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedSpecialties, setSelectedSpecialties] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<string>('name');

  const allSpecialties = getAllSpecialties();

  // Handle search and filtering
  React.useEffect(() => {
    let filteredTutors = getAllTutors();

    // Apply search filter
    if (searchQuery.trim()) {
      filteredTutors = searchTutors(searchQuery.trim());
    }

    // Apply specialty filter
    if (selectedSpecialties.length > 0) {
      filteredTutors = filteredTutors.filter(tutor =>
        selectedSpecialties.some(specialty =>
          tutor.specialties.some(tutorSpecialty =>
            tutorSpecialty.toLowerCase().includes(specialty.toLowerCase())
          )
        )
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        filteredTutors.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filteredTutors.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience':
        filteredTutors.sort((a, b) => b.sessionsCompleted - a.sessionsCompleted);
        break;
      case 'rate':
        filteredTutors.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      default:
        break;
    }

    setTutors(filteredTutors);
  }, [searchQuery, selectedSpecialties, sortBy]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
  };

  const handleSpecialtyChange = (event: SelectChangeEvent<string[]>): void => {
    const value = event.target.value;
    setSelectedSpecialties(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSortChange = (event: SelectChangeEvent): void => {
    setSortBy(event.target.value);
  };

  return (
    <Box sx={{ maxWidth: 'var(--Content-maxWidth)', m: 'var(--Content-margin)', p: 'var(--Content-padding)', width: 'var(--Content-width)' }}>
      <Stack spacing={4}>
        {/* Header */}
        <div>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Find Your Perfect Tutor
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Schedule 1-on-1 sessions with expert tutors in your field of interest
          </Typography>
        </div>

        {/* Search and Filters */}
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Search Input */}
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Search tutors</InputLabel>
                <OutlinedInput
                  startAdornment={<MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />}
                  label="Search tutors"
                  placeholder="Search by name, expertise, education..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </FormControl>
            </Grid>

            {/* Specialty Filter */}
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Specialties</InputLabel>
                <Select
                  multiple
                  value={selectedSpecialties}
                  onChange={handleSpecialtyChange}
                  label="Specialties"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {allSpecialties.map((specialty) => (
                    <MenuItem key={specialty} value={specialty}>
                      {specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sort By */}
            <Grid xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort by"
                >
                  <MenuItem value="name">Name (A-Z)</MenuItem>
                  <MenuItem value="rating">Highest Rating</MenuItem>
                  <MenuItem value="experience">Most Experienced</MenuItem>
                  <MenuItem value="rate">Lowest Rate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        {/* Results */}
        <div>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {tutors.length} {tutors.length === 1 ? 'tutor' : 'tutors'} found
          </Typography>
          
          {tutors.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary" variant="body1">
                No tutors found matching your criteria. Try adjusting your search or filters.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {tutors.map((tutor) => (
                <Grid key={tutor.id} xs={12}>
                  <TutorListItem tutor={tutor} />
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      </Stack>
    </Box>
  );
}