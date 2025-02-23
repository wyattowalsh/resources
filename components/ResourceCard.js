import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'shadcn-ui';
import { motion } from 'framer-motion';
import GitHubStarGraph from './GitHubStarGraph';
import GitHubStarCount from './GitHubStarCount';

const ResourceCard = ({ title, description, url, repo }) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Visit Resource
          </a>
          {repo && (
            <>
              <GitHubStarCount repo={repo} />
              <GitHubStarGraph repo={repo} />
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResourceCard;
