import { FC, useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { ComponentBaseProps } from '../types';
import '../styles/globals.css';
import '../styles/custom.css';

interface SearchBarProps extends ComponentBaseProps {
  onSearch: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch, className }) => {
  const [query, setQuery] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search resources..."
        className="border border-gray-300 p-2 rounded focus:ring-2 ring-offset-2 ring-primary/20"
      />
    </motion.div>
  );
};

export default SearchBar;