import React from 'react';
import { Card, CardContent, Button, Typography } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { formatDate } from '../utils/dateUtils';
import { WeekDayCard } from './WeekDayCard';
import { WeekNavProps } from '../utils/type';

export const MobileWeekNav: React.FC<WeekNavProps> = ({
  weekDates,
  monday,
  onPreviousWeek,
  onNextWeek
}) => (
  <Card elevation={0} sx={{ bgcolor: 'primary.light', mb: 2 }}>
    <CardContent sx={{ p: 2 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <Button variant="text" onClick={onPreviousWeek} sx={{ minWidth: 'auto', p: 1, color: 'black' }}>
          <ArrowLeftIcon />
        </Button>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
          {formatDate(monday).month} {formatDate(monday).year}
        </Typography>
        <Button variant="text" onClick={onNextWeek} sx={{ minWidth: 'auto', p: 1, color: 'black' }}>
          <ArrowRightIcon />
        </Button>
      </div>
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {weekDates.map((date) => (
          <WeekDayCard key={date.toISOString()} date={date} />
        ))}
      </div>
    </CardContent>
  </Card>
);