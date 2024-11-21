import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Typography, ThemeProvider, useMediaQuery, useTheme, Button } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { MobileWeekNav } from './MobileWeekNav';
import { DesktopWeekNav } from './DesktopWeekNav';
import { getMonday, getWeekDates } from '../utils/dateUtils';
import { theme } from '../theme';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { getUserData, saveUserData } from '../utils/storage';
import { submitUnavailability  } from '../api/room';

interface UnavailableDate {
  date: Date;
  unavailable: boolean;
}

const EditPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<UnavailableDate[]>([]);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const monday = getMonday(currentDate);
  const weekDates = getWeekDates(monday);
  // Load initial unavailability data from localStorage
  useEffect(() => {
    // Calculate weekDates inside the effect
    const monday = getMonday(currentDate);
    const currentWeekDates = getWeekDates(monday);
    
    const userData = getUserData();
    if (userData?.unavailability) {
      // Initialize all dates in the current week
      const initialDates: UnavailableDate[] = currentWeekDates.map(date => {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }) as keyof typeof userData.unavailability;
        return {
          date,
          unavailable: userData.unavailability[dayName] || false
        };
      });
      
      setSelectedDates(initialDates);
    } else {
      // If no data exists, initialize all dates as available
      const initialDates: UnavailableDate[] = currentWeekDates.map(date => ({
        date,
        unavailable: false
      }));
      setSelectedDates(initialDates);
    }
  }, [currentDate]);

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date < tomorrow;
  };

  const previousWeek = (): void => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    const today = new Date();
    const startOfCurrentWeek = getMonday(today);
    if (newDate.toDateString() === startOfCurrentWeek.toDateString() || newDate > startOfCurrentWeek) {
      setCurrentDate(newDate);
    }
  };

  const nextWeek = (): void => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleDateSelection = (date: Date) => {
    if (isDateDisabled(date)) {
      return;
    }
  
    setSelectedDates(prev => {
      return prev.map(d => {
        if (d.date.toDateString() === date.toDateString()) {
          // Toggle the unavailable status
          return { ...d, unavailable: !d.unavailable };
        }
        return d;
      });
    });
  };

  const handleSubmit = async () => {
    const userData = getUserData();
    if (!userData) {
      console.error('No user data found');
      return;
    }
  
    // Create the unavailability object based on selectedDates
    const unavailableDays: { 
      Monday: boolean;
      Tuesday: boolean;
      Wednesday: boolean;
      Thursday: boolean;
      Friday: boolean; 
    } = userData.unavailability


    // Update based on the current state of selectedDates
    selectedDates.forEach(({ date, unavailable }) => {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }) as keyof typeof unavailableDays;
      if (dayName in unavailableDays) {
        unavailableDays[dayName] = unavailable;
      }
    });
    
    userData.unavailability = unavailableDays
    saveUserData(userData)

    const payload = {
      userId: userData._id,
      unavailability: unavailableDays
    };
    
    try {
      await submitUnavailability(payload);
    } catch (error) {
      console.error('Error submitting unavailability:', error);
    }
    navigate('/dashboard');
  };

  const isDateSelected = (date: Date): boolean => {
    const dateEntry = selectedDates.find(d => d.date.toDateString() === date.toDateString());
    return dateEntry?.unavailable || false;
  };

  const handleCancel = () => {
    navigate('/dashboard');
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
                <Typography variant="h5">Edit Future Unavailability</Typography>
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
            <div style={{ flexGrow: 1, overflowY: 'auto' }}>
              <Card elevation={0}>
                <CardContent sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  mt: 2,
                  p: isMobile ? 1 : 2
                }}>
                  {weekDates.map((date) => (
                    <Card 
                      key={date.toISOString()} 
                      sx={{ 
                        p: 2, 
                        backgroundColor: isDateDisabled(date) ? '#f5f5f5' : '#ffffff',
                        opacity: isDateDisabled(date) ? 0.7 : 1,
                        cursor: isDateDisabled(date) ? 'not-allowed' : 'pointer'
                      }}
                      onClick={() => !isDateDisabled(date) && handleDateSelection(date)}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center' 
                      }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            color: isDateDisabled(date) ? 'text.disabled' : 'text.primary'
                          }}
                        >
                          {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                          {isDateDisabled(date) && (
                            <Typography 
                              component="span" 
                              color="text.secondary" 
                              sx={{ ml: 1, fontSize: '0.875rem' }}
                            >
                              (Not Available)
                            </Typography>
                          )}
                        </Typography>
                        <Button
                          data-testid="availability-button"
                          variant={isDateSelected(date) ? "contained" : "outlined"}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isDateDisabled(date)) {
                              handleDateSelection(date);
                            }
                          }}
                          disabled={isDateDisabled(date)}
                          sx={{
                            backgroundColor: isDateSelected(date) ? '#ef4444' : 'transparent',
                            '&:hover': {
                              backgroundColor: isDateSelected(date) ? '#dc2626' : undefined,
                            },
                            minWidth: '120px'
                          }}
                        >
                          {isDateSelected(date) ? "Unavailable" : "Available"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '8px',
              padding: '16px'
            }}>
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                color="primary"
                disabled={selectedDates.length === 0}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
};

export default EditPage;