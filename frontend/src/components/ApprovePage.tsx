import React, { useEffect, useState } from 'react';
import {
  Card, CardHeader, CardContent, Typography,
  ThemeProvider, useMediaQuery, useTheme, Chip,
  Button, Checkbox
} from "@mui/material";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SendIcon from '@mui/icons-material/Send';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { User, UserApprove } from '../utils/type';
import { fetchUsers } from '../api/user';
import { submitTimetable } from '../api/room';

const ApprovePage: React.FC = () => {
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [staffRequests, setStaffRequests] = useState<UserApprove[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStaffRequests = async () => {
    try {
      const response = await fetchUsers();
      const newUsers = response
        .map((user: User) => {
          const workingDays = Object.values(user.unavailability).filter(day => !day).length;
          // Skip users without room preference
          if (!user.roomPreference) return null;

          const hasRoomRequirement = user.roomPreference.equipment.length > 0;
          return {
            _id: user._id,
            name: user.name,
            workingDays,
            hasRoomRequirement
          };
        })
        .filter((user): user is UserApprove => user !== null);

      setStaffRequests(newUsers);
    } catch (error) {
      console.error('Error fetching staff requests:', error);
    }
  };

  useEffect(() => {
    fetchStaffRequests();
  }, []);

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(requestId)) {
        newSet.delete(requestId);
      } else {
        newSet.add(requestId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedRequests.size === staffRequests.length) {
      setSelectedRequests(new Set());
    } else {
      setSelectedRequests(new Set(staffRequests.map(req => req._id.toString())));
    }
  };

  const handleSubmitApprovals = async () => {
    setIsSubmitting(true);

    const users = await fetchUsers();
    const selected_users = [];
    // Get all selected users from database
    for (var user of users) {
      if (selectedRequests.has(user._id.toString())) {
        selected_users.push(user);
      }
    }

    try {
      await submitTimetable(selected_users);
      navigate('/dashboard/timetable');
    } catch (error) {
      console.error('Error submitting approvals:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (requestId: string) => {
    navigate(`/dashboard/approve/${requestId}`);
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
        padding: isMobile ? '8px' : '24px',
        boxSizing: 'border-box'
      }}>
        <Card sx={{
          height: isMobile ? 'calc(100vh - 16px)' : 'calc(100vh - 48px)',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper'
        }}>
          <CardHeader
            sx={{
              bgcolor: '#fbbf24',
              color: '#713f12',
              p: isMobile ? '12px 16px' : 3,
              '& .MuiCardHeader-content': {
                overflow: 'visible'
              }
            }}
            title={
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? 1 : 2,
                flexWrap: isMobile ? 'wrap' : 'nowrap'
              }}>
                <Typography variant={isMobile ? "h6" : "h5"} sx={{ mr: 'auto' }}>
                  Pending Approvals
                </Typography>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Checkbox
                    checked={selectedRequests.size === staffRequests.length}
                    indeterminate={selectedRequests.size > 0 && selectedRequests.size < staffRequests.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: '#713f12',
                      padding: isMobile ? '8px' : '12px'
                    }}
                  />
                  <Typography variant="body2" sx={{ minWidth: isMobile ? 'auto' : '80px' }}>
                    {selectedRequests.size} selected
                  </Typography>
                </div>
              </div>
            }
          />
          
          <CardContent
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 0,
              overflow: 'hidden'
            }}
          >
            {/* Scrollable content area */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: isMobile ? '12px' : '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '8px' : '16px'
            }}>
              {staffRequests.map((request) => (
                <Card
                  key={request._id}
                  sx={{
                    minHeight: isMobile ? '150px' : '110px',
                    position: 'relative',
                    border: '1px solid #fde68a',
                    bgcolor: selectedRequests.has(request._id.toString()) ? '#f0fdf4' : 'white'
                  }}
                >
                  <CardContent sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? 1 : 2,
                    p: isMobile ? '12px' : '16px',
                    '&:last-child': {
                      paddingBottom: isMobile ? '12px' : '16px'
                    }
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%'
                    }}>
                      <Checkbox
                        checked={selectedRequests.has(request._id.toString())}
                        onChange={() => handleSelectRequest(request._id.toString())}
                        sx={{ padding: isMobile ? '4px' : '8px' }}
                      />

                      <div style={{ flex: 1 }}>
                        <Typography
                          variant={isMobile ? "subtitle1" : "h6"}
                          color="#713f12"
                        >
                          {request.name}
                        </Typography>
                        <Typography variant="body2" color="#92400e">
                          Working Days: {request.workingDays}
                        </Typography>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: isMobile ? '100%' : 'auto',
                      marginTop: isMobile ? '8px' : 0
                    }}>
                      {request.hasRoomRequirement && (
                        <Chip
                          icon={<MeetingRoomIcon />}
                          label={isMobile ? "Equipment" : "Special equipment"}
                          size="small"
                          sx={{
                            bgcolor: '#fef3c7',
                            color: '#92400e',
                            border: '1px solid #fbbf24',
                            '& .MuiChip-icon': {
                              color: '#92400e'
                            }
                          }}
                        />
                      )}

                      <Button
                        variant="outlined"
                        startIcon={<InfoIcon />}
                        onClick={() => handleViewDetails(request._id.toString())}
                        sx={{
                          ml: 'auto',
                          minHeight: '36px'
                        }}
                      >
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {staffRequests.length === 0 && (
                <Typography
                  variant="body1"
                  color="#92400e"
                  sx={{ textAlign: 'center', mt: 4 }}
                >
                  No pending approval requests
                </Typography>
              )}
            </div>

            {/* Fixed bottom section */}
            <div style={{
              padding: isMobile ? '12px 16px' : '16px 24px',
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              {/* Cancel Button always shown */}
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  width: isMobile ? '100%' : '120px',
                  height: '48px',
                  mr: isMobile ? 0 : 2
                }}
              >
                Cancel
              </Button>

              {/* Approve button only shown if there are selected requests */}
              {selectedRequests.size > 0 && (
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleSubmitApprovals}
                  disabled={isSubmitting}
                  sx={{
                    bgcolor: '#15803d',
                    '&:hover': {
                      bgcolor: '#166534'
                    },
                    width: isMobile ? '100%' : '250px',
                    height: '48px'
                  }}
                >
                  Approve Selected
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
};

export default ApprovePage;