'use client';

import { usePageTracking } from '@/hooks/usePageTracking';

export function AnalyticsProvider() {
  usePageTracking();
  return null;
} 