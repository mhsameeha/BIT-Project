import * as React from 'react';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

export interface CompaniesFiltersProps {
  onSearchChange?: (value: string) => void;
  onCategoryChange?: (categories: string[]) => void;
  selectedCategories?: string[];
}

const categories = [
  'Programming',
  'Mathematics',
  'Graphic Designing',
  'Data Science',
  'AI',
  'Cloud Computing'
];

export function CompaniesFilters({ 
  onSearchChange, 
  onCategoryChange, 
  selectedCategories = [] 
}: CompaniesFiltersProps): React.JSX.Element {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onSearchChange?.(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string[]>): void => {
    const value = event.target.value as string[];
    onCategoryChange?.(value);
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <OutlinedInput
          defaultValue=""
          fullWidth
          placeholder="Search by Course Title, Description, Level, Category or Tutor Name"
          onChange={handleInputChange}
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '600px' }}
        />
        
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            value={selectedCategories}
            label="Categories"
            onChange={handleCategoryChange}
            renderValue={(selected) => {
              if (selected.length === 0) return 'All Categories';
              if (selected.length === 1) return selected[0];
              return `${selected.length} categories selected`;
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Card>
  );
}
