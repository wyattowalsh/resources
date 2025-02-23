import { useState } from 'react';
import { Input, Button, Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from 'shadcn-ui';
import { motion } from 'framer-motion';
import { z } from 'zod';
import '../styles/globals.css';
import '../styles/custom.css';

const AddResourceForm = ({ onAddResource }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState({});

  const resourceSchema = z.object({
    title: z.string().nonempty('Title is required'),
    description: z.string().nonempty('Description is required'),
    url: z.string().url('Invalid URL format').nonempty('URL is required'),
  });

  const validateForm = () => {
    try {
      resourceSchema.parse({ title, description, url });
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
    onAddResource({ title, description, url });
    setTitle('');
    setDescription('');
    setUrl('');
    setErrors({});
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
        <Button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add Resource
        </Button>
      </Form>
    </motion.div>
  );
};

export default AddResourceForm;
