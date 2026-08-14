import { Box, Chip, Stack, Typography } from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/i18n';
import type { TranslationKey } from '@/i18n/types';

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
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <LocationCityIcon fontSize="small" color="primary" />
        <Typography variant="subtitle2" fontWeight={700}>
          {t('quickMarkets')}
        </Typography>
      </Stack>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {QUICK_MARKETS.map((market) => (
          <Chip
            key={market.id}
            label={t(market.labelKey)}
            clickable
            color={active === market.id ? 'primary' : 'default'}
            variant={active === market.id ? 'filled' : 'outlined'}
            onClick={() => selectMarket(market)}
            sx={{ fontWeight: 600 }}
          />
        ))}
      </Box>
    </Box>
  );
}
