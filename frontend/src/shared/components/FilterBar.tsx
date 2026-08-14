import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Grid,
  Paper,
  Typography,
  Button,
  alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TuneIcon from '@mui/icons-material/Tune';
import { useCommodities, useDistricts, useMarkets, useStates } from '@/features/market/hooks/useMarketQueries';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/i18n';
import { ActiveFilterChips } from './ActiveFilterChips';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function FilterBar({ search, onSearchChange }: FilterBarProps) {
  const { filters, setFilters, resetFilters } = useAppStore();
  const { t } = useTranslation();
  const { data: states = [] } = useStates();
  const { data: districts = [] } = useDistricts(filters.state);
  const { data: markets = [] } = useMarkets(filters.district, filters.state);
  const { data: commodities = [] } = useCommodities();

  const hasFilters = !!(
    filters.state ||
    filters.district ||
    filters.market ||
    filters.commodity ||
    filters.areas ||
    search
  );

  const handleStateChange = (state: string) => {
    setFilters({
      state,
      district: '',
      market: '',
      commodity: filters.commodity,
      areas: state === 'Maharashtra' ? 'Mumbai,Pune,Manchar,Junnar' : '',
      quickArea: state === 'Maharashtra' ? 'all' : '',
    });
  };

  const handleDistrictChange = (district: string) => {
    setFilters({ district, market: '', areas: '', quickArea: '' });
  };

  const handleClearAll = () => {
    resetFilters();
    onSearchChange('');
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 3,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: (theme) => `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TuneIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" fontWeight={700}>
            {t('searchFilters')}
          </Typography>
        </Box>
        {hasFilters && (
          <Button
            size="small"
            color="inherit"
            startIcon={<ClearIcon />}
            onClick={handleClearAll}
            sx={{ color: 'text.secondary', fontWeight: 600 }}
          >
            {t('clearAll')}
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>{t('state')}</InputLabel>
            <Select value={filters.state} label={t('state')} onChange={(e) => handleStateChange(e.target.value)}>
              <MenuItem value="">{t('allStates')}</MenuItem>
              {states.map((s) => (
                <MenuItem key={s.id} value={s.name}>{s.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small" disabled={!filters.state}>
            <InputLabel>{t('district')}</InputLabel>
            <Select value={filters.district} label={t('district')} onChange={(e) => handleDistrictChange(e.target.value)}>
              <MenuItem value="">{t('allDistricts')}</MenuItem>
              {districts.map((d) => (
                <MenuItem key={d.id} value={d.name}>{d.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small" disabled={!filters.district}>
            <InputLabel>{t('market')}</InputLabel>
            <Select value={filters.market} label={t('market')} onChange={(e) => setFilters({ market: e.target.value, areas: '', quickArea: '' })}>
              <MenuItem value="">{t('allMarkets')}</MenuItem>
              {markets.map((m) => (
                <MenuItem key={m.id} value={m.name}>{m.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>{t('commodity')}</InputLabel>
            <Select value={filters.commodity} label={t('commodity')} onChange={(e) => setFilters({ commodity: e.target.value })}>
              <MenuItem value="">{t('allCommodities')}</MenuItem>
              {commodities.map((c) => (
                <MenuItem key={c.id} value={c.name}>{c.icon} {c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <ActiveFilterChips search={search} onSearchClear={() => onSearchChange('')} />
    </Paper>
  );
}
