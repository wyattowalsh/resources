import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ResourceCard from '../components/ResourceCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css';
import '../styles/custom.css';

const Home = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetch('/data/resources.json')
      .then((response) => response.json())
      .then((data) => setResources(data.resources));
  }, []);

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8">Resource Collection</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
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
      </main>
      <Footer />
    </div>
  );
};

export default Home;
