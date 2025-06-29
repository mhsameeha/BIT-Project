'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';

// Define the props interface for the Chart component
interface ChartProps {
  options: Record<string, unknown>;
  series: { name?: string; data: number[] }[] | number[];
  type: 'area' | 'line' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap';
  height?: number | string;
  width?: number | string;
}

// Loading component
function ChartLoading(): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
      }}
    >
      <CircularProgress />
    </Box>
  );
}

// Dynamically import ApexCharts with proper error handling
const ApexChart = dynamic(
  () => import('react-apexcharts'),
  { 
    ssr: false, 
    loading: () => <ChartLoading />
  }
);

// Chart wrapper component with error handling
export function Chart({ options, series, type, height = 300, width = '100%' }: ChartProps): React.JSX.Element {
  const [hasError, setHasError] = useState(false);

  // Error boundary for chart rendering
  useEffect(() => {
    setHasError(false);
  }, [options, series, type]);

  const handleError = (): void => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height, 
          bgcolor: 'grey.100',
          borderRadius: 1,
          border: '1px dashed',
          borderColor: 'grey.300'
        }}
      >
        <span>Chart failed to load</span>
      </Box>
    );
  }

  try {
    return (
      <Box sx={{ width: '100%' }}>
        <ApexChart
          options={options}
          series={series}
          type={type}
          height={height}
          width={width}
          onError={handleError}
        />
      </Box>
    );
  } catch {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height, 
          bgcolor: 'grey.100',
          borderRadius: 1 
        }}
      >
        <span>Chart unavailable</span>
      </Box>
    );
  }
}
