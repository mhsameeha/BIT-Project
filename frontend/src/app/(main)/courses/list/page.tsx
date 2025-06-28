'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CompaniesFilters } from '@/components/main/integrations/integrations-filters';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import { IntegrationListItem } from '@/components/main/integrations/integrations-list-item';
import type { Integration } from '@/components/main/integrations/integrations-list-item';
import { getAllCourses, type CourseData } from '@/constants/courses';

// Convert CourseData to Integration format for compatibility
const coursesToIntegrations = (courses: CourseData[]): Integration[] => {
  return courses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    level: `Level : ${course.level}`,
    category: course.category,
    tutorName: course.tutorName,
    logo: course.logo,
    enrolledStudents: course.enrolledStudents,
    rating: course.rating,
    reviewCount: course.reviewCount,
    fee: course.fee,
    updatedAt: course.updatedAt,
  }));
};

const integrations = coursesToIntegrations(getAllCourses());

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
