import React from 'react';
import { Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ActionButtonsProps {
  isMobile: boolean;
  isManager: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isMobile, isManager }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate('/dashboard/edit-roster')
  };

  const handleRequestRoom = () => {
    navigate('/dashboard/request-room');
  };

  const handleAprroveClick = () => {
    navigate('/dashboard/approve');
  };

  return (
  <Card elevation={0}>
    <CardContent sx={{
      display: 'flex',
      gap: 2,
      mt: 2,
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      justifyContent: isMobile ? 'center' : 'flex-start'
    }}>
      <Button variant="contained" color="primary" onClick={handleEditClick} sx={{ flex: isMobile ? '1 1 calc(50% - 8px)' : 'initial' }}>
        Edit
      </Button>
      <Button variant="contained" color="primary" onClick={handleRequestRoom} sx={{ flex: isMobile ? '1 1 100%' : 'initial' }}>
        Request Room
      </Button>
      {isManager && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAprroveClick}
            sx={{ flex: isMobile ? '1 1 calc(50% - 8px)' : 'initial' }}
          >
            Approve
          </Button>
        )}
    </CardContent>
  </Card>
  );
};

export default ActionButtons;