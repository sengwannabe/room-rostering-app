import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FCD34D',
      light: '#FDE68A',
      dark: '#F59E0B',
      contrastText: '#000000',
    },
    background: {
      default: '#FFFBEB',
      paper: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B',
      light: '#FDE68A',
      dark: '#D97706',
    },
  },
});
