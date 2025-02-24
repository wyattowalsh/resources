import { FC } from 'react';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { ComponentBaseProps } from '../types';
import 'chart.js/auto';
import '../styles/globals.css';
import '../styles/custom.css';
import starData from '../data/star-data.json';

interface StarHistoryGraphProps extends ComponentBaseProps {
  repo: string;
}

interface StarHistory {
  date: string;
  stars: number;
}

const StarHistoryGraph: FC<StarHistoryGraphProps> = ({ repo, className }) => {
  const [open, setOpen] = useState(false);
  const [starHistory, setStarHistory] = useState<StarHistory[]>([]);

  useEffect(() => {
    const project = starData.projects.find((project) => project.repo_name === repo);
    if (project) {
      setStarHistory(project.star_history);
    }
  }, [repo]);

  const chartData = {
    labels: starHistory.map((dataPoint) => dataPoint.date),
    datasets: [
      {
        label: 'Stars',
        data: starHistory.map((dataPoint) => dataPoint.stars),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div className={`star-history-graph ${className ?? ''}`}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <motion.button
            className="w-full p-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Star History
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px]">
          <DropdownMenuItem asChild>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 w-full"
            >
              <Line data={chartData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }} />
            </motion.div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StarHistoryGraph;
