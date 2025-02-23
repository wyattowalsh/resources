import { useState } from 'react';
import { Button } from 'shadcn-ui';
import { motion } from 'framer-motion';
import '../styles/globals.css';
import '../styles/custom.css';

const Pagination = ({ totalResources, resourcesPerPage, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalResources / resourcesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    onPageChange(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`mx-1 ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center mt-4"
    >
      {renderPageNumbers()}
    </motion.div>
  );
};

export default Pagination;
