import { Box, Typography, Button, alpha, useTheme } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import { useTranslation } from '@/i18n';
import { fadeInUp, floatSlow } from '@/theme/animations';

interface EmptyStateProps {
  type?: 'empty' | 'error' | 'offline';
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function EmptyState({
  type = 'empty',
  title,
  message,
  onRetry,
}: EmptyStateProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const config = {
    empty: {
      icon: <SearchOffIcon sx={{ fontSize: 64 }} />,
      title: title || t('emptyTitle'),
      message: message || t('emptyMessage'),
      color: theme.palette.text.secondary,
    },
    error: {
      icon: <ErrorOutlineIcon sx={{ fontSize: 64 }} />,
      title: title || t('errorTitle'),
      message: message || t('errorMessage'),
      color: theme.palette.error.main,
    },
    offline: {
      icon: <WifiOffIcon sx={{ fontSize: 64 }} />,
      title: title || t('offlineTitle'),
      message: message || t('offlineMessage'),
      color: theme.palette.warning.main,
    },
  }[type];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
        animation: `${fadeInUp} 0.6s ease forwards`,
      }}
    >
      <Box
        sx={{
          color: config.color,
          mb: 2,
          p: 2.5,
          borderRadius: '50%',
          bgcolor: alpha(config.color, 0.1),
          animation: `${floatSlow} 3s ease-in-out infinite`,
        }}
      >
        {config.icon}
      </Box>
      <Typography variant="h6" gutterBottom fontWeight={700}>
        {config.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420, mb: 3, lineHeight: 1.6 }}>
        {config.message}
      </Typography>
      {onRetry && (
        <Button variant="contained" size="large" onClick={onRetry} startIcon={<AgricultureIcon />}>
          {t('tryAgain')}
        </Button>
      )}
    </Box>
  );
}
