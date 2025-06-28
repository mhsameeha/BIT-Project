'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { CompaniesFilters } from '@/components/main/integrations/integrations-filters';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';

import { IntegrationListItem } from '@/components/main/integrations/integrations-list-item';
import type { Integration } from '@/components/main/integrations/integrations-list-item';

const integrations = [
  {
    id: 'INTEG-001',
    title: 'Introduction to Programming',
    description: 'Learn the basics of programming using Python. Ideal for complete beginners.',
    level: 'Level : Beginner',
    category: 'Programming',
    tutorName: 'Dr. Sarah Johnson',
    logo: '/assets/logo-python.png',
    enrolledStudents: 594,
    rating: 4.5,
    reviewCount: 127,
    updatedAt: dayjs().subtract(12, 'minute').toDate(),
  },
  {
    id: 'INTEG-002',
    title: 'Software Testing & Quality Assurance',
    description: 'Understand the fundamentals of software testing including test cases, manual & automated testing tools.',
    level: 'Level : Beginner–Intermediate',
    category: 'Programming',
    tutorName: 'Mark Thompson',
    logo: '/assets/qa.png',
    enrolledStudents: 594,
    rating: 4.3,
    reviewCount: 89,
    updatedAt: dayjs().subtract(12, 'minute').toDate(),
  },
  {
    id: 'INTEG-003',
    title: 'Advanced JavaScript & Web Development',
    description: 'Master modern JavaScript ES6+, DOM manipulation, and build interactive web applications.',
    level: 'Level : Intermediate',
    category: 'Programming',
    tutorName: 'Alex Rodriguez',
    logo: '/assets/logo-javascript.png',
    enrolledStudents: 1205,
    rating: 4.7,
    reviewCount: 203,
    updatedAt: dayjs().subtract(2, 'day').toDate(),
  },
  {
    id: 'INTEG-004',
    title: 'Calculus I: Limits and Derivatives',
    description: 'Introduction to differential calculus covering limits, continuity, and derivatives with real-world applications.',
    level: 'Level : Intermediate',
    category: 'Mathematics',
    tutorName: 'Prof. Michael Chen',
    logo: '/assets/logo-math.png',
    enrolledStudents: 782,
    rating: 4.2,
    reviewCount: 156,
    updatedAt: dayjs().subtract(5, 'day').toDate(),
  },
  {
    id: 'INTEG-005',
    title: 'Linear Algebra for Data Science',
    description: 'Essential linear algebra concepts including vectors, matrices, eigenvalues for machine learning applications.',
    level: 'Level : Intermediate–Advanced',
    category: 'Mathematics',
    tutorName: 'Dr. Emily Watson',
    logo: '/assets/logo-math.png',
    enrolledStudents: 923,
    rating: 4.6,
    reviewCount: 241,
    updatedAt: dayjs().subtract(1, 'week').toDate(),
  },
  {
    id: 'INTEG-006',
    title: 'Adobe Photoshop for Beginners',
    description: 'Learn photo editing, digital art creation, and graphic design fundamentals using Adobe Photoshop.',
    level: 'Level : Beginner',
    category: 'Graphic Designing',
    tutorName: 'Jessica Miller',
    logo: '/assets/logo-photoshop.png',
    enrolledStudents: 1456,
    rating: 4.4,
    reviewCount: 318,
    updatedAt: dayjs().subtract(3, 'day').toDate(),
  },
  {
    id: 'INTEG-007',
    title: 'UI/UX Design Principles',
    description: 'Master user interface and user experience design with hands-on projects using Figma and design thinking.',
    level: 'Level : Beginner–Intermediate',
    category: 'Graphic Designing',
    tutorName: 'David Kim',
    logo: '/assets/logo-design.png',
    enrolledStudents: 1123,
    rating: 4.8,
    reviewCount: 267,
    updatedAt: dayjs().subtract(4, 'day').toDate(),
  },
  {
    id: 'INTEG-008',
    title: 'C# Programming & .NET Development',
    description: 'Comprehensive C# programming course covering OOP concepts, .NET framework, and application development.',
    level: 'Level : Intermediate',
    category: 'Programming',
    tutorName: 'Robert Anderson',
    logo: '/assets/csharp.svg',
    enrolledStudents: 867,
    rating: 4.5,
    reviewCount: 194,
    updatedAt: dayjs().subtract(6, 'day').toDate(),
  },
  {
    id: 'INTEG-009',
    title: 'Statistics for Data Analysis',
    description: 'Learn descriptive and inferential statistics, probability distributions, and hypothesis testing for data science.',
    level: 'Level : Intermediate',
    category: 'Data Science',
    tutorName: 'Dr. Lisa Zhang',
    logo: '/assets/logo-stats.png',
    enrolledStudents: 645,
    rating: 4.3,
    reviewCount: 132,
    updatedAt: dayjs().subtract(1, 'week').toDate(),
  },
  {
    id: 'INTEG-010',
    title: 'Digital Illustration with Procreate',
    description: 'Create stunning digital artwork and illustrations using Procreate on iPad with professional techniques.',
    level: 'Level : Beginner–Intermediate',
    category: 'Graphic Designing',
    tutorName: 'Sofia Martinez',
    logo: '/assets/logo-procreate.png',
    enrolledStudents: 1034,
    rating: 4.6,
    reviewCount: 187,
    updatedAt: dayjs().subtract(2, 'week').toDate(),
  },
  {
    id: 'INTEG-011',
    title: 'Machine Learning Fundamentals',
    description: 'Introduction to ML algorithms, supervised/unsupervised learning, and hands-on Python implementation.',
    level: 'Level : Advanced',
    category: 'AI',
    tutorName: 'Dr. James Wilson',
    logo: '/assets/logo-ml.png',
    enrolledStudents: 756,
    rating: 4.7,
    reviewCount: 145,
    updatedAt: dayjs().subtract(5, 'day').toDate(),
  },
  {
    id: 'INTEG-012',
    title: 'Web Design with HTML & CSS',
    description: 'Build responsive, modern websites from scratch using HTML5, CSS3, and responsive design principles.',
    level: 'Level : Beginner',
    category: 'Programming',
    tutorName: 'Emma Davis',
    logo: '/assets/logo-html.png',
    enrolledStudents: 1789,
    rating: 4.4,
    reviewCount: 412,
    updatedAt: dayjs().subtract(3, 'day').toDate(),
  },
  {
    id: 'INTEG-013',
    title: 'AWS Cloud Fundamentals',
    description: 'Learn Amazon Web Services basics including EC2, S3, and cloud architecture principles.',
    level: 'Level : Beginner–Intermediate',
    category: 'Cloud Computing',
    tutorName: 'Kevin Brown',
    logo: '/assets/logo-aws.png',
    enrolledStudents: 892,
    rating: 4.5,
    reviewCount: 167,
    updatedAt: dayjs().subtract(1, 'week').toDate(),
  },
  {
    id: 'INTEG-014',
    title: 'Deep Learning with TensorFlow',
    description: 'Build neural networks and deep learning models using TensorFlow and Keras frameworks.',
    level: 'Level : Advanced',
    category: 'AI',
    tutorName: 'Dr. Rachel Green',
    logo: '/assets/logo-tensorflow.png',
    enrolledStudents: 534,
    rating: 4.6,
    reviewCount: 98,
    updatedAt: dayjs().subtract(4, 'day').toDate(),
  },
  {
    id: 'INTEG-015',
    title: 'Data Visualization with Tableau',
    description: 'Create compelling data visualizations and dashboards using Tableau for business intelligence.',
    level: 'Level : Intermediate',
    category: 'Data Science',
    tutorName: 'Tom Harrison',
    logo: '/assets/logo-tableau.png',
    enrolledStudents: 723,
    rating: 4.4,
    reviewCount: 159,
    updatedAt: dayjs().subtract(6, 'day').toDate(),
  }
] satisfies Integration[];

