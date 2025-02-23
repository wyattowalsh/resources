import { useState } from 'react';
import { Select, SelectItem } from 'shadcn-ui';
import { motion } from 'framer-motion';
import '../styles/globals.css';
import '../styles/custom.css';

const FilterOptions = ({ onFilter }) => {
  const [selectedTag, setSelectedTag] = useState('');
  const [sortOption, setSortOption] = useState('');

  const handleSelectChange = (e) => {
    setSelectedTag(e.target.value);
    onFilter(e.target.value, sortOption);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    onFilter(selectedTag, e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Select
        value={selectedTag}
        onChange={handleSelectChange}
        className="border border-gray-300 p-2 rounded"
      >
        <SelectItem value="">All</SelectItem>
        <SelectItem value="tag1">Tag 1</SelectItem>
        <SelectItem value="tag2">Tag 2</SelectItem>
        <SelectItem value="tag3">Tag 3</SelectItem>
      </Select>
      <Select
        value={sortOption}
        onChange={handleSortChange}
        className="border border-gray-300 p-2 rounded mt-4"
      >
        <SelectItem value="">Sort By</SelectItem>
        <SelectItem value="date">Date</SelectItem>
        <SelectItem value="popularity">Popularity</SelectItem>
        <SelectItem value="rating">Rating</SelectItem>
      </Select>
    </motion.div>
  );
};

export default FilterOptions;
