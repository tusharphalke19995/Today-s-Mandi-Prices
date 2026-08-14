import { Grid, Card, CardContent, Skeleton, Box, alpha } from '@mui/material';

export function PriceCardSkeleton() {
  return (
    <Card sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
      <Box sx={{ height: 4, bgcolor: (t) => alpha(t.palette.primary.main, 0.3) }} />
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Skeleton variant="rounded" width={56} height={56} sx={{ borderRadius: 2.5 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="55%" height={28} />
            <Skeleton variant="rounded" width="40%" height={22} sx={{ mt: 0.5 }} />
          </Box>
        </Box>
        <Skeleton variant="rounded" height={88} sx={{ mb: 2, borderRadius: 2.5 }} />
        <Skeleton variant="rounded" height={6} sx={{ mb: 2, borderRadius: 3 }} />
        <Grid container spacing={1}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={6} key={i}>
              <Skeleton variant="rounded" height={52} />
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
          <PriceCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}
