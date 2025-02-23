import { useState, useEffect } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownTrigger } from 'shadcn-ui';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import 'chart.js/auto';
import '../styles/globals.css';
import '../styles/custom.css';
import starData from '../data/star-data.json';

const StarHistoryGraph = ({ repo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [starHistory, setStarHistory] = useState([]);

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
    <div className="star-history-graph">
      <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
        <DropdownTrigger>
          <motion.button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Star History
          </motion.button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4"
            >
              <Line data={chartData} />
            </motion.div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default StarHistoryGraph;
