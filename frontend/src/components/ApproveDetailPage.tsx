import React, { useEffect, useState, useCallback } from 'react';
import {
  Card, CardHeader, CardContent, Typography,
  ThemeProvider, useMediaQuery, useTheme,
  Divider, Chip
} from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { theme } from '../theme';
import { fetchUsers } from '../api/user';
import { StaffRequestDetail } from '../utils/type';
import { useParams } from 'react-router-dom';

const ApproveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [staffRequestDetail, setStaffRequestDetail] = useState<StaffRequestDetail>();

  const fetchRequestDetail = useCallback(async () => {
    try {
      const response = await fetchUsers();
      const allStaffDetails = response.map((staff: any) => {
        const availableDays = Object.entries(staff.unavailability)
          .filter(([_, isUnavailable]) => !isUnavailable)
          .map(([day]) => day);
        return {
          _id: staff._id,
          name: staff.name,
          dates: availableDays,
          roomRequirement: {
            capacity: staff.roomPreference.capacity,
            equipment: staff.roomPreference.equipment.map((item: any) => ({
              name: item.name,
              quantity: item.quantity
            })),
            needsChemicals: staff.roomPreference.chemicalUse
          }
        };
      });
      const userDetail = allStaffDetails.find((staff: StaffRequestDetail) => staff._id.toString() === id);
      setStaffRequestDetail(userDetail);
    } catch (error) {
      console.error('Error fetching staff requests:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchRequestDetail();
  }, [fetchRequestDetail]);

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
          height: isMobile ? 'calc(100vh - 24px)' : 'calc(100vh - 48px)',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper'
        }}>
          <CardHeader
            sx={{
              bgcolor: '#fbbf24',
              color: '#713f12',
              p: isMobile ? 2 : 3
            }}
            title={
              <Typography variant="h5">Review Request - {staffRequestDetail?.name}</Typography>
            }
          />
          
          <CardContent sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            p: isMobile ? 2 : 3,
            overflow: 'auto'
          }}>
            {/* Working Dates Section */}
            <Card sx={{ bgcolor: '#fef3c7', border: '1px solid #fde68a' }}>
              <CardContent>
                <Typography variant="h6" color="#713f12" sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}>
                  <CalendarTodayIcon /> Working Dates
                </Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {staffRequestDetail?.dates.map((day) => (
                    <Chip
                      key={day}
                      label={day}
                      sx={{
                        bgcolor: '#fbbf24',
                        color: '#713f12',
                        fontWeight: 500
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Room Requirements Section */}
            {staffRequestDetail?.roomRequirement && (
              <Card sx={{ bgcolor: '#fef3c7', border: '1px solid #fde68a' }}>
                <CardContent>
                  <Typography variant="h6" color="#713f12" sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2
                  }}>
                    <MeetingRoomIcon /> Room Requirements
                  </Typography>
                  
                  <Typography variant="body1" color="#92400e">
                    Capacity: {staffRequestDetail?.roomRequirement.capacity} people
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body1" color="#92400e" sx={{ mb: 1 }}>
                    Equipment Needed:
                  </Typography>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                    {staffRequestDetail?.roomRequirement.equipment.map((item, index) => (
                      <Chip
                        key={index}
                        label={`${item.name} (${item.quantity})`}
                        sx={{
                          bgcolor: '#fbbf24',
                          color: '#713f12'
                        }}
                      />
                    ))}
                  </div>
                  
                  {staffRequestDetail?.roomRequirement.needsChemicals && (
                    <Typography variant="body1" color="#92400e">
                      • Requires access to chemicals
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
};

export default ApproveDetailPage;