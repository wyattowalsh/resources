import { useState } from 'react';
import { Input, Button, Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Select, SelectItem } from 'shadcn-ui';
import { motion } from 'framer-motion';
import { z } from 'zod';
import '../styles/globals.css';
import '../styles/custom.css';

const ResourceForm = ({ onAddResource, tags }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [dateLastAccessed, setDateLastAccessed] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [jsonFile, setJsonFile] = useState(null);

  const resourceSchema = z.object({
    title: z.string().nonempty('Title is required'),
    description: z.string().nonempty('Description is required'),
    url: z.string().url('Invalid URL format').nonempty('URL is required'),
    notes: z.string().optional(),
    dateLastAccessed: z.string().optional(),
    summary: z.string().optional(),
    image: z.string().url('Invalid URL format').optional(),
    tag: z.string().nonempty('Tag is required'),
  });

  const validateForm = () => {
    try {
      resourceSchema.parse({ title, description, url, notes, dateLastAccessed, summary, image, tag: selectedTag || newTag });
      return {};
    } catch (e) {
      return e.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onAddResource({ title, description, url, notes, dateLastAccessed, summary, image, tag: selectedTag || newTag });
    setTitle('');
    setDescription('');
    setUrl('');
    setNotes('');
    setDateLastAccessed('');
    setSummary('');
    setImage('');
    setSelectedTag('');
    setNewTag('');
    setErrors({});
  };

  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const jsonData = JSON.parse(event.target.result);
        setTitle(jsonData.title || '');
        setDescription(jsonData.description || '');
        setUrl(jsonData.url || '');
        setNotes(jsonData.notes || '');
        setDateLastAccessed(jsonData.dateLastAccessed || '');
        setSummary(jsonData.summary || '');
        setImage(jsonData.image || '');
        setSelectedTag(jsonData.tag || '');
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Form onSubmit={handleSubmit} className="space-y-4">
        <FormItem>
          <FormLabel htmlFor="title">Title</FormLabel>
          <FormControl>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </FormControl>
          {errors.title && <FormMessage className="text-red-500">{errors.title}</FormMessage>}
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="description">Description</FormLabel>
          <FormControl>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </FormControl>
          {errors.description && <FormMessage className="text-red-500">{errors.description}</FormMessage>}
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="url">URL</FormLabel>
          <FormControl>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </FormControl>
          {errors.url && <FormMessage className="text-red-500">{errors.url}</FormMessage>}
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="notes">Notes</FormLabel>
          <FormControl>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="dateLastAccessed">Date Last Accessed</FormLabel>
          <FormControl>
            <Input
              id="dateLastAccessed"
              value={dateLastAccessed}
              onChange={(e) => setDateLastAccessed(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="summary">Summary</FormLabel>
          <FormControl>
            <Input
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="image">Image URL</FormLabel>
          <FormControl>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="tag">Tag</FormLabel>
          <FormControl>
            <Select
              id="tag"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            >
              <SelectItem value="">Select a tag</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </Select>
          </FormControl>
          {errors.tag && <FormMessage className="text-red-500">{errors.tag}</FormMessage>}
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="newTag">New Tag</FormLabel>
          <FormControl>
            <Input
              id="newTag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="jsonUpload">Upload JSON</FormLabel>
          <FormControl>
            <Input
              type="file"
              id="jsonUpload"
              accept=".json"
              onChange={handleJsonUpload}
              className="border border-gray-300 p-2 rounded"
            />
          </FormControl>
        </FormItem>
        <Button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add Resource
        </Button>
      </Form>
    </motion.div>
  );
};

export default ResourceForm;
