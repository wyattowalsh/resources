import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'shadcn-ui';
import { motion } from 'framer-motion';
import GitHubStarGraph from './GitHubStarGraph';
import GitHubStarCount from './GitHubStarCount';
import { useState } from 'react';

const ResourceCard = ({ title, description, url, repo }) => {
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleAddReview = (review) => {
    setReviews([...reviews, review]);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const fetchRecommendations = () => {
    // Fetch recommendations based on user preferences and browsing history
    // This is a placeholder function and should be implemented with actual logic
    setRecommendations([
      { title: 'Recommended Resource 1', url: '#' },
      { title: 'Recommended Resource 2', url: '#' },
    ]);
  };

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
          <div className="rating-section">
            <h3 className="text-lg font-bold">Rating: {rating}</h3>
            <button onClick={() => handleRatingChange(rating + 1)}>Rate</button>
          </div>
          <div className="reviews-section">
            <h3 className="text-lg font-bold">Reviews</h3>
            <ul>
              {reviews.map((review, index) => (
                <li key={index}>{review}</li>
              ))}
            </ul>
            <button onClick={() => handleAddReview('New Review')}>Add Review</button>
          </div>
          <div className="bookmark-section">
            <button onClick={handleBookmark}>
              {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
            </button>
          </div>
          <div className="recommendations-section">
            <h3 className="text-lg font-bold">Recommendations</h3>
            <ul>
              {recommendations.map((rec, index) => (
                <li key={index}>
                  <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {rec.title}
                  </a>
                </li>
              ))}
            </ul>
            <button onClick={fetchRecommendations}>Fetch Recommendations</button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResourceCard;