export default function Page(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  // Filter courses based on search term and categories
  const filteredIntegrations = React.useMemo(() => {
    let filtered = integrations;

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((integration) =>
        selectedCategories.some(category => 
          integration.category.toLowerCase() === category.toLowerCase()
        )
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((integration) =>
        integration.title.toLowerCase().includes(searchLower) ||
        integration.description.toLowerCase().includes(searchLower) ||
        integration.level.toLowerCase().includes(searchLower) ||
        integration.category.toLowerCase().includes(searchLower) ||
        integration.tutorName.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [searchTerm, selectedCategories]);

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (categories: string[]): void => {
    setSelectedCategories(categories);
  };

  return (
    <Stack spacing={3}>
      <CompaniesFilters 
        onSearchChange={handleSearchChange} 
        onCategoryChange={handleCategoryChange}
        selectedCategories={selectedCategories}
      />
      <Stack spacing={2}>
        {filteredIntegrations.map((integration) => (
          <IntegrationListItem key={integration.id} integration={integration} />
        ))}
        {filteredIntegrations.length === 0 && (Boolean(searchTerm.trim()) || selectedCategories.length > 0) && (
          <Box sx={{ textAlign: 'center', py: 4}}>
            <Typography variant="h6" color="text.secondary">
              No courses found
              {searchTerm.trim() ? ` for "${searchTerm}"` : ''}
              {selectedCategories.length > 0 ? ` in ${selectedCategories.length === 1 ? `"${selectedCategories[0]}"` : `${selectedCategories.length} selected categories`}` : ''}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search terms or category filter
            </Typography>
          </Box>
        )}
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination count={Math.ceil(filteredIntegrations.length / 12)} size="small" />
      </Box>
    </Stack>
  );
}
