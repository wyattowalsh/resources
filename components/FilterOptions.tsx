'use client';

import { FC } from 'react';
import { ComponentBaseProps } from '../types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface FilterOptionsProps extends ComponentBaseProps {
  initialTags: string[];
  onFilterChange: (tag: string) => void;
}

const FilterOptions: FC<FilterOptionsProps> = ({ 
  initialTags,
  onFilterChange,
  className 
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        onClick={() => onFilterChange('')}
        className="px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        All
      </button>
      {initialTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onFilterChange(tag)}
          className="px-3 py-1 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default FilterOptions;
