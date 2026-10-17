export const SEARCH_API_PATH = "/api/search/v4";

export function namespaceRepositoriesApiPath(namespace: string): string {
  return `/v2/namespaces/${encodeURIComponent(namespace)}/repositories`;
}

export function repositoryApiPath(namespace: string, name: string): string {
  return `${namespaceRepositoriesApiPath(namespace)}/${encodeURIComponent(name)}`;
}

export function repositoryTagsApiPath(namespace: string, name: string): string {
  return `${repositoryApiPath(namespace, name)}/tags`;
}

export function repositoryTagApiPath(
  namespace: string,
  name: string,
  tag: string,
): string {
  return `${repositoryTagsApiPath(namespace, name)}/${encodeURIComponent(tag)}`;
}
