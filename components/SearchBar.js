import { useState } from 'react';
import { Input } from 'shadcn-ui';
import { motion } from 'framer-motion';
import '../styles/globals.css';
import '../styles/custom.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search resources..."
        className="border border-gray-300 p-2 rounded"
      />
    </motion.div>
  );
};

export default SearchBar;
