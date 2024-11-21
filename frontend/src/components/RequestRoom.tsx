import React, { useEffect, useState } from 'react';
import {
  Card, CardHeader, CardContent,
  Typography, ThemeProvider, useMediaQuery,
  useTheme, TextField, Autocomplete,
  Checkbox, Button, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions,
  FormControlLabel, IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { Equipment, RoomRequirementBackend } from '../utils/type';
import { apiCallPut } from '../utils/apiHelpers';
import { fetchEquipment } from '../api/equipment';
import { getUserData } from '../utils/storage';
import { fetchUserRequestRoom } from '../api/room';

const RequestRoom: React.FC = () => {
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // State
  const [capacity, setCapacity] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [needsChemicals, setNeedsChemicals] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentEquipment, setCurrentEquipment] = useState<string>('');
  const [currentQuantity, setCurrentQuantity] = useState<string>('1');
  const [equipmentOptions, setEquipmentOptions] = useState<Equipment[]>([]);
  // State to hold user data
  const [userId, setUserId] = useState<number | null>(null);

  // Fetch equipment
  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        const data = await fetchEquipment();
        setEquipmentOptions(data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    };

    fetchEquipmentData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = getUserData();
      if (userData && equipmentOptions.length > 0) {
        setUserId(userData._id);
        try {
          const response = await fetchUserRequestRoom(userData._id);
          if (response && response.requestDetails) {
            setCapacity(response.requestDetails.capacity.toString());
            setNeedsChemicals(response.requestDetails.chemicalUse);
            
            const equipmentWithDetails = response.requestDetails.equipment.map((eq: RoomRequirementBackend) => {
              const fullDetails = equipmentOptions.find(option => option._id === eq._id);
              return {
                _id: eq._id,
                name: eq.name,
                quantity: eq.quantity,
                dependentId: fullDetails?.dependentId || null
              };
            });
            setSelectedEquipment(equipmentWithDetails);
          }
        } catch (error) {
          console.error('Error fetching existing room request:', error);
        }
      }
    };

    fetchUserData();
  }, [equipmentOptions]);

  // Handlers
  const handleCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    setCapacity(value);
  };

  const handleEquipmentAdd = () => {
    if (!selectedEquipment.find(item => item.name === currentEquipment) && currentEquipment && parseInt(currentQuantity) > 0) {
      const equipmentItem = equipmentOptions.find(eq => eq.name === currentEquipment)
      if(equipmentItem) {
        setSelectedEquipment([
          ...selectedEquipment,
          {
            _id: equipmentItem._id,
            name: equipmentItem.name,
            quantity: parseInt(currentQuantity),
            dependentId: equipmentItem.dependentId
          }
        ]);
        setCurrentEquipment('');
        setCurrentQuantity('1');
        setDialogOpen(false);
      }
    }
  };

  const handleEquipmentDelete = (id: string) => {
    const dependentIds = [id];
    const removeIds = new Set();
    while (dependentIds.length > 0) {
      const originId = dependentIds.pop();
      removeIds.add(originId);
      selectedEquipment.forEach(item => {
        if (originId && !removeIds.has(item._id) && (item._id === originId || item.dependentId === parseInt(originId))) {
          dependentIds.push(item._id);
        }
      });
    }
    setSelectedEquipment(selectedEquipment.filter(item => !removeIds.has(item._id)));
  };

  const handleSubmit = async () => {
    if (!userId) {
      console.error('No user selected');
      return;
    }

    const payload = {
      userId,
      capacity: parseInt(capacity),
      chemicalUse: needsChemicals,
      equipment: selectedEquipment.map (eq => ({
        _id: eq._id,
        quantity: eq.quantity
      })),
    };

    try {
      await apiCallPut('put_room_preference', payload);
      navigate('/dashboard'); // Redirect on success
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  /**
   * Function determines if dependent equipments are to be disabled
   * @param option String name of equipment option
   * @returns boolean
   */
  const isOptionDisabled = (option: string) => {
    const optionEquipment = equipmentOptions.find(eq => eq.name === option);
    if (!optionEquipment) return true;

    // If dependentId is null, then equipment is available by default
    if (optionEquipment.dependentId === null) return false;

    // If the dependent equipment of the option is already selected, make option available to select
    return !selectedEquipment.some(eq => parseInt(eq._id) === optionEquipment.dependentId);
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
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              p: isMobile ? 2 : 3
            }}
            title={
              <Typography variant="h5">Request Room</Typography>
            }
          />

          <CardContent sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            p: isMobile ? 2 : 3
          }}>
            {/* Capacity Input */}
            <TextField
              label="Room Capacity"
              value={capacity}
              onChange={handleCapacityChange}
              type="text"
              fullWidth
              helperText="Enter the required room capacity"
            />

            {/* Equipment Section */}
            <div>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Equipment Needed</Typography>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                {selectedEquipment.map((item) => (
                  <Chip
                    key={item._id}
                    label={`${item.name} (${item.quantity})`}
                    onDelete={() => handleEquipmentDelete(item._id)}
                    sx={{ bgcolor: 'primary.light' }}
                  />
                ))}
              </div>
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                onClick={() => setDialogOpen(true)}
                sx={{ mt: 1 }}
              >
                Add Equipment
              </Button>
            </div>

            {/* Chemicals Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={needsChemicals}
                  onChange={(e) => setNeedsChemicals(e.target.checked)}
                />
              }
              label="Requires Access to Chemicals"
            />

            {/* Action Buttons */}
            <div style={{
              marginTop: 'auto',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px'
            }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!capacity}  // Submit with Room Capacity provided.
              >
                Submit Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Selection Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          Add Equipment
          <IconButton
            onClick={() => setDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            aria-label="Close dialog"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Autocomplete
              value={currentEquipment}
              onChange={(_, newValue) => setCurrentEquipment(newValue || '')}
              options={equipmentOptions.map(eq => eq.name)}
              getOptionDisabled={isOptionDisabled}
              renderInput={(params) => <TextField {...params} label="Equipment" />}
              renderOption={(props, option) => {
                const optionEquipment = equipmentOptions.find(eq => eq.name === option);
                const dependentEquipment = equipmentOptions.find(eq => parseInt(eq._id) === optionEquipment?.dependentId);
                const hoverText = dependentEquipment ? "Requires " + dependentEquipment.name : "No dependent equipment";
                const isDisabled = isOptionDisabled(option);
                return (
                  <Tooltip
                    title={hoverText}
                    disableHoverListener={!isDisabled}
                    key={optionEquipment?._id}
                  >
                    <span>
                      <li {...props} key={optionEquipment?._id}>
                        {option}
                      </li>
                    </span>
                  </Tooltip>
                )
              }}
            />
            <TextField
              label="Quantity"
              type="number"
              value={currentQuantity}
              onChange={(e) => setCurrentQuantity(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEquipmentAdd} disabled={!currentEquipment || parseInt(currentQuantity) < 1}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default RequestRoom;