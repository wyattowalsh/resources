import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Input, Button, Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Select, SelectItem, Textarea } from 'shadcn-ui';
import { motion } from 'framer-motion';
import { Plus, Upload, Link, Image as ImageIcon, Hash, Calendar, FileText, GitFork } from 'lucide-react';
import { z } from 'zod';
import { Resource, ComponentBaseProps } from '../types';
import '../styles/globals.css';
import '../styles/custom.css';

const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  url: z.string().url('Invalid URL format').min(1, 'URL is required'),
  notes: z.string().optional(),
  dateLastAccessed: z.string().optional(),
  summary: z.string().optional(),
  image: z.string().url('Invalid URL format').optional(),
  tag: z.string().min(1, 'Tag is required'),
  relationships: z.array(z.string()).optional(),
});

type ResourceFormSchema = z.infer<typeof resourceSchema>;

interface ResourceFormProps extends ComponentBaseProps {
  onAddResource: (resource: Resource) => void;
  tags: string[];
  initialData?: Partial<Resource>;
}

interface FormErrors {
  [key: string]: string;
}

const ResourceForm: FC<ResourceFormProps> = ({ onAddResource, tags, initialData, className }) => {
  const [formData, setFormData] = useState<Partial<ResourceFormSchema>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    url: initialData?.url || '',
    notes: initialData?.notes || '',
    dateLastAccessed: initialData?.dateLastAccessed || '',
    summary: initialData?.summary || '',
    image: initialData?.image || '',
    tag: initialData?.tag || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [newTag, setNewTag] = useState<string>('');
  const [relationships, setRelationships] = useState<string[]>(initialData?.relationships || []);

  const validateForm = (): FormErrors => {
    try {
      resourceSchema.parse({ ...formData, relationships });
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
    });
    setNewTag('');
    setRelationships([]);
    setErrors({});
  };

  useEffect(() => {
    // Function to sync tag enums across the app
    const syncTagEnums = () => {
      // Fetch the latest tags from the schema or a central source
      fetch('/data/resources-schema.json')
        .then((response) => response.json())
        .then((data) => {
          const latestTags = data.properties.resources.items.properties.tags.items.enum;
          // Update the tags state with the latest tags
          setTags(latestTags);
        });
    };

    // Call the sync function on component mount
    syncTagEnums();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`max-w-2xl mx-auto bg-surface p-6 rounded-xl shadow-subtle ${className}`}
    >
      <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormItem className="col-span-2">
            <FormLabel htmlFor="title" className="text-base font-semibold text-text-primary">
              Resource Title
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="h-11 pl-10 border-2 focus:ring-2 ring-offset-2 ring-primary/20 transition-shadow"
                  placeholder="Enter resource title"
                />
                <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              </div>
            </FormControl>
            {errors.title && <FormMessage>{errors.title}</FormMessage>}
          </FormItem>

          <FormItem className="col-span-2">
            <FormLabel htmlFor="description" className="text-base font-semibold text-text-primary">
              Description
            </FormLabel>
            <FormControl>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-[100px] border-2 focus:ring-2 ring-offset-2 ring-primary/20"
                placeholder="Describe the resource..."
              />
            </FormControl>
            {errors.description && <FormMessage>{errors.description}</FormMessage>}
          </FormItem>

          <FormItem className="col-span-2">
            <FormLabel htmlFor="url" className="text-base font-semibold text-text-primary">
              Resource URL
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="h-11 pl-10 border-2 focus:ring-2 ring-offset-2 ring-primary/20"
                  placeholder="https://..."
                />
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              </div>
            </FormControl>
            {errors.url && <FormMessage>{errors.url}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="image" className="text-base font-semibold text-text-primary">
              Image URL
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="h-11 pl-10 border-2 focus:ring-2 ring-offset-2 ring-primary/20"
                  placeholder="Image URL..."
                />
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              </div>
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="dateLastAccessed" className="text-base font-semibold text-text-primary">
              Last Accessed
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  id="dateLastAccessed"
                  name="dateLastAccessed"
                  type="date"
                  value={formData.dateLastAccessed}
                  onChange={handleInputChange}
                  className="h-11 pl-10 border-2 focus:ring-2 ring-offset-2 ring-primary/20"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              </div>
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="tag" className="text-base font-semibold text-text-primary">
              Select Tag
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Select
                  id="tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleInputChange}
                  className="h-11 pl-10 border-2 focus:ring-2 ring-offset-2 ring-primary/20"
                >
                  <SelectItem value="">Choose a tag</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </Select>
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              </div>
            </FormControl>
            {errors.tag && <FormMessage>{errors.tag}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="newTag" className="text-base font-semibold text-text-primary">
              Create New Tag
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  id="newTag"
                  name="newTag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="h-11 pl-10 border-2 focus:ring-2 ring-offset-2 ring-primary/20"
                  placeholder="New tag name..."
                />
                <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              </div>
            </FormControl>
          </FormItem>

          <FormItem className="col-span-2">
            <FormLabel htmlFor="relationships" className="text-base font-semibold text-text-primary">
              Related Resources
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  id="relationships"
                  name="relationships"
                  value={relationships.join(', ')}
                  onChange={(e) => setRelationships(e.target.value.split(',').map((rel) => rel.trim()))}
                  className="h-11 pl-10 border-2 focus:ring-2 ring-offset-2 ring-primary/20"
                  placeholder="Comma-separated resource IDs..."
                />
                <GitFork className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              </div>
            </FormControl>
          </FormItem>

          <FormItem className="col-span-2">
            <FormLabel htmlFor="notes" className="text-base font-semibold text-text-primary">
              Additional Notes
            </FormLabel>
            <FormControl>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="min-h-[100px] border-2 focus:ring-2 ring-offset-2 ring-primary/20"
                placeholder="Any additional notes..."
              />
            </FormControl>
          </FormItem>

          <div className="col-span-2 space-y-4">
            <FormItem>
              <FormLabel htmlFor="jsonUpload" className="text-base font-semibold text-text-primary">
                Import from JSON
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="file"
                    id="jsonUpload"
                    accept=".json"
                    onChange={handleJsonUpload}
                    className="h-11 pl-10 border-2 focus:ring-2 ring-offset-2 ring-primary/20 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                </div>
              </FormControl>
            </FormItem>

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-sm transition-all duration-200 ease-in-out hover:shadow-md focus:ring-2 ring-offset-2 ring-primary/20"
            >
              Add Resource
            </Button>
          </div>
        </div>
      </Form>
    </motion.div>
  );
};

export default ResourceForm;
