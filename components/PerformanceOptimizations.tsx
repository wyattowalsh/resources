"use client"

import { FC, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ComponentBaseProps } from '../types';
import '../styles/globals.css';
import '../styles/custom.css';

interface CacheConfig {
  paths: string[];
  cacheName: string;
}

interface PerformanceConfig {
  lazyLoadSelectors: string[];
  cacheConfig: CacheConfig;
  monitorEntryTypes: PerformanceEntryTypesString[];
}

interface PerformanceOptimizationsProps extends ComponentBaseProps {
  config?: Partial<PerformanceConfig>;
}

const defaultConfig: PerformanceConfig = {
  lazyLoadSelectors: ['img', 'iframe'],
  cacheConfig: {
    paths: [
      '/data/resources.json',
      '/data/star-data.json',
      '/styles/globals.css',
      '/styles/custom.css',
    ],
    cacheName: 'resource-cache'
  },
  monitorEntryTypes: ['navigation', 'resource', 'layout-shift', 'largest-contentful-paint']
};

const PerformanceOptimizations: FC<PerformanceOptimizationsProps> = ({ 
  config = defaultConfig,
  className 
}) => {
  useEffect(() => {
    // Lazy-load elements
    const elements = document.querySelectorAll(
      config.lazyLoadSelectors?.join(',') ?? defaultConfig.lazyLoadSelectors.join(',')
    );
    elements.forEach((element) => {
      if (element instanceof HTMLImageElement || element instanceof HTMLIFrameElement) {
        element.setAttribute('loading', 'lazy');
      }
    });

    // Resource optimization
    const resources = document.querySelectorAll('link[rel="preload"], script[async]');
    resources.forEach((resource) => {
      if (resource instanceof HTMLLinkElement || resource instanceof HTMLScriptElement) {
        resource.setAttribute('rel', 'preload');
      }
    });

    // Performance monitoring
    let performanceObserver: PerformanceObserver | undefined;
    
    try {
      performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Log performance metrics
          if (process.env.NODE_ENV === 'development') {
            console.log(`Performance entry (${entry.entryType}):`, {
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime,
              type: entry.entryType
            });
          }
        });
      });

      performanceObserver.observe({ 
        entryTypes: config.monitorEntryTypes ?? defaultConfig.monitorEntryTypes
      });
    } catch (error) {
      console.warn('PerformanceObserver not supported:', error);
    }

    // Implement caching strategy
    if ('caches' in window) {
      const cachePaths = config.cacheConfig?.paths ?? defaultConfig.cacheConfig.paths;
      const cacheName = config.cacheConfig?.cacheName ?? defaultConfig.cacheConfig.cacheName;

      caches.open(cacheName).then((cache) => {
        cache.addAll(cachePaths).catch((error) => {
          console.warn('Cache storage failed:', error);
        });
      });
    }

    // Cleanup
    return () => {
      performanceObserver?.disconnect();
    };
  }, [config]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`performance-optimizations ${className ?? ''}`}
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Performance Optimizations</h2>
        <p className="text-text-secondary">
          This component implements lazy-loading, code splitting, caching strategies, 
          and performance monitoring to enhance the user experience.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="text-sm text-text-secondary">
            <p>Active optimizations:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Lazy loading for images and iframes</li>
              <li>Resource preloading</li>
              <li>Performance monitoring</li>
              <li>Cache strategy implementation</li>
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PerformanceOptimizations;