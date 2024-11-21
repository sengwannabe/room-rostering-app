import React from 'react';
import { Card, CardContent, Button, Typography } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { formatDate } from '../utils/dateUtils';
import { WeekDayCard } from './WeekDayCard';
import { WeekNavProps } from '../utils/type';

export const DesktopWeekNav: React.FC<WeekNavProps> = ({
  weekDates,
  monday,
  onPreviousWeek,
  onNextWeek
}) => (
  <Card elevation={0} sx={{ bgcolor: 'primary.light' }}>
    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <Typography variant="h3" sx={{ minWidth: '3ch' }}>
          {formatDate(monday).day}
        </Typography>
        <div>
          <Typography color="textSecondary">{formatDate(monday).weekDay}</Typography>
          <Typography color="textSecondary">
            {formatDate(monday).month} {formatDate(monday).year}
          </Typography>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Button variant="text" onClick={onPreviousWeek} sx={{ minWidth: 'auto', p: 1, color: 'black'}}>
          <ArrowLeftIcon />
        </Button>

        {weekDates.map((date) => (
          <WeekDayCard key={date.toISOString()} date={date} isDesktop />
        ))}

        <Button variant="text" onClick={onNextWeek} sx={{ minWidth: 'auto', p: 1, color: 'black' }}>
          <ArrowRightIcon />
        </Button>
      </div>
    </CardContent>
  </Card>
);