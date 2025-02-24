'use client';

import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Plus, Upload, Link, Image as ImageIcon, Hash, Calendar, FileText, GitFork } from 'lucide-react';
import { z } from 'zod';
import { Resource, ComponentBaseProps } from '../types';
import { Chart } from 'chart.js/auto';

interface ResourceFormProps extends ComponentBaseProps {
  onAddResource: (resource: Resource) => void;
  initialTags: string[];
}

const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  url: z.string().url('Invalid URL format').min(1, 'URL is required'),
  notes: z.string().optional(),
  dateLastAccessed: z.string().optional(),
  summary: z.string().optional(),
  image: z.string().optional(),
  tag: z.string().optional(),
  relationships: z.array(z.string()).optional()
});

const ResourceForm: FC<ResourceFormProps> = ({ 
  onAddResource, 
  initialTags,
  className 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    notes: '',
    dateLastAccessed: '',
    summary: '',
    image: '',
    tag: '',
    creationDate: '',
    lastUpdatedDate: ''
  });
  
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  const [relationships, setRelationships] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    try {
      resourceSchema.parse(formData);
      return {};
    } catch (e) {
      if (e instanceof z.ZodError) {
        return e.errors.reduce((acc, error) => ({
          ...acc,
          [error.path[0]]: error.message,
        }), {});
      }
      return {};
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleJsonUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string) as Partial<Resource>;
          setFormData({
            title: jsonData.title || '',
            description: jsonData.description || '',
            url: jsonData.url || '',
            notes: jsonData.notes || '',
            dateLastAccessed: jsonData.dateLastAccessed || '',
            summary: jsonData.summary || '',
            image: jsonData.image || '',
            tag: jsonData.tag || '',
            creationDate: '',
            lastUpdatedDate: ''
          });
          setRelationships(jsonData.relationships || []);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalTag = formData.tag || newTag;
    if (!finalTag) {
      setErrors(prev => ({ ...prev, tag: 'Either select a tag or create a new one' }));
      return;
    }

    onAddResource({
      ...formData,
      tag: finalTag,
      relationships,
    } as Resource);

    // Reset form
    setFormData({
      title: '',
      description: '',
      url: '',
      notes: '',
      dateLastAccessed: '',
      summary: '',
      image: '',
      tag: '',
      creationDate: '',
      lastUpdatedDate: ''
    });
    setNewTag('');
    setRelationships([]);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Add Resource</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="relative">
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Resource Title"
            className="pl-10"
          />
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        </div>

        <div className="relative">
          <Input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            placeholder="Resource URL"
            className="pl-10"
          />
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        </div>

        <div className="relative">
          <Input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="Image URL (optional)"
            className="pl-10"
          />
          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        </div>

        <div className="relative">
          <Input
            type="text"
            id="tag"
            name="tag"
            value={formData.tag}
            onChange={handleInputChange}
            placeholder="Tag"
            className="pl-10"
          />
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        </div>

        <div className="relative">
          <Input
            type="text"
            value={newTag}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTag(e.target.value)}
            placeholder="Or create a new tag"
            className="pl-10"
          />
          <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        </div>

        <div className="relative">
          <Input
            type="text"
            id="relationships"
            name="relationships"
            value={relationships.join(', ')}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRelationships(e.target.value.split(',').map((rel) => rel.trim()))}
            placeholder="Related Resources (comma-separated)"
            className="pl-10"
          />
          <GitFork className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        </div>

        <div className="col-span-2">
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="min-h-[100px]"
            placeholder="Resource description..."
          />
          {errors.description && (
            <span className="text-sm text-red-500">{errors.description}</span>
          )}
        </div>

        <div className="col-span-2">
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="min-h-[100px]"
            placeholder="Additional notes..."
          />
        </div>

        <div className="col-span-2">
          <div className="relative">
            <Input
              type="file"
              id="jsonUpload"
              accept=".json"
              onChange={handleJsonUpload}
              className="pl-10"
            />
            <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Add Resource
        </Button>
      </div>
    </form>
  );
};

export default ResourceForm;
