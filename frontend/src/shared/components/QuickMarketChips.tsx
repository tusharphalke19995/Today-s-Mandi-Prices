import { Box, Chip, Stack, Typography } from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/i18n';
import type { TranslationKey } from '@/i18n/types';
import { popIn, staggerDelay } from '@/theme/animations';

const QUICK_MARKETS: {
  id: string;
  labelKey: TranslationKey;
  areas: string;
  state: string;
  district: string;
  market: string;
}[] = [
  {
    id: 'all',
    labelKey: 'allLocalAreas',
    areas: 'Mumbai,Pune,Manchar,Junnar',
    state: 'Maharashtra',
    district: '',
    market: '',
  },
  {
    id: 'mumbai',
    labelKey: 'mumbai',
    areas: 'Mumbai',
    state: 'Maharashtra',
    district: 'Mumbai',
    market: '',
  },
  {
    id: 'pune',
    labelKey: 'pune',
    areas: 'Pune',
    state: 'Maharashtra',
    district: 'Pune',
    market: 'Pune APMC',
  },
  {
    id: 'manchar',
    labelKey: 'manchar',
    areas: 'Manchar',
    state: 'Maharashtra',
    district: '',
    market: 'Manchar',
  },
  {
    id: 'junnar',
    labelKey: 'junnar',
    areas: 'Junnar',
    state: 'Maharashtra',
    district: '',
    market: 'Junnar',
  },
];

interface QuickMarketChipsProps {
  onPageReset: () => void;
}

export function QuickMarketChips({ onPageReset }: QuickMarketChipsProps) {
  const { filters, setFilters } = useAppStore();
  const { t } = useTranslation();
  const active = filters.quickArea;

  const selectMarket = (market: (typeof QUICK_MARKETS)[number]) => {
    setFilters({
      state: market.state,
      district: market.district,
      market: market.market,
      areas: market.areas,
      quickArea: market.id,
    });
    onPageReset();
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.25 }}>
        <LocationCityIcon fontSize="small" color="primary" />
        <Typography variant="subtitle2" fontWeight={800} sx={{ fontFamily: '"Poppins", sans-serif' }}>
          {t('quickMarkets')}
        </Typography>
      </Stack>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {QUICK_MARKETS.map((market, i) => {
          const isActive = active === market.id;
          return (
            <Chip
              key={market.id}
              label={t(market.labelKey)}
              clickable
              color={isActive ? 'primary' : 'default'}
              variant={isActive ? 'filled' : 'outlined'}
              onClick={() => selectMarket(market)}
              sx={{
                fontWeight: 700,
                opacity: 0,
                animation: `${popIn} 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                animationDelay: staggerDelay(i, 50),
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                ...(isActive && {
                  boxShadow: (theme) => `0 4px 14px ${theme.palette.primary.main}44`,
                }),
                '&:hover': {
                  transform: 'scale(1.06)',
                  boxShadow: (theme) => `0 6px 16px ${theme.palette.primary.main}33`,
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}
