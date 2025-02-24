export interface Resource {
  id?: string;
  title: string;
  description: string;
  url: string;
  notes?: string;
  dateLastAccessed?: string;
  summary?: string;
  image?: string;
  tag?: string;
  tags?: string[];
  repo?: string;
  creationDate?: string;
  lastUpdatedDate?: string;
  relationships?: string[];
}

export interface ReviewType {
  id: string;
  content: string;
  rating: number;
  userId: string;
  createdAt: string;
}

export interface RecommendationType {
  title: string;
  url: string;
  similarity: number;
}

export interface NetworkNode {
  id: string;
  metadata?: {
    creationDate?: string;
    lastUpdatedDate?: string;
    description?: string;
  };
  category?: string;
  imageUrl?: string;
}

export interface NetworkLink {
  source: string;
  target: string;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

export interface ComponentBaseProps {
  className?: string;
  children?: React.ReactNode;
}