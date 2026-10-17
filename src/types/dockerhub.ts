export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface HubRepository {
  name: string;
  namespace: string;
  repository_type: string | null;
  status_description: string;
  description: string;
  is_private: boolean;
  star_count: number;
  pull_count: number;
  last_updated: string;
  date_registered: string;
  categories: { name: string; slug: string }[];
  storage_size: number;
}

export interface HubRepositoryDetails extends HubRepository {
  full_description: string | null;
}

export interface HubTagImage {
  architecture: string;
  variant: string | null;
  os: string;
  size: number;
  digest: string;
  status: string;
  last_pushed: string | null;
}

export interface HubTag {
  name: string;
  full_size: number;
  last_updated: string;
  tag_last_pushed: string | null;
  tag_status: string;
  digest?: string;
  images: HubTagImage[];
}

export interface HubSearchResponse {
  total: number;
  results: HubSearchResult[];
}

export interface HubSearchResult {
  id: string;
  name: string;
  type: string;
  publisher: { id: string; name: string };
  short_description: string | null;
  badge: string | null;
  star_count: number;
  raw_pull_count: number;
  updated_at: string;
  logo_url: { large: string | null; small: string | null } | null;
  categories: { name: string; slug: string }[] | null;
}

export type SearchOrdering = "pull_count" | "updated_at";
