import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getRepositoryTag, isTagPageReachable, listRepositoryTags } from '@/api/tags'

export const TAG_PAGE_SIZE = 50

/** A repository's tags, newest first, loaded page by page for infinite scrolling. */
export function useRepositoryTags(namespace: string, name: string) {
  return useInfiniteQuery({
    queryKey: ['repository', namespace, name, 'tags', TAG_PAGE_SIZE],
    queryFn: ({ pageParam, signal }) =>
      listRepositoryTags(namespace, name, { page: pageParam, pageSize: TAG_PAGE_SIZE }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextPage = lastPageParam + 1
      const hasMore = lastPageParam * TAG_PAGE_SIZE < lastPage.total
      return hasMore && isTagPageReachable(nextPage, TAG_PAGE_SIZE) ? nextPage : undefined
    },
  })
}

/** Looks up a single tag by its exact name; resolves to `null` when it doesn't exist. */
export function useRepositoryTag(namespace: string, name: string, tag: string) {
  return useQuery({
    queryKey: ['repository', namespace, name, 'tag', tag],
    queryFn: ({ signal }) => getRepositoryTag(namespace, name, tag, signal),
    enabled: tag !== '',
  })
}
