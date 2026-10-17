import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { isPageReachable, searchRepositories } from '@/api/repositories'
import type { SearchParams } from '@/types/repository'

/** Search results loaded page by page, for infinite scrolling. */
export function useRepositorySearch({ query, sort, pageSize }: Omit<SearchParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['repositories', 'search', { query, sort, pageSize }],
    queryFn: ({ pageParam, signal }) => searchRepositories({ query, sort, pageSize, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextPage = lastPageParam + 1
      const hasMore = lastPageParam * pageSize < lastPage.total
      return hasMore && isPageReachable(nextPage, pageSize) ? nextPage : undefined
    },
    // Keep the current list visible while a new sort order loads.
    placeholderData: keepPreviousData,
  })
}
