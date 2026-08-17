import { keyframes } from '@mui/material/styles';

export const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

export const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(3deg); }
`;

export const floatSlow = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

export const shimmer = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

export const pulseRing = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.08); opacity: 1; }
`;

export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.88); }
  to { opacity: 1; transform: scale(1); }
`;

export const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const popIn = keyframes`
  0% { transform: scale(0.85); opacity: 0; }
  70% { transform: scale(1.04); }
  100% { transform: scale(1); opacity: 1; }
`;

export function staggerDelay(index: number, stepMs = 70): string {
  return `${index * stepMs}ms`;
}
