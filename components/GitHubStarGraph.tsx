import { FC, useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from 'framer-motion';
import { ComponentBaseProps } from '../types';
import 'chart.js/auto';
import '../styles/globals.css';
import '../styles/custom.css';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

interface StarData {
  date: string;
  count: number;
}

interface GraphData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

interface GitHubStarGraphProps extends ComponentBaseProps {
  repo: string;
  onDataLoad?: (data: StarData[]) => void;
}

const GitHubStarGraph: FC<GitHubStarGraphProps> = ({ repo, onDataLoad, className }) => {
  const [starData, setStarData] = useState<StarData[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStarHistory(repo);
  }, [repo]);

  useEffect(() => {
    if (starData.length > 0) {
      const ctx = document.getElementById('starGraph') as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions,
      });
    }
  }, [starData]);

  const fetchStarHistory = async (repo: string): Promise<void> => {
    try {
      const query = `
        query ($owner: String!, $name: String!) {
          repository(owner: $owner, name: $name) {
            stargazers(first: 100, orderBy: {field: STARRED_AT, direction: ASC}) {
              edges {
                starredAt
              }
            }
          }
        }
      `;

      const [owner, name] = repo.split('/');
      const variables = { owner, name };

      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        },
        body: JSON.stringify({ query, variables }),
      });

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      const processedData = processStarData(data);
      setStarData(processedData);
      onDataLoad?.(processedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch star history');
      console.error('Error fetching star history:', err);
    }
  };

  const processStarData = (data: any): StarData[] => {
    const edges = data.data.repository.stargazers.edges;
    return edges.map((edge: { starredAt: string }, index: number) => ({
      date: new Date(edge.starredAt).toLocaleDateString(),
      count: index + 1
    }));
  };

  const chartData: GraphData = {
    labels: starData.map(d => d.date),
    datasets: [{
      label: 'GitHub Stars',
      data: starData.map(d => d.count),
      fill: false,
      borderColor: 'var(--primary)',
      backgroundColor: 'var(--primary-dark)',
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Stars',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`github-star-graph ${className ?? ''}`}
    >
      {error ? (
        <div className="text-error p-4 rounded-lg bg-error/10">
          {error}
        </div>
      ) : (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger className="w-full">
            <canvas id="starGraph"></canvas>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {starData.map((data, index) => (
              <DropdownMenuItem key={index}>
                {data.date}: {data.count} stars
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </motion.div>
  );
};

export default GitHubStarGraph;
