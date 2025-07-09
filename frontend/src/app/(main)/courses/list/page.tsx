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

import { CourseListItem } from '@/components/main/courses/course-list-item';
import { getAllCourses, type CourseData } from '@/constants/courses';


// Get unique categories from courses
const getAllCategories = (): string[] => {
  const categories = new Set<string>();
  getAllCourses().forEach(course => {
    categories.add(course.category);
  });
  return Array.from(categories).sort();
};

// Get unique levels from courses  
const getAllLevels = (): string[] => {
  const levels = new Set<string>();
  getAllCourses().forEach(course => {
    levels.add(course.level);
  });
  return Array.from(levels).sort();
};

// Search courses function
const searchCourses = (query: string): CourseData[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllCourses().filter(course => 
    course.title.toLowerCase().includes(lowercaseQuery) ||
    course.description.toLowerCase().includes(lowercaseQuery) ||
    course.category.toLowerCase().includes(lowercaseQuery) ||
    course.tutorName.toLowerCase().includes(lowercaseQuery) ||
    course.level.toLowerCase().includes(lowercaseQuery)
  );
};

export default function Page(): React.JSX.Element {
  const [courses, setCourses] = React.useState<CourseData[]>(getAllCourses());
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<string>('title');

  const allCategories = getAllCategories();
  const allLevels = getAllLevels();

  // Handle search and filtering
  React.useEffect(() => {
    let filteredCourses = getAllCourses();

    // Apply search filter
    if (searchQuery.trim()) {
      filteredCourses = searchCourses(searchQuery.trim());
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filteredCourses = filteredCourses.filter(course =>
        selectedCategories.includes(course.category)
      );
    }

    // Apply level filter
    if (selectedLevels.length > 0) {
      filteredCourses = filteredCourses.filter(course =>
        selectedLevels.includes(course.level)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'title':
        filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        filteredCourses.sort((a, b) => b.rating - a.rating);
        break;
      case 'students':
        filteredCourses.sort((a, b) => b.enrolledStudents - a.enrolledStudents);
        break;
      case 'fee':
        filteredCourses.sort((a, b) => a.fee - b.fee);
        break;
      case 'newest':
        filteredCourses.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      default:
        break;
    }

    setCourses(filteredCourses);
  }, [searchQuery, selectedCategories, selectedLevels, sortBy]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string[]>): void => {
    const value = event.target.value;
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
  };

  const handleLevelChange = (event: SelectChangeEvent<string[]>): void => {
    const value = event.target.value;
    setSelectedLevels(typeof value === 'string' ? value.split(',') : value);
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
            Explore Our Courses
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Discover courses taught by expert instructors across various subjects and skill levels
          </Typography>
        </div>

        {/* Search and Filters */}
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Search Input */}
            <Grid xs={12} lg={3}>
              <FormControl fullWidth>
                <InputLabel>Search courses</InputLabel>
                <OutlinedInput
                  startAdornment={<MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />}
                  label="Search courses"
                  placeholder="Search by title, instructor, category..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </FormControl>
            </Grid>

            {/* Category Filter */}
            <Grid xs={12} lg={2}>
              <FormControl fullWidth>
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  label="Categories"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {allCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Level Filter */}
            <Grid xs={12} lg={2}>
              <FormControl fullWidth>
                <InputLabel>Levels</InputLabel>
                <Select
                  multiple
                  value={selectedLevels}
                  onChange={handleLevelChange}
                  label="Levels"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {allLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sort By */}
            <Grid xs={12} lg={2}>
              <FormControl fullWidth>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort by"
                >
                  <MenuItem value="title">Title (A-Z)</MenuItem>
                  <MenuItem value="rating">Highest Rating</MenuItem>
                  <MenuItem value="students">Most Students</MenuItem>
                  <MenuItem value="fee">Lowest Fee</MenuItem>
                  <MenuItem value="newest">Recently Updated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        {/* Results */}
        <div>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {courses.length} {courses.length === 1 ? 'course' : 'courses'} found
          </Typography>
          
          {courses.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary" variant="body1">
                No courses found matching your criteria. Try adjusting your search or filters.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={1}>
              {courses.map((course) => (
                <Grid key={course.id} xs={12}>
                  <CourseListItem course={course} />
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      </Stack>
    </Box>
  );
}
