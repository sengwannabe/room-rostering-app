import React from 'react';
import { 
  Card,
  CardHeader,
  Typography, 
  Tab, 
  Tabs,
  useTheme,
  useMediaQuery,
  Box
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Don't render on home page
  if (location.pathname === '/') {
    return null;
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const handleTitleClick = () => {
    navigate('/');
  };

  const getCurrentTab = () => {
    if (location.pathname === '/dashboard') return '/dashboard';
    if (location.pathname === '/dashboard/timetable') return '/dashboard/timetable';
    return false;
  };

  return (
    <Card 
      sx={{
        boxShadow: 'none',
        borderRadius: 0,
      }}
    >
      <CardHeader
        sx={{
          bgcolor: '#facc15', // Warmer yellow
          p: isMobile ? 2 : 3,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          '& .MuiCardHeader-content': {
            flex: 1,
          },
        }}
        title={
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 2 : 0
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              width: isMobile ? '100%' : 'auto',
              mr: isMobile ? 0 : 4,
              cursor: 'pointer'
            }}
              onClick={handleTitleClick}
            >
              <Typography 
                variant="h5" 
                sx={{ color: '#92400e' }} // Darker brown text
              >
                Laboratory Management
              </Typography>
            </Box>

            <Tabs 
              value={getCurrentTab()} 
              onChange={handleTabChange}
              sx={{
                minHeight: 0,
                '& .MuiTabs-indicator': {
                  backgroundColor: '#92400e', // Brown indicator
                },
                '& .MuiTab-root': {
                  color: '#b45309', // Base tab color
                  opacity: 0.7,
                  '&.Mui-selected': {
                    color: '#92400e', // Selected tab color
                    opacity: 1,
                    fontWeight: 'bold'
                  }
                }
              }}
            >
              <Tab 
                label="Dashboard" 
                value="/dashboard"
                sx={{ 
                  minHeight: 0,
                  py: 1,
                  minWidth: isMobile ? 'auto' : 120 
                }}
              />
              <Tab 
                label="Timetable" 
                value="/dashboard/timetable"
                sx={{ 
                  minHeight: 0,
                  py: 1,
                  minWidth: isMobile ? 'auto' : 120 
                }}
              />
            </Tabs>
          </Box>
        }
      />
    </Card>
  );
};

export default Topbar;