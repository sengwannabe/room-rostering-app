import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  ThemeProvider,
  useMediaQuery,
  useTheme,
  Chip
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { theme } from '../theme';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupIcon from '@mui/icons-material/Group';
import ScienceIcon from '@mui/icons-material/Science';
import { RoomDetails } from '../utils/type'
import { fetchRequestRoom } from '../api/room'

const RoomInformation: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [roomDetails, setRoomDetails] = useState<RoomDetails | undefined>();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
    const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetchRequestRoom(roomId);
        setRoomDetails(response);
      } catch (error) {
        console.error('Error loading room details');
        navigate(`/dashboard`);

      }
    };

    fetchRoomDetails();
  }, [roomId, navigate]);

  if (!roomDetails) {
    return null
  }
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
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MeetingRoomIcon /> {roomDetails.name}
              </Typography>
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
            {/* Room Capacity */}
            <Card sx={{ bgcolor: '#fef3c7', border: '1px solid #fde68a' }}>
              <CardContent>
                <Typography variant="h6" color="#713f12" sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}>
                  <GroupIcon /> Capacity
                </Typography>
                <Typography variant="body1" color="#92400e">
                  {roomDetails.attributes.capacity} people
                </Typography>
              </CardContent>
            </Card>

            {/* Equipment List */}
            <Card sx={{ bgcolor: '#fef3c7', border: '1px solid #fde68a' }}>
              <CardContent>
                <Typography variant="h6" color="#713f12" sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}>
                  <ScienceIcon /> Available Equipment
                </Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {roomDetails.attributes.equipment.map((item) => (
                    <Chip
                      key={item._id}
                      label={`${item.name} (${item.quantity})`}
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

            {/* Chemical Use Status */}
            {roomDetails.attributes.chemicalUse && (
              <Card sx={{ bgcolor: '#fef3c7', border: '1px solid #fde68a' }}>
                <CardContent>
                  <Typography variant="h6" color="#713f12" sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <ScienceIcon /> Chemical Access
                  </Typography>
                  <Typography variant="body1" color="#92400e">
                    This room has access to chemicals
                  </Typography>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
};

export default RoomInformation;