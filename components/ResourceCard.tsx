import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'shadcn-ui';
import { motion } from 'framer-motion';
import { Star, Bookmark, Share2, ThumbsUp, MessageSquare } from 'lucide-react';
import GitHubStarGraph from './GitHubStarGraph';
import GitHubStarCount from './GitHubStarCount';
import { useState } from 'react';
import { Resource, ReviewType, RecommendationType } from '../types';

interface ResourceCardProps extends Partial<Resource> {
  onRatingChange?: (rating: number) => void;
  onBookmarkChange?: (isBookmarked: boolean) => void;
}

const ResourceCard: FC<ResourceCardProps> = ({ 
  title, 
  description, 
  url, 
  repo, 
  tags = [],
  onRatingChange,
  onBookmarkChange 
}) => {
  const [rating, setRating] = useState<number>(0);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<RecommendationType[]>([]);

  const handleRatingChange = (newRating: number): void => {
    setRating(newRating);
    onRatingChange?.(newRating);
  };

  const handleBookmark = (): void => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    onBookmarkChange?.(newBookmarkState);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="fade-in"
    >
      <Card className="resource-card">
        <CardHeader className="space-y-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <button
              onClick={handleBookmark}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors dark:hover:bg-gray-800"
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark
                className={`w-5 h-5 ${isBookmarked ? 'fill-current text-primary' : 'text-gray-400'}`}
              />
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <CardDescription className="text-text-secondary">{description}</CardDescription>
          
          <div className="flex items-center gap-4">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="button inline-flex items-center gap-2 text-sm"
            >
              <Share2 className="w-4 h-4" />
              Visit Resource
            </a>
            
            {rating > 0 && (
              <div className="flex items-center gap-1 text-accent">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">{rating}</span>
              </div>
            )}
          </div>

          {repo && (
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <GitHubStarCount repo={repo} />
              <GitHubStarGraph repo={repo} />
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => handleRatingChange(rating + 1)}
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary"
            >
              <ThumbsUp className="w-4 h-4" />
              Rate
            </button>
            {reviews.length > 0 && (
              <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
                <MessageSquare className="w-4 h-4" />
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResourceCard;