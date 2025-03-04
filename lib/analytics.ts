'use client';

import mixpanel from 'mixpanel-browser';
import { event as gtagEvent } from './gtag';

const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true';
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '';

function hasAnalyticsConsent(): boolean {
  try {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) return false;
    const settings = JSON.parse(consent);
    return settings.analytics === true;
  } catch {
    return false;
  }
}

// Only initialize Mixpanel if we have consent
if (IS_PRODUCTION && MIXPANEL_TOKEN && hasAnalyticsConsent()) {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: false,
    track_pageview: true,
    persistence: 'localStorage'
  });
}

type TrackingEventProperties = {
  [key: string]: any;
};

/**
 * Unified tracking function that sends events to both Mixpanel and Google Analytics
 */
export function trackEvent(
  eventName: string,
  properties: TrackingEventProperties = {}
) {
  // Only track if we have consent
  // if (!hasAnalyticsConsent()) {
  //   console.log('Analytics tracking disabled - no consent');
  //   return;
  // }

  // Only track in production
  if (!IS_PRODUCTION) {
    console.log('📊 [DEV] Track Event:', eventName, properties);
    return;
  }

  // Track in Mixpanel
  if (MIXPANEL_TOKEN) {
    mixpanel.track(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }

  // Track in Google Analytics
  gtagEvent({
    action: eventName,
    category: properties.category || 'general',
    label: properties.label || eventName,
    value: properties.value,
  });
}

/**
 * Set user properties in analytics tools
 */
export function identifyUser(userId: string, userProperties: TrackingEventProperties = {}) {
  if (!IS_PRODUCTION) {
    console.log('📊 [DEV] Identify User:', userId, userProperties);
    return;
  }

  if (MIXPANEL_TOKEN) {
    mixpanel.identify(userId);
    mixpanel.people.set({
      ...userProperties,
      $last_seen: new Date().toISOString(),
    });
  }
}

/**
 * Reset user identification (for logout)
 */
export function resetAnalytics() {
  if (!IS_PRODUCTION) {
    console.log('📊 [DEV] Reset Analytics');
    return;
  }

  if (MIXPANEL_TOKEN) {
    mixpanel.reset();
  }
}

// Common event names to prevent typos
export const AnalyticsEvents = {
  PAGE_VIEW: 'page_view',
  SIGN_IN: 'sign_in',
  SIGN_OUT: 'sign_out',
  REVIEW_CREATED: 'review_created',
  REVIEW_LIKED: 'review_liked',
  TOOL_VIEWED: 'tool_viewed',
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  EXTERNAL_LINK_CLICKED: 'external_link_clicked',
} as const; 