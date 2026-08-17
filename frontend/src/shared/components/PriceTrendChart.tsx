import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Typography,
  alpha,
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import type { PriceHistory } from '@/features/market/models/types';
import { useTranslation } from '@/i18n';
import { formatCurrency } from '@/utils/formatters';

interface PriceTrendChartProps {
  title: string;
  days: 7 | 30;
  history?: PriceHistory;
  isLoading: boolean;
}

function formatChartDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'dd MMM');
  } catch {
    return dateStr;
  }
}

export function PriceTrendChart({ title, days, history, isLoading }: PriceTrendChartProps) {
  const { t } = useTranslation();
  const na = t('notAvailable');

  const chartData =
    history?.points.map((p) => ({
      date: formatChartDate(p.date),
      price: p.modal_price ?? 0,
      min: p.min_price,
      max: p.max_price,
    })) ?? [];

  const hasEnoughData = chartData.length >= 2;
  const change = history?.change_percent;
  const isUp = change != null && change >= 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: 1,
        borderColor: 'divider',
        height: '100%',
        minHeight: 340,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
        <ShowChartIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
        {history?.average_modal_price != null && (
          <Chip
            label={`${t('avgRate')}: ${formatCurrency(history.average_modal_price, na)}`}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ ml: { xs: 0, sm: 'auto' }, fontWeight: 700 }}
          />
        )}
        {change != null && hasEnoughData && (
          <Chip
            icon={isUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
            label={`${isUp ? '+' : ''}${change.toFixed(1)}%`}
            size="small"
            color={isUp ? 'success' : 'error'}
            sx={{ fontWeight: 700 }}
          />
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />

      {isLoading ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={36} />
        </Box>
      ) : !hasEnoughData ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
            borderRadius: 2,
            border: '2px dashed',
            borderColor: 'divider',
            px: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" textAlign="center" lineHeight={1.7}>
            {t('noHistoryData')}
          </Typography>
        </Box>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={days === 7 ? 220 : 240}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id={`lineGrad-${days}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1b5e20" />
                  <stop offset="100%" stopColor="#66bb6a" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: days === 30 ? 10 : 12 }}
                interval={days === 30 ? 'preserveStartEnd' : 0}
              />
              <YAxis
                tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
                width={48}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(v: number) => [formatCurrency(v, na), t('modalPrice')]}
                labelFormatter={(label) => label}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={`url(#lineGrad-${days})`}
                strokeWidth={3}
                dot={{ fill: '#2e7d32', r: days === 7 ? 4 : 2 }}
                activeDot={{ r: 6, fill: '#1b5e20' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {t('chartDailyModal')} · {chartData.length} {t('days')}
          </Typography>
        </>
      )}
    </Paper>
  );
}
