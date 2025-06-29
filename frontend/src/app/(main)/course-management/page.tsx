'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Rating,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Books,
  PencilSimple,
  Trash,
  Plus,
  Eye,
  Star,
  MagnifyingGlass,
  Users,
  Clock,
  Student,
  CurrencyDollar,
} from '@phosphor-icons/react/dist/ssr';
import dayjs from 'dayjs';

import {
  getCoursesByTutor,
  deleteCourse,
} from '../../../constants/courses';
import type { TutorCourse } from '../../../types/course';

interface CourseCardProps {
  course: TutorCourse;
  onEdit: (course: TutorCourse) => void;
  onDelete: (course: TutorCourse) => void;
  onViewDetails: (course: TutorCourse) => void;
  onNavigateToDetails: (course: TutorCourse) => void;
}

function CourseCard({ course, onEdit, onDelete, onViewDetails, onNavigateToDetails }: CourseCardProps): React.JSX.Element {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Course Image */}
          <Grid item xs={12} sm="auto">
            <Avatar
              src={course.logo}
              sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
            >
              <Books size={32} />
            </Avatar>
          </Grid>

          {/* Course Info */}
          <Grid item xs={12} sm>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography 
                  variant="h6" 
                  fontWeight="medium"
                  onClick={() => { onNavigateToDetails(course); }}
                  sx={{ 
                    cursor: 'pointer',
                    color: 'primary.main',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {course.title}
                </Typography>
                <Chip
                  label={course.isEnabled ? 'Enabled' : 'Disabled'}
                  color={course.isEnabled ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                {course.category} • {course.level}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {course.description}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={course.rating} readOnly size="small" precision={0.1} />
                <Typography variant="body2" color="text.secondary">
                  {course.rating} ({course.reviewCount} reviews)
                </Typography>
              </Box>

              {/* Course Stats with Icons */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Users size={16} color="#666" />
                    <Typography variant="body2" color="text.secondary">
                      {course.enrolledStudents} students
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Clock size={16} color="#666" />
                    <Typography variant="body2" color="text.secondary">
                      {course.totalDuration}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Student size={16} color="#666" />
                    <Typography variant="body2" color="text.secondary">
                      {course.totalLessons} lessons
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CurrencyDollar size={16} color="#666" />
                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                      {course.currency} {course.fee}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Last Updated */}
              <Typography variant="caption" color="text.secondary">
                Last updated: {dayjs(course.updatedAt).format('MMM DD, YYYY')}
              </Typography>
            </Stack>
          </Grid>
          {/* Actions */}
          <Grid item xs={12} sm="auto">
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="View Details">
                <IconButton size="small" onClick={() => { onViewDetails(course); }}>
                  <Eye size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Course">
                <IconButton size="small" color="primary" onClick={() => { onEdit(course); }}>
                  <PencilSimple size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Course">
                <IconButton size="small" color="error" onClick={() => { onDelete(course); }}>
                  <Trash size={18} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default function CourseManagementPage(): React.JSX.Element {
  // Mock current tutor ID - in real app, this would come from authentication
  const currentTutorId = 'TUTOR-001';
  const router = useRouter();
  
  const [courses, setCourses] = React.useState<TutorCourse[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedCourse, setSelectedCourse] = React.useState<TutorCourse | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [courseToDelete, setCourseToDelete] = React.useState<TutorCourse | null>(null);

  React.useEffect(() => {
    // Load courses for current tutor
    const tutorCourses = getCoursesByTutor(currentTutorId);
    setCourses(tutorCourses);
  }, [currentTutorId]);

  const handleAddCourse = (): void => {
    // Navigate to add course page
    router.push('/course-management/add');
  };

  const handleNavigateToDetails = (course: TutorCourse): void => {
    // Navigate to course details page
    router.push(`/course-management/${course.id}`);
  };

  const handleEditCourse = (course: TutorCourse): void => {
    // TODO: Navigate to edit course page or open edit course dialog
    // eslint-disable-next-line no-console -- Temporary placeholder for development
    console.log('Edit course:', course.id);
  };

  const handleDeleteCourse = (course: TutorCourse): void => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = (): void => {
    if (courseToDelete) {
      const success = deleteCourse(courseToDelete.id);
      if (success) {
        // Refresh courses
        const updatedCourses = getCoursesByTutor(currentTutorId);
        setCourses(updatedCourses);
        setDeleteDialogOpen(false);
        setCourseToDelete(null);
      }
    }
  };

  const handleViewDetails = (course: TutorCourse): void => {
    setSelectedCourse(course);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = (): void => {
    setViewDialogOpen(false);
    setSelectedCourse(null);
  };

  const handleCloseDeleteDialog = (): void => {
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  const enabledCourses = courses.filter(course => course.isEnabled);
  const totalStudents = courses.reduce((sum, course) => sum + course.enrolledStudents, 0);
  const averageRating = courses.length > 0 
    ? courses.reduce((sum, course) => sum + course.rating, 0) / courses.length 
    : 0;

  // Filter courses based on search query
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Course Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your courses, content, and student enrollments
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={handleAddCourse}
            size="large"
          >
            Add Course
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main">
                  {courses.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Courses
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {enabledCourses.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Courses
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {totalStudents}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Students
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography variant="h4" color="warning.main">
                    {averageRating.toFixed(1)}
                  </Typography>
                  <Star size={24} weight="fill" style={{ color: '#f59e0b' }} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Average Rating
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search Bar and Course List */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Your Courses
            </Typography>
            <TextField
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); }}
              sx={{ minWidth: 300 }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlass size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          {filteredCourses.length > 0 ? (
            <Stack spacing={0}>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                  onViewDetails={handleViewDetails}
                  onNavigateToDetails={handleNavigateToDetails}
                />
              ))}
            </Stack>
          ) : searchQuery ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <MagnifyingGlass size={64} style={{ color: '#ccc', marginBottom: 16 }} />
                <Typography variant="h6" gutterBottom>
                  No courses found
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  No courses match your search criteria &ldquo;{searchQuery}&rdquo;
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => { setSearchQuery(''); }}
                  sx={{ mt: 2 }}
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <Books size={64} style={{ color: '#ccc', marginBottom: 16 }} />
                <Typography variant="h6" gutterBottom>
                  No courses yet
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Create your first course to start teaching students
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Plus size={20} />}
                  onClick={handleAddCourse}
                  sx={{ mt: 2 }}
                >
                  Create First Course
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* View Course Details Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={handleCloseViewDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Course Details</DialogTitle>
          <DialogContent>
            {selectedCourse ? (
              <Stack spacing={3} sx={{ mt: 1 }}>
                {/* Course Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={selectedCourse.logo}
                    sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
                  >
                    <Books size={32} />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" gutterBottom>
                      {selectedCourse.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {selectedCourse.category} • {selectedCourse.level}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Rating value={selectedCourse.rating} readOnly size="small" precision={0.1} />
                      <Typography variant="body2" color="text.secondary">
                        {selectedCourse.rating} ({selectedCourse.reviewCount} reviews)
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={selectedCourse.isEnabled ? 'Active' : 'Disabled'}
                    color={selectedCourse.isEnabled ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Box>

                {/* Course Info */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {selectedCourse.description}
                  </Typography>
                </Box>

                {/* Course Stats */}
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="primary.main">
                        {selectedCourse.enrolledStudents}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Students
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="info.main">
                        {selectedCourse.totalLessons}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lessons
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="warning.main">
                        {selectedCourse.totalDuration}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duration
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="success.main">
                        {selectedCourse.currency} {selectedCourse.fee}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Price
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Tags */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedCourse.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                {/* Course Dates */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Created:
                    </Typography>
                    <Typography variant="body1">
                      {dayjs(selectedCourse.createdAt).format('MMMM DD, YYYY')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated:
                    </Typography>
                    <Typography variant="body1">
                      {dayjs(selectedCourse.updatedAt).format('MMMM DD, YYYY')}
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewDialog}>Close</Button>
            {selectedCourse ? (
              <Button
                variant="contained"
                onClick={() => {
                  handleCloseViewDialog();
                  handleEditCourse(selectedCourse);
                }}
              >
                Edit Course
              </Button>
            ) : null}
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Delete Course</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this course? This action cannot be undone.
            </DialogContentText>
            {courseToDelete ? (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2">
                  {courseToDelete.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {courseToDelete.enrolledStudents} students enrolled
                </Typography>
              </Box>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
            >
              Delete Course
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
}
