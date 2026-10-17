import { Alert, Button, Empty, Flex, FloatButton, Select, Spin, Typography } from 'antd'
import { ErrorState } from '@/components/ErrorState'
import { LoadMoreTrigger } from '@/components/LoadMoreTrigger'
import { RepositoryGrid, RepositoryGridSkeleton } from '@/components/RepositoryGrid'
import { useRepositorySearch } from '@/hooks/useRepositorySearch'
import type { SearchSort } from '@/types/repository'
import styles from './ExplorePage.module.css'

const SEARCH_PAGE_SIZE = 24

const SORT_OPTIONS: { value: SearchSort; label: string }[] = [
  { value: 'bestMatch', label: 'Best match' },
  { value: 'pullCount', label: 'Most pulls' },
  { value: 'lastUpdated', label: 'Recently updated' },
]

interface SearchResultsProps {
  query: string
  sort: SearchSort
  onSortChange: (sort: SearchSort) => void
  onClearSearch: () => void
}

export function SearchResults({ query, sort, onSortChange, onClearSearch }: SearchResultsProps) {
  const {
    data,
    error,
    isPending,
    isFetching,
    isPlaceholderData,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useRepositorySearch({ query, sort, pageSize: SEARCH_PAGE_SIZE })

  const items = data?.pages.flatMap((page) => page.items) ?? []
  const total = data?.pages[0]?.total ?? 0

  return (
    <section aria-labelledby="results-heading">
      <Flex justify="space-between" align="center" wrap gap={12} className={styles.resultsHeader}>
        <Typography.Title level={4} id="results-heading" style={{ margin: 0 }}>
          {data
            ? `${total.toLocaleString()} ${total === 1 ? 'repository' : 'repositories'} matching “${query}”`
            : error
              ? `Results for “${query}”`
              : `Searching for “${query}”…`}
        </Typography.Title>
        <Flex align="center" gap={8}>
          <Typography.Text type="secondary">Sort by</Typography.Text>
          <Select
            value={sort}
            options={SORT_OPTIONS}
            onChange={onSortChange}
            style={{ width: 170 }}
            aria-label="Sort results"
          />
        </Flex>
      </Flex>

      {error && !data ? (
        <ErrorState title="Search failed" error={error} onRetry={() => refetch()} />
      ) : isPending ? (
        <RepositoryGridSkeleton count={SEARCH_PAGE_SIZE} />
      ) : items.length === 0 ? (
        <Empty
          className={styles.empty}
          description={
            <Flex vertical gap={4}>
              <Typography.Text strong>No repositories match “{query}”</Typography.Text>
              <Typography.Text type="secondary">Check the spelling or try a broader keyword.</Typography.Text>
            </Flex>
          }
        >
          <Button onClick={onClearSearch}>Browse popular images</Button>
        </Empty>
      ) : (
        <Spin spinning={isFetching && isPlaceholderData}>
          <RepositoryGrid repositories={items} />
          <Flex vertical align="center" gap={8} className={styles.listFooter}>
            {isFetchNextPageError ? (
              <Alert
                type="warning"
                showIcon
                title="Couldn't load more results"
                description={error?.message}
                action={
                  <Button size="small" onClick={() => fetchNextPage()}>
                    Try again
                  </Button>
                }
              />
            ) : (
              <LoadMoreTrigger hasMore={hasNextPage} loading={isFetchingNextPage} onLoadMore={() => fetchNextPage()} />
            )}
            {!hasNextPage && items.length < total && (
              <Typography.Text type="secondary">
                Docker Hub lets anonymous users load the first {items.length} of {total.toLocaleString()} results. Try a
                more specific search or a different sort order.
              </Typography.Text>
            )}
            {!hasNextPage && items.length >= total && total > SEARCH_PAGE_SIZE && (
              <Typography.Text type="secondary">That's all {total.toLocaleString()} results.</Typography.Text>
            )}
          </Flex>
          <FloatButton.BackTop />
        </Spin>
      )}
    </section>
  )
}
