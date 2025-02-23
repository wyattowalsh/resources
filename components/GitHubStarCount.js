import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'shadcn-ui';
import { motion } from 'framer-motion';
import '../styles/globals.css';
import '../styles/custom.css';

const GitHubStarCount = ({ repo }) => {
  const [starCount, setStarCount] = useState(0);

  useEffect(() => {
    fetch(`/api/github-star-count?repo=${repo}`)
      .then((response) => response.json())
      .then((data) => setStarCount(data.starCount));
  }, [repo]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="github-star-count shadow-lg rounded-lg overflow-hidden">
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

export default GitHubStarCount;
