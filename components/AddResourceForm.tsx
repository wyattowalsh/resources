import { FC } from 'react';
import { Resource, ComponentBaseProps } from '../types';
import ResourceForm from './ResourceForm';

interface AddResourceFormProps extends ComponentBaseProps {
  onAddResource: (resource: Resource) => void;
}

const AddResourceForm: FC<AddResourceFormProps> = ({ onAddResource, className }) => {
  // Provide a simplified interface to ResourceForm with basic tags
  const defaultTags = ['documentation', 'tutorial', 'tool', 'article', 'video'];

  return (
    <ResourceForm
      onAddResource={onAddResource}
      tags={defaultTags}
      className={className}
    />
  );
};

export default AddResourceForm;