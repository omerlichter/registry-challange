export interface RepositorySummary {
  namespace: string;
  name: string;
  displayName: string;
  owner: string;
  description: string;
  pullCount: number;
  starCount: number;
  updatedAt: string;
  isOfficial: boolean;
  isDeprecated: boolean;
  categories: string[];
  logoUrl?: string;
}

export type SearchSort = "bestMatch" | "pullCount" | "lastUpdated";

export interface SearchParams {
  query: string;
  page: number;
  pageSize: number;
  sort: SearchSort;
}

export interface Page<T> {
  total: number;
  items: T[];
}

export type SearchResult = Page<RepositorySummary>;

export interface RepositoryDetails extends RepositorySummary {
  readme: string;
}

export interface TagPlatform {
  label: string;
  size: number;
}

export interface RepositoryTag {
  name: string;
  updatedAt: string;
  size: number;
  platforms: TagPlatform[];
}
