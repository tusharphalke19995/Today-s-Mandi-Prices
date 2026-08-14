import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { PriceGridSkeleton } from '@/shared/components/PriceCardSkeleton';

const DashboardPage = lazy(() =>
  import('@/pages/Dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);

const CommodityDetailsPage = lazy(() =>
  import('@/pages/CommodityDetails/CommodityDetailsPage').then((m) => ({
    default: m.CommodityDetailsPage,
  })),
);

export function AppRoutes() {
  return (
    <Suspense fallback={<PriceGridSkeleton count={3} />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/commodity/:id" element={<CommodityDetailsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
