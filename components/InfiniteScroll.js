import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ResourceCard from './ResourceCard';
import '../styles/globals.css';
import '../styles/custom.css';

const InfiniteScroll = ({ resources }) => {
  const [displayedResources, setDisplayedResources] = useState([]);
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  useEffect(() => {
    const loadMoreResources = () => {
      const newResources = resources.slice((page - 1) * 10, page * 10);
      setDisplayedResources((prevResources) => [...prevResources, ...newResources]);
    };

    loadMoreResources();
  }, [page, resources]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedResources.map((resource) => (
          <motion.div
            key={resource.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ResourceCard
              title={resource.title}
              description={resource.description}
              url={resource.url}
            />
          </motion.div>
        ))}
      </div>
      <div ref={loader} className="loader">
        Loading more resources...
      </div>
    </div>
  );
};

export default InfiniteScroll;
