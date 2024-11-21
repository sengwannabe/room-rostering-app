import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { formatDate } from '../utils/dateUtils';
import { Allocation } from '../utils/type';
import { useNavigate } from 'react-router-dom';

interface DayScheduleCardProps {
  date: Date;
  isMobile: boolean;
  isUnavailable: boolean;
  timeTable?: Allocation; // Changed from array to optional single object
}

export const DayScheduleCard: React.FC<DayScheduleCardProps> = ({ 
  date, 
  isMobile, 
  isUnavailable, 
  timeTable 
}) => {
  const navigate = useNavigate();
  const formatted = formatDate(date);
  
  const handleCardClick = () => {
    if (timeTable && timeTable.room_id) {
      navigate(`/dashboard/room/${timeTable.room_id}`);
    }
  };

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? 1 : 2,
        p: 1,
        bgcolor: 'background.paper'
      }}
    >
      <div style={{ width: isMobile ? '60px' : '80px' }}>
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {isMobile ? formatted.weekDay.slice(0, 3) : formatted.weekDay}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', minWidth: '2ch' }}>
          {formatted.day}
        </Typography>
      </div>
      <Card
        onClick={handleCardClick}
        sx={{
          flexGrow: 1,
          bgcolor: isUnavailable ? '#fecaca' : 'primary.light',
          '&:hover': {
            bgcolor: isUnavailable ? '#fca5a5' : 'primary.main'
          },
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
      >
        <CardContent sx={{ p: isMobile ? 1 : 2, '&:last-child': { pb: isMobile ? 1 : 2 } }}>
          <Typography
            variant="body2"
            color={isUnavailable ? '#991b1b' : '#00000'}
          >
            {isUnavailable ? 'Unavailable' : (timeTable ? 'Room: ' + timeTable.room_name : 'Full Day Shift')}
          </Typography>
        </CardContent>
      </Card>
    </Card>
  );
};