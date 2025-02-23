import { useState, useEffect } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownTrigger } from 'shadcn-ui';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import 'chart.js/auto';
import '../styles/globals.css';
import '../styles/custom.css';

const GitHubStarGraph = ({ repo }) => {
  const [starData, setStarData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchStarHistory(repo);
  }, [repo]);

  const fetchStarHistory = async (repo) => {
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

    const variables = {
      owner: repo.split('/')[0],
      name: repo.split('/')[1],
    };

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    const starHistory = result.data.repository.stargazers.edges.map((edge) => ({
      date: edge.starredAt,
      stars: 1,
    }));

    setStarData(starHistory);
  };

  const chartData = {
    labels: starData.map((dataPoint) => dataPoint.date),
    datasets: [
      {
        label: 'Stars',
        data: starData.map((dataPoint) => dataPoint.stars),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div className="github-star-graph">
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

export default GitHubStarGraph;
