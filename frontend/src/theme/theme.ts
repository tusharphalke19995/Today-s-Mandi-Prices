import { createTheme, alpha } from '@mui/material/styles';

const green = {
  50: '#eef7ef',
  100: '#d4edd6',
  200: '#a8dbad',
  300: '#72c47a',
  400: '#4caf50',
  500: '#3d9a42',
  600: '#2e7d32',
  700: '#256628',
  800: '#1b4d1f',
  900: '#0f3312',
};

const gold = {
  main: '#f9a825',
  light: '#ffd95a',
  dark: '#c17900',
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
        main: gold.main,
        light: gold.light,
        dark: gold.dark,
        contrastText: '#1a2e1a',
      },
      background: {
        default: darkMode ? '#0a100c' : '#f4faf4',
        paper: darkMode ? '#121a14' : '#ffffff',
      },
      success: { main: green[500], light: green[300] },
      warning: { main: '#ff9800' },
      text: {
        primary: darkMode ? '#eef7ef' : '#1a2e1a',
        secondary: darkMode ? alpha('#eef7ef', 0.72) : '#5a6f55',
      },
      divider: darkMode ? alpha('#fff', 0.08) : alpha(green[900], 0.08),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 800, letterSpacing: '-0.02em' },
      h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 800, letterSpacing: '-0.02em' },
      h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
      h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 800, letterSpacing: '-0.01em' },
      h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
      h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
      subtitle1: { fontWeight: 600 },
      button: { fontWeight: 700, letterSpacing: '0.02em' },
    },
    shape: { borderRadius: 16 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollBehavior: 'smooth',
            background: darkMode
              ? 'linear-gradient(180deg, #0a100c 0%, #0f1a12 100%)'
              : 'linear-gradient(180deg, #f8fcf8 0%, #eef7ef 50%, #f4faf4 100%)',
            backgroundAttachment: 'fixed',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 12,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow: darkMode
              ? '0 8px 32px rgba(0,0,0,0.4)'
              : '0 4px 24px rgba(46,125,50,0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
            '&.Mui-focused': {
              boxShadow: `0 0 0 3px ${alpha(green[600], 0.15)}`,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          },
        },
      },
    },
  });
