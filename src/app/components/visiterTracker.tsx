'use client';

import { useEffect, useRef, useCallback, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { api } from '../api/utils/apiService';

// Separate component that uses useSearchParams
function TrackerCore() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackedPages = useRef(new Set<string>());
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isTracking = useRef(false);

  const trackVisitor = useCallback(async (pageUrl: string) => {
    if (isTracking.current) return;

    try {
      isTracking.current = true;

      // Get visitor info
      const visitorData = {
        pageUrl: pageUrl,
        referrer: typeof document !== 'undefined' ? document.referrer : null,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        sessionId: typeof window !== 'undefined'
          ? sessionStorage.getItem('visitor_session_id') || Math.random().toString(36).substring(2, 15)
          : null,
        timestamp: new Date().toISOString()
      };

      // Store session ID
      if (typeof window !== 'undefined' && !sessionStorage.getItem('visitor_session_id')) {
        sessionStorage.setItem('visitor_session_id', visitorData.sessionId || '');
      }

      // Use the centralized API service
      const response = await api.post('/public/analytics/visitors', visitorData);

      if (response && response.success) {
        trackedPages.current.add(pageUrl);
      }
      // Silently handle errors
    } catch (error) {
      // Silently fail - visitor tracking should not break the app
    } finally {
      isTracking.current = false;
    }
  }, [pathname, searchParams]);

  const debouncedTrack = useCallback((pageUrl: string) => {
    // Skip if already tracked this exact URL
    if (trackedPages.current.has(pageUrl)) return;
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      trackVisitor(pageUrl);
    }, 200);
  }, [trackVisitor]);

  // Track route changes (App Router navigation)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const currentUrl = window.location.href;
    debouncedTrack(currentUrl);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [pathname, searchParams, debouncedTrack]);

  // Track initial page load and browser navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePageChange = () => {
      const currentUrl = window.location.href;
      debouncedTrack(currentUrl);
    };

    // Track initial load
    handlePageChange();

    // Track browser back/forward buttons
    const handlePopState = () => {
      setTimeout(handlePageChange, 100);
    };

    // Track focus return (user comes back to tab)
    const handleFocus = () => {
      const currentUrl = window.location.href;
      if (!trackedPages.current.has(currentUrl)) {
        debouncedTrack(currentUrl);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('focus', handleFocus);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [debouncedTrack]);

  return null;
}

// Main component wrapped with Suspense
export default function VisitorTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerCore />
    </Suspense>
  );
}