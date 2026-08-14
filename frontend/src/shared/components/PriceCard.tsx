import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  alpha,
  useTheme,
  LinearProgress,
  Stack,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { TodayPrice } from '@/features/market/models/types';
import { useTranslation } from '@/i18n';
import { formatCurrency, formatUpdatedTime } from '@/utils/formatters';

interface PriceCardProps {
  price: TodayPrice;
  onClick?: () => void;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        p: 1.25,
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25, fontSize: '0.7rem' }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700} noWrap title={value}>
        {value}
      </Typography>
    </Box>
  );
}

function getPricePosition(modal?: number, min?: number, max?: number): number {
  if (modal == null || min == null || max == null || max <= min) return 50;
  return Math.min(100, Math.max(0, ((modal - min) / (max - min)) * 100));
}

export function PriceCard({ price, onClick }: PriceCardProps) {
  const theme = useTheme();
  const { t, language } = useTranslation();
  const pricePosition = getPricePosition(price.modal_price, price.min_price, price.max_price);
  const na = t('notAvailable');

  return (
    <Card
      sx={{
        height: '100%',
        overflow: 'hidden',
        border: 1,
        borderColor: alpha(theme.palette.primary.main, 0.12),
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.18)}`,
          borderColor: alpha(theme.palette.primary.main, 0.35),
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ height: '100%', alignItems: 'stretch' }}>
        <Box
          sx={{
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`,
          }}
        />
        <CardContent sx={{ p: 2.5, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                fontSize: '2.25rem',
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2.5,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                flexShrink: 0,
              }}
            >
              {price.commodity_icon || '🌾'}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={800} noWrap>
                {price.commodity}
              </Typography>
              <Stack direction="row" spacing={0.75} sx={{ mt: 0.75, flexWrap: 'wrap', gap: 0.75 }}>
                <Chip size="small" label={price.state} sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }} />
                <Chip
                  size="small"
                  variant="outlined"
                  icon={<StorefrontIcon sx={{ fontSize: '14px !important' }} />}
                  label={price.market}
                  sx={{ height: 22, fontSize: '0.7rem', maxWidth: '100%' }}
                />
              </Stack>
            </Box>
          </Box>

          <Box
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2.5,
              background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.14)} 0%, ${alpha(theme.palette.primary.light, 0.06)} 100%)`,
              textAlign: 'center',
            }}
          >
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.2, fontWeight: 700 }}>
              {t('modalPrice')}
            </Typography>
            <Typography variant="h4" color="primary.main" fontWeight={900} sx={{ lineHeight: 1.2, my: 0.5 }}>
              {formatCurrency(price.modal_price, na)}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {t('perQuintal')}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {t('min')} {formatCurrency(price.min_price, na)}
              </Typography>
              <Typography variant="caption" color="primary.main" fontWeight={700}>
                {t('modal')}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {t('max')} {formatCurrency(price.max_price, na)}
              </Typography>
            </Box>
            <Box sx={{ position: 'relative', px: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, ${theme.palette.success.light}, ${theme.palette.primary.main})`,
                    borderRadius: 3,
                  },
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: `${pricePosition}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  border: '2px solid white',
                  boxShadow: 1,
                }}
              />
            </Box>
          </Box>

          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <DetailItem label={t('minimum')} value={formatCurrency(price.min_price, na)} />
            </Grid>
            <Grid item xs={6}>
              <DetailItem label={t('maximum')} value={formatCurrency(price.max_price, na)} />
            </Grid>
            <Grid item xs={6}>
              <DetailItem label={t('district')} value={price.district} />
            </Grid>
            <Grid item xs={6}>
              <DetailItem label={t('market')} value={price.market} />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pt: 1.5,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {formatUpdatedTime(price.last_updated, na, t('today'), language)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, color: 'primary.main' }}>
              <Typography variant="caption" fontWeight={700}>
                {t('viewDetails')}
              </Typography>
              <ArrowForwardIcon sx={{ fontSize: 14 }} />
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
