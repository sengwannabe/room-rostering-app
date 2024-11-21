import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { theme } from '../theme';
import { fetchTimetable } from '../api/timetable';
import { TimetableData, Allocation } from '../utils/type';


const Timetable: React.FC = () => {
  const [timetableData, setTimetableData] = useState<TimetableData | undefined>({});
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchTimetable();
        if (response && response[0]?.timetable) {
          setTimetableData(response[0].timetable);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    getData();
  }, []);

  const AllocationCard = ({ allocation }: { allocation: Allocation }) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'white',
        p: 1.5,
        borderRadius: 1,
        mb: 1,
        border: '1px solid #fde68a',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonIcon sx={{ color: '#92400e' }} />
        <Typography sx={{ color: '#92400e' }}>{allocation.user_name}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MeetingRoomIcon sx={{ color: '#92400e' }} />
        <Typography sx={{ color: '#92400e' }}>{allocation.room_name}</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 3 }, 
      bgcolor: theme.palette.background.default, 
      minHeight: '100vh',
      maxWidth: '100%',
      boxSizing: 'border-box'
    }}>
      <Card sx={{ 
        maxWidth: '100%',
        boxShadow: 'none'
      }}>
        <CardHeader
          sx={{
            bgcolor: '#fbbf24',
            p: 2,
          }}
          title={
            <Typography variant="h5" sx={{ color: '#713f12' }}>
              Weekly Schedule
            </Typography>
          }
        />
        <CardContent sx={{ p: 2 }}>
          {weekdays.map((day) => {
            if (!timetableData) {
              return (<div>Error Loading timetable!</div>)
            }
            const dayAllocations = timetableData[day] || [];
            
            return (
              <Card
                key={day}
                sx={{
                  mb: 2,
                  bgcolor: '#fef3c7',
                  border: '1px solid #fde68a',
                  boxShadow: 'none',
                  overflow: 'visible'
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#713f12',
                      borderBottom: '2px solid #fbbf24',
                      pb: 1,
                      mb: 2
                    }}
                  >
                    {day}
                  </Typography>
                  {dayAllocations.length > 0 ? (
                    dayAllocations.map((allocation, index) => (
                      <AllocationCard key={index} allocation={allocation} />
                    ))
                  ) : (
                    <Typography
                      sx={{
                        color: '#92400e',
                        textAlign: 'center',
                        py: 2
                      }}
                    >
                      No allocations for this day
                    </Typography>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Timetable;