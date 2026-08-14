import { createTheme, alpha } from '@mui/material/styles';

const green = {
  50: '#e8f5e9',
  100: '#c8e6c9',
  200: '#a5d6a7',
  300: '#81c784',
  400: '#66bb6a',
  500: '#4caf50',
  600: '#43a047',
  700: '#388e3c',
  800: '#2e7d32',
  900: '#1b5e20',
};

export const getTheme = (darkMode: boolean) =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: green[700],
        light: green[400],
        dark: green[900],
        contrastText: '#fff',
      },
      secondary: {
        main: '#ff8f00',
        light: '#ffc046',
        dark: '#c56000',
      },
      background: {
        default: darkMode ? '#0a120a' : '#f0f7f0',
        paper: darkMode ? '#142014' : '#ffffff',
      },
      success: { main: green[600] },
      text: {
        primary: darkMode ? '#e8f5e9' : '#1a2e1a',
        secondary: darkMode ? alpha('#e8f5e9', 0.7) : '#5a6f55',
      },
      divider: darkMode ? alpha('#fff', 0.08) : alpha(green[900], 0.08),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
      h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
      h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
      h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
      h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
      h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
      subtitle1: { fontWeight: 600 },
      button: { fontWeight: 600 },
    },
    shape: { borderRadius: 14 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollBehavior: 'smooth',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 10,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: darkMode
              ? '0 4px 24px rgba(0,0,0,0.35)'
              : '0 2px 16px rgba(46,125,50,0.06)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
        },
      },
    },
  });
