import { Grid, Card, CardContent, Skeleton, Box, alpha } from '@mui/material';
import { fadeInUp, shimmer, staggerDelay } from '@/theme/animations';

function ShimmerSkeleton({ height, sx }: { height: number | string; sx?: object }) {
  return (
    <Skeleton
      variant="rounded"
      height={height}
      sx={{
        borderRadius: 2.5,
        bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
        '&::after': {
          background: (t) =>
            `linear-gradient(90deg, transparent, ${alpha(t.palette.primary.main, 0.12)}, transparent)`,
          animation: `${shimmer} 1.8s ease-in-out infinite`,
        },
        ...sx,
      }}
    />
  );
}

export function PriceCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <Card
      sx={{
        height: '100%',
        border: 1,
        borderColor: 'divider',
        opacity: 0,
        animation: `${fadeInUp} 0.5s ease forwards`,
        animationDelay: staggerDelay(index, 60),
      }}
    >
      <Box
        sx={{
          height: 5,
          background: (t) => `linear-gradient(90deg, ${alpha(t.palette.primary.main, 0.2)}, ${alpha(t.palette.secondary.main, 0.3)})`,
        }}
      />
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <ShimmerSkeleton height={58} sx={{ width: 58, borderRadius: 3 }} />
          <Box sx={{ flex: 1 }}>
            <ShimmerSkeleton height={28} sx={{ width: '55%', mb: 1 }} />
            <ShimmerSkeleton height={24} sx={{ width: '45%' }} />
          </Box>
        </Box>
        <ShimmerSkeleton height={96} sx={{ mb: 2 }} />
        <ShimmerSkeleton height={8} sx={{ mb: 2, borderRadius: 4 }} />
        <Grid container spacing={1}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={6} key={i}>
              <ShimmerSkeleton height={52} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export function PriceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12} sm={6} lg={4} key={i}>
          <PriceCardSkeleton index={i} />
        </Grid>
      ))}
    </Grid>
  );
}
