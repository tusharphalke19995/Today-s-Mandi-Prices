import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  alpha,
} from '@mui/material';
import { LANGUAGE_OPTIONS, useTranslation } from '@/i18n';
import type { Language } from '@/i18n/types';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useTranslation();

  const handleChange = (_: React.MouseEvent<HTMLElement>, value: Language | null) => {
    if (value) setLanguage(value);
  };

  return (
    <Box>
      {!compact && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
          भाषा / Language
        </Typography>
      )}
      <ToggleButtonGroup
        value={language}
        exclusive
        onChange={handleChange}
        size="small"
        sx={{
          bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
          borderRadius: 2,
          '& .MuiToggleButton-root': {
            px: { xs: 1, sm: 1.5 },
            py: 0.5,
            fontWeight: 700,
            fontSize: '0.75rem',
            border: 0,
            borderRadius: '8px !important',
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': { bgcolor: 'primary.dark' },
            },
          },
        }}
      >
        {LANGUAGE_OPTIONS.map((opt) => (
          <ToggleButton key={opt.code} value={opt.code} aria-label={opt.label}>
            {opt.native}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
