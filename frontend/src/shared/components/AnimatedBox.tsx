import { Box, BoxProps } from '@mui/material';
import { fadeInUp, slideDown, scaleIn, staggerDelay } from '@/theme/animations';

type AnimationType = 'fadeInUp' | 'slideDown' | 'scaleIn';

interface AnimatedBoxProps extends BoxProps {
  animation?: AnimationType;
  index?: number;
  delayMs?: number;
}

const animationMap = {
  fadeInUp,
  slideDown,
  scaleIn,
};

export function AnimatedBox({
  animation = 'fadeInUp',
  index = 0,
  delayMs = 70,
  sx,
  children,
  ...props
}: AnimatedBoxProps) {
  return (
    <Box
      sx={{
        opacity: 0,
        animation: `${animationMap[animation]} 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
        animationDelay: staggerDelay(index, delayMs),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
