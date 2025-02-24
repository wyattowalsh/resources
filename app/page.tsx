import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResourceCard from '@/components/ResourceCard';
import ResourceForm from '@/components/ResourceForm';
import StarHistoryGraph from '@/components/StarHistoryGraph';
import StarCountDisplay from '@/components/StarCountDisplay';
import NetworkGraph from '@/components/NetworkGraph';
import FilterOptions from '@/components/FilterOptions';
import { Resource } from '@/types';
import Loading from './loading';

interface NetworkData {
  nodes: { id: string }[];
  links: { source: string; target: string }[];
}

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Resource Collection</h1>
      
      <Suspense fallback={<Loading />}>
        <ResourceList />
      </Suspense>
    </main>
  );
}

function ResourceList() {
  'use client';
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [filterTag, setFilterTag] = useState<string>('');

  useEffect(() => {
    fetch('/data/resources.json')
      .then((response) => response.json())
      .then((data) => {
        setResources(data.resources);
        setFilteredResources(data.resources);
      });
  }, []);

  const handleAddResource = (newResource: Resource): void => {
    setResources(prev => [...prev, newResource]);
    setFilteredResources(prev => [...prev, newResource]);
  };

  const handleResourceClick = (resource: Resource): void => {
    setSelectedResource(resource);
  };

  const handleFilterChange = (tag: string): void => {
    setFilterTag(tag);
    if (tag === '') {
      setFilteredResources(resources);
    } else {
      setFilteredResources(resources.filter(resource => resource.tags?.includes(tag)));
    }
  };

  const getNetworkData = (resources: Resource[]): NetworkData => ({
    nodes: resources.map(r => ({ id: r.title })),
    links: resources.flatMap(resource => 
      (resource.relationships || []).map(rel => ({ 
        source: resource.title, 
        target: rel 
      }))
    )
  });

  const getSelectedResourceNetwork = (resource: Resource): NetworkData => ({
    nodes: [
      { id: resource.title },
      ...(resource.relationships || [])
        .map(rel => resources.find(r => r.title === rel))
        .filter((r): r is Resource => r !== undefined)
        .map(r => ({ id: r.title }))
    ],
    links: (resource.relationships || []).map(rel => ({
      source: resource.title,
      target: rel
    }))
  });

  return (
    <>
      <ResourceForm onAddResource={handleAddResource} tags={[]} />
      <FilterOptions onFilter={handleFilterChange} />
      
      <NetworkGraph data={getNetworkData(resources)} />
      {selectedResource && (
        <NetworkGraph data={getSelectedResourceNetwork(selectedResource)} />
      )}

      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleResourceClick(resource)}
            >
              <ResourceCard
                title={resource.title}
                description={resource.description}
                url={resource.url}
                repo={resource.repo || ''}
                tags={resource.tags}
              />
              {resource.repo && (
                <>
                  <StarCountDisplay repo={resource.repo} />
                  <StarHistoryGraph repo={resource.repo} />
                </>
              )}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </>
  );
}
