import { FC, useState, ChangeEvent } from 'react';
import { Select, SelectItem } from 'shadcn-ui';
import { motion } from 'framer-motion';
import { ComponentBaseProps } from '../types';
import '../styles/globals.css';
import '../styles/custom.css';

interface FilterOptionsProps extends ComponentBaseProps {
  onFilter: (tag: string, sort: string) => void;
  availableTags?: string[];
  sortOptions?: Array<{
    value: string;
    label: string;
  }>;
}

const defaultSortOptions = [
  { value: '', label: 'Sort By' },
  { value: 'date', label: 'Date' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' }
];

const FilterOptions: FC<FilterOptionsProps> = ({ 
  onFilter, 
  availableTags = [], 
  sortOptions = defaultSortOptions,
  className 
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('');

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedTag(e.target.value);
    onFilter(e.target.value, sortOption);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSortOption(e.target.value);
    onFilter(selectedTag, e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col md:flex-row gap-4 ${className ?? ''}`}
    >
      <Select
        value={selectedTag}
        onChange={handleSelectChange}
        className="flex-1 border border-gray-300 p-2 rounded focus:ring-2 ring-offset-2 ring-primary/20"
      >
        <SelectItem value="">All Tags</SelectItem>
        {availableTags.map((tag) => (
          <SelectItem key={tag} value={tag}>
            {tag}
          </SelectItem>
        ))}
      </Select>
      
      <Select
        value={sortOption}
        onChange={handleSortChange}
        className="flex-1 border border-gray-300 p-2 rounded focus:ring-2 ring-offset-2 ring-primary/20"
      >
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    </motion.div>
  );
};

export default FilterOptions;