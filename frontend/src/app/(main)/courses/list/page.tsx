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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import { CourseListItem } from '@/components/main/courses/course-list-item';
import { getAllCategories, getAllLevels, getAllCourses } from '@/Services/courses';
import type { Category } from '@/types/category';
import type { PaginatedCourse, TutorCourse } from '@/types/course';
import type { Level } from '@/types/level';


export default function Page(): React.JSX.Element {
  const [paginatedCourses, setPaginatedCourses] = React.useState<PaginatedCourse>();
  const [filteredCourses, setFilteredCourses] = React.useState<TutorCourse[]>([]);

  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [allCategories, setAllCategories] = React.useState<Category[]>([]);

  const [selectedLevels, setSelectedLevels] = React.useState<string[]>([]);
  const [levels, setLevels] = React.useState<Level[]>([]);

  const [sortBy, setSortBy] = React.useState<string>('title');
  const [showOnlyEnrolled, setShowOnlyEnrolled] = React.useState<boolean>(false);

  // Pagination state
  const [page, setPage] = React.useState(1);
  const pageSize = 100;

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const returnValue = await getAllCategories();
      if ('error' in returnValue) {
        // Optionally, handle error UI here
        return;
      }
      setAllCategories(returnValue);
    };
    void fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const returnValue = await getAllLevels();
      if ('error' in returnValue) {
        // Optionally, handle error UI here
        return;
      }
      setLevels(returnValue);
    };
    void fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const returnValue = await getAllCourses(page);
      if ('error' in returnValue) {
        // Optionally, handle error UI here
        return;
      }

        setPaginatedCourses(returnValue);

    };
    void fetchData();
  }, [page]);

  // Apply search and filtering to the loaded courses
  React.useEffect(() => {
    if (!paginatedCourses?.courses) {
      setFilteredCourses([]);
      return;
    }

    let filtered = [...paginatedCourses.courses];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(query) ||
        course.introduction.toLowerCase().includes(query) ||
        course.categoryName.toLowerCase().includes(query) ||
        course.tutorName.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(course =>
        selectedCategories.includes(course.categoryName)
      );
    }

    // Apply level filter
    if (selectedLevels.length > 0) {
      filtered = filtered.filter(course =>
        selectedLevels.includes(course.courseDifficultyName)
      );
    }

    // Apply enrolled courses filter
    if (showOnlyEnrolled) {
      // Note: This assumes enrolledStudents > 0 indicates the user is enrolled
      // You may need to adjust this logic based on your actual enrollment data structure
      filtered = filtered.filter(course => course.havingEnrollment);
    }

    // Apply sorting
    switch (sortBy) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        // Rating sorting - if rating field exists
        break;
      case 'students':
        // Student count sorting - if enrolledStudents field exists
        break;
      case 'fee':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.updatedDate || b.createdDate).getTime() - new Date(a.updatedDate || a.createdDate).getTime());
        break;
      default:
        break;
    }

    setFilteredCourses(filtered);
  }, [paginatedCourses, searchQuery, selectedCategories, selectedLevels, sortBy, showOnlyEnrolled]);


  // // Handle search and filtering
  // React.useEffect(() => {
  //   let filteredCourses = getAllCourses();

  //   // Apply search filter
  //   if (searchQuery.trim()) {
  //     filteredCourses = searchCourses(searchQuery.trim());
  //   }

  //   // Apply category filter
  //   if (selectedCategories.length > 0) {
  //     filteredCourses = filteredCourses.filter(course =>
  //       selectedCategories.includes(course.category)
  //     );
  //   }

  //   // Apply level filter
  //   if (selectedLevels.length > 0) {
  //     filteredCourses = filteredCourses.filter(course =>
  //       selectedLevels.includes(course.level)
  //     );
  //   }

  //   // Apply sorting
  //   switch (sortBy) {
  //     case 'title':
  //       filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
  //       break;
  //     case 'rating':
  //       filteredCourses.sort((a, b) => b.rating - a.rating);
  //       break;
  //     case 'students':
  //       filteredCourses.sort((a, b) => b.enrolledStudents - a.enrolledStudents);
  //       break;
  //     case 'fee':
  //       filteredCourses.sort((a, b) => a.fee - b.fee);
  //       break;
  //     case 'newest':
  //       filteredCourses.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  //       break;
  //     default:
  //       break;
  //   }

  //   setCourses(filteredCourses);
  // }, [searchQuery, selectedCategories, selectedLevels, sortBy]);

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

  const handleEnrolledFilterChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setShowOnlyEnrolled(event.target.checked);
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
                  {allCategories.map((category:Category) => (
                    <MenuItem key={category.categoryId} value={category.categoryName}>
                      {category.categoryName}
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
                  {levels.map((level:Level) => (
                    <MenuItem key={level.courseDifficultyId} value={level.courseDifficultyName}>
                      {level.courseDifficultyName}
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

            {/* Show Only Enrolled Checkbox */}
            <Grid xs={12} lg={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showOnlyEnrolled}
                      onChange={handleEnrolledFilterChange}
                      color="primary"
                    />
                  }
                  label="Show only Enrolled Courses"
                />
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Results */}
        <div>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
          </Typography>
          
          {filteredCourses.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary" variant="body1">
                No courses found matching your criteria. Try adjusting your search or filters.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={1}>
              {filteredCourses.map((course: TutorCourse) => (
                <Grid key={course.courseId} xs={12}>
                  <CourseListItem course={{
                    ...course,
                    languages: typeof course.languages === 'string' ? [course.languages] : course.languages
                  }} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Pagination Controls */}
          {/* <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2, justifyContent: 'end' }}>
            <Typography variant="body2">
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={page === 1}
              style={{ padding: '4px 12px', borderRadius: 4, border: '1px solid #ccc', background: page === 0 ? '#eee' : '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </Button>
            <Button
              onClick={() => setPage((prev) => (prev + 1 < Math.ceil((paginatedCourses?.courses??[]).length / pageSize) ? prev + 1 : prev))}
              disabled={page >= Math.ceil((paginatedCourses?.courses??[]).length / totalPages)}
              style={{ padding: '4px 12px', borderRadius: 4, border: '1px solid #ccc', background: page + 1 >= Math.ceil((paginatedCourses?.courses??[]).length / pageSize) ? 'not-allowed' : 'pointer' }}
            >
              Next
            </Button>
          </Box> */}
        </div>
      </Stack>
    </Box>
  );
}