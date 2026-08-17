import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  alpha,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate, useParams } from 'react-router-dom';
import { usePriceDetail, usePriceHistory } from '@/features/market/hooks/useMarketQueries';
import { PriceGridSkeleton } from '@/shared/components/PriceCardSkeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { PriceTrendChart } from '@/shared/components/PriceTrendChart';
import { useTranslation } from '@/i18n';
import { formatCurrency, formatDate, formatUpdatedTime } from '@/utils/formatters';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ py: 1.5 }}>
      <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={700}>
        {value}
      </Typography>
    </Box>
  );
}

export function CommodityDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const priceId = Number(id);
  const { data: price, isLoading, isError, refetch } = usePriceDetail(priceId);
  const { data: history7, isLoading: loading7 } = usePriceHistory(priceId, 7);
  const { data: history30, isLoading: loading30 } = usePriceHistory(priceId, 30);
  const na = t('notAvailable');

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <PriceGridSkeleton count={1} />
      </Container>
    );
  }

  if (isError || !price) {
    return (
      <Container maxWidth="lg">
        <EmptyState type="error" title={t('commodityNotFound')} onRetry={() => refetch()} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 3, fontWeight: 700 }}>
        {t('backToDashboard')}
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          border: 1,
          borderColor: 'divider',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
          <Box
            sx={{
              fontSize: '4rem',
              width: 96,
              height: 96,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }}
          >
            {price.commodity_icon || '🌾'}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              {price.commodity}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip label={price.state} size="small" color="primary" variant="outlined" />
              <Chip label={price.district} size="small" variant="outlined" />
              <Chip label={price.market} size="small" variant="outlined" />
            </Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {t('arrival')}: {formatDate(price.arrival_date, na, language)} · {t('updated')}:{' '}
              {formatUpdatedTime(price.last_updated, na, t('today'), language)}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 3,
            p: 3,
            borderRadius: 3,
            textAlign: 'center',
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.light, 0.06)} 100%)`,
          }}
        >
          <Typography variant="overline" color="text.secondary" fontWeight={700}>
            {t('todaysModalPrice')}
          </Typography>
          <Typography
            variant="h3"
            color="primary.main"
            fontWeight={800}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}
          >
            <TrendingUpIcon fontSize="large" />
            {formatCurrency(price.modal_price, na)}
            <Typography component="span" variant="h6" color="text.secondary">
              / {price.price_unit || t('perQuintal')}
            </Typography>
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={6} md={3}>
            <DetailRow label={t('minimum')} value={formatCurrency(price.min_price, na)} />
          </Grid>
          <Grid item xs={6} md={3}>
            <DetailRow label={t('maximum')} value={formatCurrency(price.max_price, na)} />
          </Grid>
          <Grid item xs={6} md={3}>
            <DetailRow
              label={t('arrivalQuantity')}
              value={
                price.arrival_quantity
                  ? `${price.arrival_quantity} ${price.arrival_unit || 'Quintal'}`
                  : na
              }
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <DetailRow label={t('market')} value={price.market} />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <PriceTrendChart
            title={t('sevenDayTrend')}
            days={7}
            history={history7}
            isLoading={loading7}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PriceTrendChart
            title={t('thirtyDayTrend')}
            days={30}
            history={history30}
            isLoading={loading30}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
