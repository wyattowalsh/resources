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
          This component implements lazy-loading and other performance improvements to enhance the user experience.
        </p>
      </div>
    </motion.div>
  );
};

export default PerformanceOptimizations;
