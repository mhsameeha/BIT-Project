'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import {
  ArrowLeft,
  Books,
  Clock,
  CloudArrowUp,

  FilePdf,
  Plus,
  Trash,
  VideoCamera,
} from '@phosphor-icons/react/dist/ssr';

import type { TutorCourse } from '../../../../types/course';
import { Category } from '@/types/category';
import { addCourse, getAllCategories, getAllLanguages, getAllLevels } from '@/Services/courses';
import { Language } from '@/types/language';
import { useForm } from 'react-hook-form';
import { Level } from '@/types/level';
import dayjs from 'dayjs';
import { CurrencyRupee } from '@mui/icons-material';

interface SubContent {
  subContentSortOrder: string;
  subContentTitle: string;
  subContentDescription: string;
  type: 'video' | 'document' | 'both';
  videoFile?: File | null;
  documentFile?: File | null;
  videoUrl?: string; // For display purposes
  documentUrl?: string; // For display purposes
}

interface CourseContent {
  contentSortOrder: string;
  contentTitle: string;
  contentDuration: string; // e.g., "45 min", "1.5 hours"
  contentDescription: string;
  subContent: SubContent[];
}

interface Course {
  title: string;
  description: string;
  introduction: string;
  categoryFk: string;
  courseDifficultyFk: string;
  price: number;
  currency: string;
  isEnabled: boolean;
  tags: string[];
  languageFk: string;
  courseContent: CourseContent[];
  courseImage: string;
  updatedDate: Date;
  createdDate: Date;
}

interface CourseFormData {
  title: string;
  description: string;
  introduction: string;
  categoryFk: string;
  courseDifficultyFk: string;
  price: number;
  currency: string;
  isEnabled: boolean;
  tags: string[];
  languageFk: string;
  courseContent: CourseContent[];
  courseImage: string;
  updatedDate: Date;
  createdDate: Date;
}


