import React, { useEffect, useState} from 'react';
import {
  Card, Typography, Box, Container, List,
  ListItem, ListItemButton, ListItemText, ListItemIcon, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { saveUserData } from '../utils/storage';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import BiotechIcon from '@mui/icons-material/Biotech';
import { User } from '../utils/type';
import { fetchUsers } from '../api/user';

const MaterialHomePage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  const handleUserSelection = (user: User) => {
    saveUserData({
      _id: user._id,
      name: user.name,
      isManager: user.isManager,
      unavailability: user.unavailability
    });
    navigate('/dashboard');
  };

  const fetchAndProcessUsers = async () => {
    try {
      const response = await fetchUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchAndProcessUsers();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#fefce8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            padding: '2rem',
            backgroundColor: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
          }}
        >
          <Box sx={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                color: '#854d0e',
                marginBottom: '0.5rem',
              }}
            >
              Laboratory Portal
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#ca8a04',
                fontSize: '0.875rem',
              }}
            >
              Select your name to continue
            </Typography>
          </Box>

          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {users.map((user) => (
              <ListItem
                key={user._id}
                disablePadding
                sx={{
                  mb: 1,
                  bgcolor: '#fefce8',
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: '#fef3c7',
                  },
                }}
              >
                <ListItemButton
                  onClick={() => handleUserSelection(user)}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>
                    {user.isManager ? (
                      <BiotechIcon sx={{ color: '#ca8a04' }} />
                    ) : (
                      <SportsMartialArtsIcon sx={{ color: '#ca8a04' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        component="div"
                        sx={{
                          color: '#854d0e',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        {user.name}
                        <Chip
                          label={user.isManager ? 'Manager' : 'Staff'}
                          size="small"
                          sx={{
                            bgcolor: user.isManager ? '#fbbf24' : '#d9f99d',
                            color: user.isManager ? '#92400e' : '#365314',
                            fontWeight: 500,
                          }}
                        />
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Card>

        <Typography
          sx={{
            textAlign: 'center',
            marginTop: '1.5rem',
            color: '#ca8a04',
            fontSize: '0.875rem',
          }}
        >
          © 2024 Laboratory Management System
        </Typography>
      </Container>
    </Box>
  );
};

export default MaterialHomePage;