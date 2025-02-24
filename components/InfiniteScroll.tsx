import { FC, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ResourceCard from './ResourceCard';
import { Resource, ComponentBaseProps } from '../types';
import '../styles/globals.css';
import '../styles/custom.css';

interface InfiniteScrollProps extends ComponentBaseProps {
  resources: Resource[];
  pageSize?: number;
  loadingComponent?: React.ReactNode;
  onPageChange?: (page: number) => void;
}

const InfiniteScroll: FC<InfiniteScrollProps> = ({ 
  resources, 
  pageSize = 10,
  loadingComponent,
  onPageChange,
  className 
}) => {
  const [displayedResources, setDisplayedResources] = useState<Resource[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMoreResources = (): void => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;
      const newResources = resources.slice(startIndex, endIndex);
      
      setDisplayedResources(prev => [...prev, ...newResources]);
      setHasMore(endIndex < resources.length);
      onPageChange?.(page);
    };

    loadMoreResources();
  }, [page, resources, pageSize, onPageChange]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      },
      { 
        threshold: 0.5,
        rootMargin: '100px'
      }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [hasMore]);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedResources.map((resource, index) => (
          <motion.div
            key={`${resource.id || resource.url}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index % 3 * 0.1 }}
          >
            <ResourceCard {...resource} />
          </motion.div>
        ))}
      </div>
      
      {hasMore && (
        <div 
          ref={loader} 
          className="flex justify-center items-center py-8"
        >
          {loadingComponent || (
            <div className="animate-pulse text-text-secondary">
              Loading more resources...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;