export default function AddCoursePage(): React.JSX.Element {
  const router = useRouter();

  const [formData, setFormData] = React.useState<CourseFormData>({
    title: '',
    description: '',
    introduction: '',
    categoryFk: '',
    courseDifficultyFk: '',
    price: 0,
    currency: 'LKR',
    isEnabled: true,
    tags: [],
    languageFk: '',
    courseContent: [],
    courseImage: '',
    updatedDate: dayjs().toDate(),
    createdDate: dayjs().toDate(),
  });

  const {
  control,
  register,
  handleSubmit,
  setError,
  watch,
  setValue,
} = useForm<CourseFormData>();

  const [newTag, setNewTag] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([])
  const [languages, setLanguages] = React.useState<Language[]>([])
  const [levels, setLevels] = React.useState<Level[]>([])



  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Course description is required';
    }

    if (!formData.introduction.trim()) {
      newErrors.introduction = 'Brief introduction is required';
    }

    if (!formData.categoryFk) {
      newErrors.categoryFk = 'Category is required';
    }

      if (!formData.languageFk) {
      newErrors.languageFk = 'Category is required';
    }


    if (formData.price <= 0) {
      newErrors.price = 'Fee must be greater than 0 (typical range: LKR 2000-6000 per hour)';
    }

    if (formData.courseContent.length === 0) {
      newErrors.courseContent = 'At least one course content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    // try {
      // Calculate total duration
      // const totalMinutes = formData.contents.reduce((total, content) => {
      //   const duration = content.duration.toLowerCase();
      //   let minutes = 0;

      //   if (duration.includes('hour')) {
      //     const hours = parseFloat(duration);
      //     minutes += hours * 60;
      //   } else if (duration.includes('min')) {
      //     minutes += parseFloat(duration);
      //   }

      //   return total + minutes;
      // }, 0);

      // const totalHours = Math.floor(totalMinutes / 60);
      // const remainingMinutes = totalMinutes % 60;
      // const totalDuration =
      //   totalHours > 0
      //     ? `${totalHours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`
      //     : `${remainingMinutes}m`;

      // Add to mock data (in real app, this would be an API call)
      // const success = addCourse(newCourse);
  const onSubmit = async (data: CourseFormData) => {
    if (!validateForm()) return;
  setIsSubmitting(true);

  try {
    console.log(formData);
    const { error } = await addCourse(formData);
    
    if (error) {
      setErrors({ submit: error });
      return;
    }
   console.log("data", data);
    setSubmitSuccess(true);
    setTimeout(() => router.push('/course-management'), 2000);
  } catch (err) {
    setErrors({ submit: 'Failed to create course' });
  } finally {
    setIsSubmitting(false);
  }
};


    React.useEffect(() => {
      const fetchData = async () => {
        const returnValue = await getAllCategories();
        if ('error' in returnValue) {
          // Optionally, handle error UI here
          return;
        }
        setCategories(returnValue);
      };
       fetchData();
    }, []);


        React.useEffect(() => {
      const fetchData = async () => {
        const returnValue = await getAllLanguages();
        if ('error' in returnValue) {
          // Optionally, handle error UI here
          return;
        }
        setLanguages(returnValue);
      };
       fetchData();
    }, []);

            React.useEffect(() => {
      const fetchData = async () => {
        const returnValue = await getAllLevels();
        if ('error' in returnValue) {
          // Optionally, handle error UI here
          return;
        }
        setLevels(returnValue);
      };
       fetchData();
    }, []);

  const handleAddContent = (): void => {
    const newContent: CourseContent = {
      contentSortOrder: '',
      contentTitle: '',
      contentDuration: '',
      contentDescription: '',
      subContent: [],
    };
    setFormData((prev) => ({
      ...prev,
      courseContent: [...prev.courseContent, newContent],
    }));
  };

  const handleAddSubContent = (contentId: string): void => {
    const newSubContent: SubContent = {
      subContentSortOrder: '',
      subContentTitle: '',
      subContentDescription: '',
      type: 'video',
    };
    setFormData((prev) => ({
      ...prev,
      courseContent: prev.courseContent.map((content) =>
        content.contentSortOrder === contentId ? { ...content, subContent: [...content.subContent, newSubContent] } : content
      ),
    }));
  };

  const handleRemoveSubContent = (contentId: string, subContentId: string): void => {
    setFormData((prev) => ({
      ...prev,
      courseContent: prev.courseContent.map((content) =>
        content.contentSortOrder === contentId
          ? { ...content, subContent: content.subContent.filter((sub) => sub.subContentSortOrder !== subContentId) }
          : content
      ),
    }));
  };

  const handleUpdateSubContent = (
    contentId: string,
    subContentId: string,
    field: keyof SubContent,
    value: string | File | null
  ): void => {
    setFormData((prev) => ({
      ...prev,
      courseContent: prev.courseContent.map((content) =>
        content.contentSortOrder === contentId
          ? {
              ...content,
              subContent: content.subContent.map((sub) =>
                sub.subContentSortOrder === subContentId ? { ...sub, [field]: value } : sub
              ),
            }
          : content
      ),
    }));
  };

  const handleFileUpload = (
    contentId: string,
    subContentId: string,
    fileType: 'video' | 'document',
    file: File
  ): void => {
    const fileUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      courseContent: prev.courseContent.map((content) =>
        content.contentSortOrder === contentId
          ? {
              ...content,
              subContent: content.subContent.map((sub) =>
                sub.subContentSortOrder === subContentId
                  ? {
                      ...sub,
                      [fileType === 'video' ? 'videoFile' : 'documentFile']: file,
                      [fileType === 'video' ? 'videoUrl' : 'documentUrl']: fileUrl,
                    }
                  : sub
              ),
            }
          : content
      ),
    }));
  };

  const handleUpdateContent = (id: string, field: keyof CourseContent, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      courseContent: prev.courseContent.map((content) => (content.contentSortOrder === id ? { ...content, [field]: value } : content)),
    }));
  };

  const handleRemoveContent = (id: string): void => {
    setFormData((prev) => ({
      ...prev,
      courseContent: prev.courseContent.filter((content) => content.contentSortOrder !== id),
    }));
  };

  const handleAddTag = (): void => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string): void => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just create a mock URL
      const mockUrl = `/assets/course-${Date.now()}.jpg`;
      setFormData((prev) => ({ ...prev, logo: mockUrl }));
    }
  };

  if (submitSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Books size={64} style={{ color: '#4caf50', marginBottom: 16 }} />
            <Typography variant="h4" gutterBottom color="success.main">
              Course Created Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Your course &ldquo;{formData.title}&rdquo; has been created and is now available.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Redirecting to Course Management...
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container component="form" onSubmit={handleSubmit(onSubmit)}>
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeft size={24} />
          </IconButton>
          <Box>
            <Typography variant="h4" gutterBottom>
              Create New Course
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Fill in the details to create a new course for your students
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Basic Information */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Course Title"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, title: e.target.value }));
                        }}
                        error={Boolean(errors.title)}
                        helperText={errors.title}
                        placeholder="e.g., Introduction to React.js"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Brief Introduction"
                        value={formData.introduction}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, introduction: e.target.value }));
                        }}
                        error={Boolean(errors.briefIntro)}
                        helperText={errors.briefIntro}
                        placeholder="A short, compelling summary of your course"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Course Description"
                        value={formData.description}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, description: e.target.value }));
                        }}
                        error={Boolean(errors.description)}
                        helperText={errors.description}
                        placeholder="Detailed description of what students will learn..."
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(errors.category)}>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={formData.categoryFk}
                          label="Category"
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, categoryFk: e.target.value }));
                          }}
                        >
                          {categories.map((category:Category) => (
                            <MenuItem key={category.categoryId} value={category.categoryId}>
                              {category.categoryName}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.category ? <FormHelperText>{errors.category}</FormHelperText> : null}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Level</InputLabel>
                        <Select
                          value={formData.courseDifficultyFk}
                          label="Level"
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              courseDifficultyFk: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced'| 'Beginner-Intermediate'|'Intermediate-Advanced',
                            }));
                          }}
                        >
                     {levels.map((courseDifficulty:Level) => (
                            <MenuItem key={courseDifficulty.courseDifficultyId} value={courseDifficulty.courseDifficultyId}>
                              {courseDifficulty.courseDifficultyName}
                            </MenuItem>
                          ))}   
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Course Content */}
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Course Content</Typography>
                    <Button variant="outlined" startIcon={<Plus size={16} />} onClick={handleAddContent}>
                      Add Content
                    </Button>
                  </Box>

                  {errors.contents ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {errors.contents}
                    </Alert>
                  ) : null}

                  <Stack spacing={2}>
                    {formData.courseContent.map((content, index) => (
                      <Card key={content.contentSortOrder} variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" color="primary">
                              Content {index + 1}
                            </Typography>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                handleRemoveContent(content.contentSortOrder);
                              }}
                            >
                              <Trash size={16} />
                            </IconButton>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Content Title"
                                value={content.contentTitle}
                                onChange={(e) => {
                                  handleUpdateContent(content.contentSortOrder, 'contentTitle', e.target.value);
                                }}
                                placeholder="e.g., Introduction to Components"
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Duration"
                                value={content.contentDuration}
                                onChange={(e) => {
                                  handleUpdateContent(content.contentSortOrder, 'contentDuration', e.target.value);
                                }}
                                placeholder="e.g., 45 min, 1.5 hours"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Clock size={16} />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                size="small"
                                multiline
                                rows={2}
                                label="Content Description"
                                value={content.contentDescription}
                                onChange={(e) => {
                                  handleUpdateContent(content.contentSortOrder, 'contentDescription', e.target.value);
                                }}
                                placeholder="Brief description of this content..."
                              />
                            </Grid>

                            {/* Sub-Contents Section */}
                            <Grid item xs={12}>
                              <Box sx={{ mt: 2 }}>
                                <Box
                                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
                                >
                                  <Typography variant="subtitle2" color="text.primary">
                                    Sub-Contents
                                  </Typography>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Plus size={14} />}
                                    onClick={() => {
                                      handleAddSubContent(content.contentSortOrder);
                                    }}
                                  >
                                    Add Sub-Content
                                  </Button>
                                </Box>

                                {content.subContent.length > 0 ? (
                                  <Stack spacing={2}>
                                    {content.subContent.map((subContent, subIndex) => (
                                      <Card key={subContent.subContentSortOrder} variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                                        <CardContent sx={{ p: 2 }}>
                                          <Box
                                            sx={{
                                              display: 'flex',
                                              justifyContent: 'space-between',
                                              alignItems: 'center',
                                              mb: 2,
                                            }}
                                          >
                                            <Typography variant="caption" color="primary">
                                              Sub-Content {subIndex + 1}
                                            </Typography>
                                            <IconButton
                                              size="small"
                                              color="error"
                                              onClick={() => {
                                                handleRemoveSubContent(content.contentSortOrder, subContent.subContentSortOrder);
                                              }}
                                            >
                                              <Trash size={12} />
                                            </IconButton>
                                          </Box>

                                          <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                              <TextField
                                                fullWidth
                                                size="small"
                                                label="Sub-Content Title"
                                                value={subContent.subContentTitle}
                                                onChange={(e) => {
                                                  handleUpdateSubContent(
                                                    content.contentSortOrder,
                                                    subContent.subContentSortOrder,
                                                    'subContentTitle',
                                                    e.target.value
                                                  );
                                                }}
                                                placeholder="e.g., Introduction Video"
                                              />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                              <FormControl fullWidth size="small">
                                                <InputLabel>Content Type</InputLabel>
                                                <Select
                                                  value={subContent.type}
                                                  label="Content Type"
                                                  onChange={(e) => {
                                                    handleUpdateSubContent(
                                                      content.contentSortOrder,
                                                      subContent.subContentSortOrder,
                                                      'type',
                                                      e.target.value
                                                    );
                                                  }}
                                                >
                                                  <MenuItem value="video">Video Only</MenuItem>
                                                  <MenuItem value="document">Document Only</MenuItem>
                                                  <MenuItem value="both">Video + Document</MenuItem>
                                                </Select>
                                              </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                              <TextField
                                                fullWidth
                                                size="small"
                                                multiline
                                                rows={2}
                                                label="Sub-Content Description"
                                                value={subContent.subContentDescription}
                                                onChange={(e) => {
                                                  handleUpdateSubContent(
                                                    content.contentSortOrder,
                                                    subContent.subContentSortOrder,
                                                    'subContentDescription',
                                                    e.target.value
                                                  );
                                                }}
                                                placeholder="Brief description of this sub-content..."
                                              />
                                            </Grid>

                                            {/* File Upload Sections */}
                                            {(subContent.type === 'video' || subContent.type === 'both') && (
                                              <Grid item xs={12} sm={6}>
                                                <Box
                                                  sx={{
                                                    border: '2px dashed #ddd',
                                                    borderRadius: 1,
                                                    p: 2,
                                                    textAlign: 'center',
                                                  }}
                                                >
                                                  <input
                                                    accept="video/*"
                                                    style={{ display: 'none' }}
                                                    id={`video-upload-${subContent.subContentSortOrder}`}
                                                    type="file"
                                                    onChange={(e) => {
                                                      const file = e.target.files?.[0];
                                                      if (file) {
                                                        handleFileUpload(content.contentSortOrder, subContent.subContentSortOrder, 'video', file);
                                                      }
                                                    }}
                                                  />
                                                  <label htmlFor={`video-upload-${subContent.subContentSortOrder}`}>
                                                    <Box sx={{ cursor: 'pointer' }}>
                                                      <VideoCamera
                                                        size={32}
                                                        style={{ marginBottom: 8, color: '#666' }}
                                                      />
                                                      <Typography variant="body2" color="text.secondary">
                                                        {subContent.videoFile
                                                          ? subContent.videoFile.name
                                                          : 'Upload Video'}
                                                      </Typography>
                                                      <Typography variant="caption" color="text.secondary">
                                                        MP4, AVI, MOV (Max 100MB)
                                                      </Typography>
                                                    </Box>
                                                  </label>
                                                </Box>
                                              </Grid>
                                            )}

                                            {(subContent.type === 'document' || subContent.type === 'both') && (
                                              <Grid item xs={12} sm={6}>
                                                <Box
                                                  sx={{
                                                    border: '2px dashed #ddd',
                                                    borderRadius: 1,
                                                    p: 2,
                                                    textAlign: 'center',
                                                  }}
                                                >
                                                  <input
                                                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                                                    style={{ display: 'none' }}
                                                    id={`document-upload-${subContent.subContentSortOrder}`}
                                                    type="file"
                                                    onChange={(e) => {
                                                      const file = e.target.files?.[0];
                                                      if (file) {
                                                        handleFileUpload(content.contentSortOrder, subContent.subContentSortOrder, 'document', file);
                                                      }
                                                    }}
                                                  />
                                                  <label htmlFor={`document-upload-${subContent.subContentSortOrder}`}>
                                                    <Box sx={{ cursor: 'pointer' }}>
                                                      <FilePdf size={32} style={{ marginBottom: 8, color: '#666' }} />
                                                      <Typography variant="body2" color="text.secondary">
                                                        {subContent.documentFile
                                                          ? subContent.documentFile.name
                                                          : 'Upload Document'}
                                                      </Typography>
                                                      <Typography variant="caption" color="text.secondary">
                                                        PDF, DOC, PPT (Max 50MB)
                                                      </Typography>
                                                    </Box>
                                                  </label>
                                                </Box>
                                              </Grid>
                                            )}
                                          </Grid>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </Stack>
                                ) : (
                                  <Box
                                    sx={{
                                      textAlign: 'center',
                                      py: 2,
                                      color: 'text.secondary',
                                      border: '1px dashed #ddd',
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography variant="body2">
                                      No sub-contents added yet. Click &ldquo;Add Sub-Content&rdquo; to add videos or
                                      documents.
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}

                    {formData.courseContent.length === 0 && (
                      <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                        <Books size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                        <Typography variant="body2">
                          No content added yet. Click &ldquo;Add Content&rdquo; to get started.
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => {
                          handleRemoveTag(tag);
                        }}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => {
                        setNewTag(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTag();
                        }
                      }}
                    />
                    <Button variant="outlined" onClick={handleAddTag}>
                      Add
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Course Image */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Course Image
                  </Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={formData.courseImage}
                      sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
                    >
                      <Books size={48} />
                    </Avatar>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="course-image-upload"
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="course-image-upload">
                      <Button variant="outlined" component="span" startIcon={<CloudArrowUp size={16} />} fullWidth>
                        Upload Image
                      </Button>
                    </label>
                  </Box>
                </CardContent>
              </Card>

              {/* Pricing & Settings */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pricing & Settings
                  </Typography>
                  <Stack spacing={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Course Fee"
                          placeholder="e.g., 3000 (LKR 2000-6000 per hour typical)"
                          value={formData.price}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) ?? 0 }));
                          }}
                          error={Boolean(errors.fee)}
                          helperText={errors.fee}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {/* <Currency size={16} /> */}
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <InputLabel>Currency</InputLabel>
                          <Select
                            value={formData.currency}
                            label="LKR"
                            onChange={(e) => {
                          setFormData((prev) => ({ ...prev, currency: e.target.value as string}));
                        }}
                          >
                              <MenuItem value = 'LKR'>
                               LKR
                              </MenuItem>
                           
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <FormControl fullWidth>
                      <InputLabel>Languages</InputLabel>
                      <Select
                        value={formData.languageFk}
                        label="Languages"
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, languageFk: e.target.value as string }));
                        }}
                        renderValue={(selected) => {
                        const selectedLanguage = languages.find((lang) => lang.languageId === selected);
                        return (
                          <Chip
                            key={selected}
                            label={selectedLanguage ? selectedLanguage.languages : selected}
                            size="small"
                          />
                        );
                      }}

                      >
                        {languages.map((language:Language) => (
                          <MenuItem key={language.languageId} value={language.languageId}>
                            {language.languages}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isEnabled}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, isEnabled: e.target.checked }));
                          }}
                        />
                      }
                      label="Enable Course"
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Actions */}
              <Stack spacing={2}>
                  <Button variant='outlined' type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Course'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    router.back();
                  }}
                  fullWidth
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Container>
    </Container>
  );
}

