import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'shadcn-ui';
import { motion } from 'framer-motion';
import { ComponentBaseProps } from '../types';
import '../styles/globals.css';
import '../styles/custom.css';

interface GitHubStarCountProps extends ComponentBaseProps {
  repo: string;
  onCountChange?: (count: number) => void;
}

const GitHubStarCount: FC<GitHubStarCountProps> = ({ repo, onCountChange, className }) => {
  const [starCount, setStarCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStarCount = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/github-star-count?repo=${repo}`);
        if (!response.ok) {
          throw new Error('Failed to fetch star count');
        }
        const data = await response.json();
        setStarCount(data.starCount);
        onCountChange?.(data.starCount);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch star count');
        console.error('Error fetching star count:', err);
      }
    };

    fetchStarCount();
  }, [repo, onCountChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`github-star-count ${className ?? ''}`}
    >
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader>
          <CardTitle>GitHub Star Count</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-error">{error}</div>
          ) : (
            <p className="text-2xl font-bold">{starCount.toLocaleString()}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GitHubStarCount;