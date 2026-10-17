export const paths = {
  explore: '/',
  repository: '/repositories/:namespace/:name',
} as const

export function repositoryPath(namespace: string, name: string): string {
  return `/repositories/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`
}
