'use client';

import mixpanel from 'mixpanel-browser';
import { event as gtagEvent } from './gtag';

// Initialize Mixpanel
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '';

if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV === 'development',
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

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Track Event:', eventName, properties);
  }
}

/**
 * Set user properties in analytics tools
 */
export function identifyUser(userId: string, userProperties: TrackingEventProperties = {}) {
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