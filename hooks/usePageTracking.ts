'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/gtag';
import { trackEvent, AnalyticsEvents } from '@/lib/analytics';

export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + searchParams.toString();
      // Track in Google Analytics
      pageview(url);
      
      // Track in unified analytics
      trackEvent(AnalyticsEvents.PAGE_VIEW, {
        path: url,
        title: document.title,
      });
    }
  }, [pathname, searchParams]);
} 