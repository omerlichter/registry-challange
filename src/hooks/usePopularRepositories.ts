import { useQuery } from '@tanstack/react-query'
import { getPopularRepositories } from '@/api/repositories'

export function usePopularRepositories(limit: number) {
  return useQuery({
    queryKey: ['repositories', 'popular', limit],
    queryFn: ({ signal }) => getPopularRepositories(limit, signal),
  })
}
