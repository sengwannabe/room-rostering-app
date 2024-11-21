import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Typography, ThemeProvider, useMediaQuery, useTheme } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { MobileWeekNav } from './MobileWeekNav';
import { DesktopWeekNav } from './DesktopWeekNav';
import { DayScheduleCard } from './DayScheduleCard';
import ActionButtons from './ActionButtons';
import { getMonday, getWeekDates } from '../utils/dateUtils';
import { theme } from '../theme';
import { getUserRole, getUserId } from '../utils/storage';
import { TimetableData, UserLocalStorage } from '../utils/type';
import { fetchTimetable } from '../api/timetable';

const Dashboard: React.FC = () => {
  const isManager = getUserRole();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userData, setUserData] = useState<UserLocalStorage | null>(null);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [timetableData, setTimetableData] = useState<TimetableData | undefined>({});
  const [userId, setUserId] = useState<Number | 0>()
 
  const monday = getMonday(currentDate);
  const weekDates = getWeekDates(monday);

  const getTimetable = async () => {
    try {
      const response = await fetchTimetable();
      if (response && response[0]?.timetable) {
        setTimetableData(response[0].timetable);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    getTimetable();
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setUserId(getUserId());
    }
  }, []);

  
  const previousWeek = (): void => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = (): void => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };


  return (
    <ThemeProvider theme={theme}>
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: theme.palette.background.default,
        padding: isMobile ? '12px' : '24px',
        boxSizing: 'border-box'
      }}>
        <Card sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper'
        }}>
          <CardHeader
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              p: isMobile ? 2 : 3
            }}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Current Roster</Typography>
                <CalendarTodayIcon fontSize="medium" />
              </div>
            }
          />
          <CardContent sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            p: isMobile ? 1 : 2
          }}>
            {isMobile ? (
              <MobileWeekNav
                weekDates={weekDates}
                monday={monday}
                onPreviousWeek={previousWeek}
                onNextWeek={nextWeek}
              />
            ) : (
              <DesktopWeekNav
                weekDates={weekDates}
                monday={monday}
                onPreviousWeek={previousWeek}
                onNextWeek={nextWeek}
              />
            )}
            <div style={{ overflowY: 'auto', flexGrow: 1 }}>
              <Card elevation={0}>
                <CardContent sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  mt: 2,
                  p: isMobile ? 1 : 2
                }}>
                {weekDates.map((date) => {
                  if (!timetableData) {
                    return (<div>Error Loading timetable!</div>)
                  }
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                  const dayAllocations = timetableData[dayName] || [];
                  const userAllocation = dayAllocations.find(allocation => allocation.user_id === userId);
                  
                  return (
                    <DayScheduleCard
                      key={date.toISOString()}
                      date={date}
                      isMobile={isMobile}
                      isUnavailable={userData?.unavailability[dayName] || false}
                      timeTable={userAllocation} // Now passing single object or undefined
                    />
                  );
                })}
            </CardContent>
              </Card>
            </div>
            <ActionButtons isMobile={isMobile} isManager={isManager}/>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;