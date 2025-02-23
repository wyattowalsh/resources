import { useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/globals.css';
import '../styles/custom.css';

const PerformanceOptimizations = () => {
  useEffect(() => {
    // Lazy-load images
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      img.setAttribute('loading', 'lazy');
    });

    // Optimize resource loading
    const resources = document.querySelectorAll('link[rel="preload"], script[async]');
    resources.forEach((resource) => {
      resource.setAttribute('rel', 'preload');
    });

    // Add performance monitoring
    const performanceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log('Performance entry:', entry);
      });
    });
    performanceObserver.observe({ entryTypes: ['navigation', 'resource'] });

    // Implement code splitting
    if (typeof window !== 'undefined') {
      import(/* webpackChunkName: "heavyComponent" */ '../components/HeavyComponent')
        .then(({ default: HeavyComponent }) => {
          console.log('HeavyComponent loaded:', HeavyComponent);
        })
        .catch((error) => console.error('Error loading HeavyComponent:', error));
    }

    // Implement caching strategies
    if ('caches' in window) {
      caches.open('resource-cache').then((cache) => {
        cache.addAll([
          '/data/resources.json',
          '/data/star-data.json',
          '/styles/globals.css',
          '/styles/custom.css',
        ]);
      });
    }

    return () => {
      performanceObserver.disconnect();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="performance-optimizations">
        <h2 className="text-2xl font-bold mb-4">Performance Optimizations</h2>
        <p className="mb-4">
          This component implements lazy-loading, code splitting, caching strategies, and performance monitoring to enhance the user experience.
        </p>
      </div>
    </motion.div>
  );
};

export default PerformanceOptimizations;
