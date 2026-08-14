import { Box, Chip, alpha } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppStore } from '@/store/appStore';

interface ActiveFilterChipsProps {
  search: string;
  onSearchClear: () => void;
}

export function ActiveFilterChips({ search, onSearchClear }: ActiveFilterChipsProps) {
  const { filters, setFilters } = useAppStore();

  const chips: { label: string; onDelete: () => void }[] = [];

  if (filters.areas) {
    chips.push({
      label: filters.quickArea === 'all' ? 'Mumbai, Pune, Manchar, Junnar' : filters.areas,
      onDelete: () => setFilters({ areas: '', quickArea: '', district: '', market: '' }),
    });
  }
  if (filters.state) {
    chips.push({ label: filters.state, onDelete: () => setFilters({ state: '', district: '', market: '' }) });
  }
  if (filters.district) {
    chips.push({ label: filters.district, onDelete: () => setFilters({ district: '', market: '' }) });
  }
  if (filters.market) {
    chips.push({ label: filters.market, onDelete: () => setFilters({ market: '' }) });
  }
  if (filters.commodity) {
    chips.push({ label: filters.commodity, onDelete: () => setFilters({ commodity: '' }) });
  }
  if (search) {
    chips.push({ label: `"${search}"`, onDelete: onSearchClear });
  }

  if (chips.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
      {chips.map((chip) => (
        <Chip
          key={chip.label}
          label={chip.label}
          size="small"
          onDelete={chip.onDelete}
          deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
          sx={{
            bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
            color: 'primary.dark',
            fontWeight: 600,
            '& .MuiChip-deleteIcon': { color: 'primary.main' },
          }}
        />
      ))}
    </Box>
  );
}
