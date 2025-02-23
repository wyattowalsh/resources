import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ResourceCard from '../components/ResourceCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ResourceForm from '../components/ResourceForm';
import StarHistoryGraph from '../components/StarHistoryGraph';
import StarCountDisplay from '../components/StarCountDisplay';
import NetworkGraph from '../components/NetworkGraph';
import FilterOptions from '../components/FilterOptions';
import PerformanceOptimizations from '../components/PerformanceOptimizations';
import '../styles/globals.css';
import '../styles/custom.css';

const Home = () => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [filteredResources, setFilteredResources] = useState([]);
  const [filterTag, setFilterTag] = useState('');

  useEffect(() => {
    fetch('/data/resources.json')
      .then((response) => response.json())
      .then((data) => {
        setResources(data.resources);
        setFilteredResources(data.resources);
      });
  }, []);

  const handleAddResource = (newResource) => {
    setResources([...resources, newResource]);
    setFilteredResources([...resources, newResource]);
  };

  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
  };

  const handleFilterChange = (tag) => {
    setFilterTag(tag);
    if (tag === '') {
      setFilteredResources(resources);
    } else {
      setFilteredResources(resources.filter(resource => resource.tags.includes(tag)));
    }
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8">Resource Collection</h1>
        <ResourceForm onAddResource={handleAddResource} tags={[]} />
        <FilterOptions onFilter={handleFilterChange} />
        <NetworkGraph data={{ nodes: resources, links: resources.flatMap(resource => resource.relationships.map(rel => ({ source: resource.title, target: rel }))) }} />
        {selectedResource && (
          <NetworkGraph data={{ nodes: [selectedResource, ...selectedResource.relationships.map(rel => resources.find(res => res.title === rel))], links: selectedResource.relationships.map(rel => ({ source: selectedResource.title, target: rel })) }} />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleResourceClick(resource)}
            >
              <ResourceCard
                title={resource.title}
                description={resource.description}
                url={resource.url}
                repo={resource.repo}
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
      </main>
      <Footer />
      <PerformanceOptimizations />
    </div>
  );
};

export default Home;
