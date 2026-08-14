import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Container,
  alpha,
  Stack,
} from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/i18n';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';

export function MainLayout() {
  const { darkMode, toggleDarkMode } = useAppStore();
  const { t } = useTranslation();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: 'blur(16px)',
          bgcolor: (theme) => alpha(theme.palette.background.paper, isHome ? 0.72 : 0.92),
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, gap: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
              mr: { xs: 0.5, sm: 1 },
              flexShrink: 0,
            }}
          >
            <AgricultureIcon sx={{ color: 'primary.main', fontSize: 22 }} />
          </Box>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: 800,
              textDecoration: 'none',
              color: 'text.primary',
              fontFamily: '"Poppins", sans-serif',
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              lineHeight: 1.3,
            }}
          >
            {t('appTitle')}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1 }}>
            <LanguageSwitcher compact />
            <IconButton
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              sx={{
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 2.5,
          textAlign: 'center',
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Container>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {t('footer')}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
