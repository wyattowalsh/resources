'use client';

import { Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResourceCard from '@/components/ResourceCard';
import ResourceForm from '@/components/ResourceForm';
import StarHistoryGraph from '@/components/StarHistoryGraph';
import StarCountDisplay from '@/components/StarCountDisplay';
import NetworkGraph from '@/components/NetworkGraph';
import FilterOptions from '@/components/FilterOptions';
import { Resource } from '@/types';
import Loading from './loading';

interface Props {
  initialResources: Resource[];
  initialTags: string[];
}

export default function ClientPage({ initialResources, initialTags }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <ResourceList initialResources={initialResources} initialTags={initialTags} />
    </Suspense>
  );
}

function ResourceList({ initialResources, initialTags }: Props) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [filteredResources, setFilteredResources] = useState<Resource[]>(initialResources);
  const [filterTag, setFilterTag] = useState<string>('');

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

  const getNetworkData = (resources: Resource[]) => ({
    nodes: resources.map(r => ({
      id: r.title,
      metadata: {
        creationDate: r.creationDate,
        lastUpdatedDate: r.lastUpdatedDate,
        description: r.description
      },
      category: r.tag,
      imageUrl: r.image
    })),
    links: resources.flatMap(resource => 
      (resource.relationships || []).map(rel => ({ 
        source: resource.title, 
        target: rel
      }))
    )
  });

  const getSelectedResourceNetwork = (resource: Resource) => ({
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
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FilterOptions onFilterChange={handleFilterChange} initialTags={initialTags} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <AnimatePresence>
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id || resource.url}
                    {...resource}
                    onClick={() => handleResourceClick(resource)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="space-y-8">
            <ResourceForm onAddResource={handleAddResource} initialTags={initialTags} />
            {selectedResource?.repo && (
              <>
                <StarCountDisplay repo={selectedResource.repo} />
                <StarHistoryGraph repo={selectedResource.repo} />
              </>
            )}
            <NetworkGraph
              data={selectedResource ? getSelectedResourceNetwork(selectedResource) : getNetworkData(resources)}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}