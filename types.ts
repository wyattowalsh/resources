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
  repo?: string;
  tags?: string[];
  relationships?: string[];
  creationDate?: string;
  lastUpdatedDate?: string;
} {
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

export interface ComponentBaseProps {
  className?: string;
  children?: React.ReactNode;
}