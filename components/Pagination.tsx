import { FC, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { ComponentBaseProps } from '../types';
import '../styles/globals.css';
import '../styles/custom.css';

interface PaginationProps extends ComponentBaseProps {
  totalResources: number;
  resourcesPerPage: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  currentPage?: number;
}

const Pagination: FC<PaginationProps> = ({
  totalResources,
  resourcesPerPage,
  onPageChange,
  siblingCount = 1,
  currentPage: controlledPage,
  className
}) => {
  const [internalPage, setInternalPage] = useState(1);
  const currentPage = controlledPage ?? internalPage;
  const totalPages = Math.ceil(totalResources / resourcesPerPage);

  const handlePageChange = (pageNumber: number): void => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setInternalPage(pageNumber);
    onPageChange(pageNumber);
  };

  const paginationRange = useMemo(() => {
    const range = (start: number, end: number): number[] => {
      return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
    };

    const totalPageNumbers = siblingCount * 2 + 3;
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      return [...range(1, leftItemCount), -1, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      return [1, -1, ...range(totalPages - rightItemCount + 1, totalPages)];
    }

    return [
      1,
      -1,
      ...range(leftSiblingIndex, rightSiblingIndex),
      -1,
      totalPages
    ];
  }, [currentPage, totalPages, siblingCount]);

  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center justify-center space-x-2 ${className ?? ''}`}
    >
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
        className="px-2"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {paginationRange.map((pageNumber, idx) => {
        if (pageNumber === -1) {
          return (
            <Button
              key={`ellipsis-${idx}`}
              variant="ghost"
              disabled
              className="px-2"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          );
        }

        return (
          <Button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            variant={currentPage === pageNumber ? 'default' : 'outline'}
            size="sm"
            className="min-w-[2.5rem]"
          >
            {pageNumber}
          </Button>
        );
      })}

      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
        className="px-2"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default Pagination;