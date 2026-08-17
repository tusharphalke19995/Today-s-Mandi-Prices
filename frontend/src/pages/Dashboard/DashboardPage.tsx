import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Pagination,
  Chip,
  alpha,
  Paper,
  Stack,
  Alert,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SyncIcon from '@mui/icons-material/Sync';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useNavigate } from 'react-router-dom';
import { FilterBar } from '@/shared/components/FilterBar';
import { QuickMarketChips } from '@/shared/components/QuickMarketChips';
import { PriceCard } from '@/shared/components/PriceCard';
import { PriceGridSkeleton } from '@/shared/components/PriceCardSkeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { useTodayPrices, useSyncStatus, resetApiWake } from '@/features/market/hooks/useMarketQueries';
import { useApiModeStore } from '@/store/apiModeStore';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/i18n';
import { useDebounce } from '@/utils/debounce';
import { getTodayFormatted, formatUpdatedTime } from '@/utils/formatters';
import { AnimatedBox } from '@/shared/components/AnimatedBox';
import { fadeIn, float, gradientShift } from '@/theme/animations';

export function DashboardPage() {
  const navigate = useNavigate();
  const { filters, selectedState, setFilters } = useAppStore();
  const { t, language } = useTranslation();
  const [search, setSearch] = useState(filters.search);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const activeState = filters.state || selectedState;

  const queryFilters = {
    state: filters.state || undefined,
    district: filters.district || undefined,
    market: filters.market || undefined,
    commodity: filters.commodity || undefined,
    search: debouncedSearch || undefined,
    areas: filters.areas || undefined,
    page,
    page_size: filters.areas?.includes(',') ? 48 : 12,
  };

  const { data, isLoading, isError, error, refetch, isFetching, dataUpdatedAt } = useTodayPrices(queryFilters);
  const { data: syncStatus } = useSyncStatus();
  const apiMode = useApiModeStore((s) => s.mode);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setFilters({ search: value });
    setPage(1);
  };

  const isOffline = error instanceof Error && error.message === 'NETWORK_ERROR' && apiMode !== 'fallback';
  const singleResult = data?.total === 1;
  const resultLabel = data?.total === 1 ? t('result') : t('results');

  const handleRetry = () => {
    resetApiWake();
    useApiModeStore.getState().setMode('checking');
    refetch();
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: (theme) =>
            `linear-gradient(-45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main}, #1b5e20, ${theme.palette.secondary.dark})`,
          backgroundSize: '400% 400%',
          animation: `${gradientShift} 12s ease infinite`,
          color: 'white',
          pt: { xs: 3, md: 5 },
          pb: { xs: 11, md: 12 },
        }}
      >
        {/* Floating crop icons */}
        {['🌾', '🍅', '🧅', '🥔'].map((emoji, i) => (
          <Box
            key={emoji}
            sx={{
              position: 'absolute',
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              opacity: 0.15,
              animation: `${float} ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
              top: `${15 + i * 12}%`,
              right: `${8 + i * 18}%`,
              pointerEvents: 'none',
            }}
          >
            {emoji}
          </Box>
        ))}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.06,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box sx={{ animation: `${fadeIn} 0.8s ease forwards` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, opacity: 0.95 }}>
                <WbSunnyIcon fontSize="small" sx={{ animation: `${float} 3s ease-in-out infinite` }} />
                <Typography variant="body2" fontWeight={600}>
                  {t('welcomeFarmer')}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  fontSize: { xs: '1.65rem', sm: '2rem', md: '2.35rem' },
                  lineHeight: 1.15,
                  fontFamily: '"Poppins", sans-serif',
                  textShadow: '0 2px 20px rgba(0,0,0,0.15)',
                }}
              >
                {t('heroTitle')}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.92, maxWidth: 520, lineHeight: 1.65 }}>
                {t('heroSubtitle')}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<CalendarTodayIcon sx={{ color: 'white !important' }} />}
                label={getTodayFormatted(language)}
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 700,
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${alpha('#fff', 0.25)}`,
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.04)' },
                }}
              />
              <Chip
                icon={<LocationOnIcon sx={{ color: 'white !important' }} />}
                label={activeState}
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 700,
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${alpha('#fff', 0.25)}`,
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.04)' },
                }}
              />
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: -8, md: -9 }, position: 'relative', zIndex: 2 }}>
        <AnimatedBox animation="slideDown" index={0}>
          <FilterBar search={search} onSearchChange={handleSearchChange} />
        </AnimatedBox>
        <AnimatedBox animation="fadeInUp" index={1} delayMs={100}>
          <QuickMarketChips onPageReset={() => setPage(1)} />
        </AnimatedBox>
        <AnimatedBox animation="fadeInUp" index={2} delayMs={100}>
          <Alert
            severity="info"
            icon={false}
            sx={{
              mt: 2,
              borderRadius: 3,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              color: 'text.primary',
              fontWeight: 600,
              border: 1,
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.15),
              '& .MuiAlert-message': { width: '100%' },
            }}
          >
            {t('sellTip')}
          </Alert>
        </AnimatedBox>
      </Container>

      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1.5,
            mb: 3,
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <TrendingUpIcon color="primary" fontSize="small" />
            <Typography variant="h6" fontWeight={800}>
              {t('marketPrices')}
            </Typography>
            <Chip
              size="small"
              icon={
                <FiberManualRecordIcon
                  sx={{
                    fontSize: '10px !important',
                    color: syncStatus?.sync_running ? 'warning.main' : 'success.main',
                  }}
                />
              }
              label={syncStatus?.sync_running ? t('syncingNow') : t('liveUpdates')}
              variant="outlined"
              color={syncStatus?.sync_running ? 'warning' : 'success'}
              sx={{ fontWeight: 600, maxWidth: '100%' }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            {syncStatus?.last_sync_at && (
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {t('lastSynced')}: {formatUpdatedTime(syncStatus.last_sync_at, '', t('today'), language)}
              </Typography>
            )}
            {(isFetching && !isLoading) || syncStatus?.sync_running ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <SyncIcon sx={{ fontSize: 16, animation: 'spin 1s linear infinite', '@keyframes spin': { to: { transform: 'rotate(360deg)' } } }} color="primary" />
                <Typography variant="caption" color="text.secondary">
                  {t('updating')}
                </Typography>
              </Box>
            ) : dataUpdatedAt ? (
              <Typography variant="caption" color="text.secondary">
                {t('updated')}: {formatUpdatedTime(new Date(dataUpdatedAt).toISOString(), '', t('today'), language)}
              </Typography>
            ) : null}
            {data && (
              <Chip
                size="small"
                label={`${data.total} ${resultLabel}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
            )}
          </Box>
        </Paper>

        {apiMode === 'fallback' && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2, fontWeight: 600 }}>
            {t('fallbackBanner')}
          </Alert>
        )}

        {isLoading && apiMode !== 'fallback' && (
          <>
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
              {t('serverWaking')} {t('serverWakingTip')}
            </Alert>
            <PriceGridSkeleton count={6} />
          </>
        )}

        {isOffline && (
          <EmptyState
            type="offline"
            title={t('serverTimeoutTitle')}
            message={t('serverTimeoutMessage')}
            onRetry={handleRetry}
          />
        )}

        {isError && !isOffline && (
          <EmptyState
            type="error"
            title={t('serverTimeoutTitle')}
            message={t('serverTimeoutMessage')}
            onRetry={handleRetry}
          />
        )}

        {!isLoading && !isError && data?.items.length === 0 && <EmptyState type="empty" />}

        {!isLoading && !isError && data && data.items.length > 0 && (
          <>
            <Grid container spacing={3} justifyContent={singleResult ? 'center' : 'flex-start'}>
              {data.items.map((price, index) => (
                <Grid
                  item
                  xs={12}
                  sm={singleResult ? 10 : 6}
                  md={singleResult ? 7 : 4}
                  lg={singleResult ? 5 : 4}
                  key={price.id ?? `${price.commodity}-${price.market}`}
                >
                  <PriceCard
                    price={price}
                    index={index}
                    onClick={() => price.id && navigate(`/commodity/${price.id}`)}
                  />
                </Grid>
              ))}
            </Grid>

            {data.total_pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Pagination
                  count={data.total_pages}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  color="primary"
                  shape="rounded"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
