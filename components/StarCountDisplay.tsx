import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'shadcn-ui';
import { motion } from 'framer-motion';
import '../styles/globals.css';
import '../styles/custom.css';
import starData from '../data/star-data.json';

const StarCountDisplay = ({ repo }) => {
  const [starCount, setStarCount] = useState(0);

  useEffect(() => {
    const project = starData.projects.find((project) => project.repo_name === repo);
    if (project) {
      setStarCount(project.star_count);
    }
  }, [repo]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="star-count-display shadow-lg rounded-lg overflow-hidden">
        <CardHeader>
          <CardTitle>GitHub Star Count</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{starCount}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StarCountDisplay;
