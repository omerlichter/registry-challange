import { Button, Flex, Spin, Typography } from 'antd'
import { useOnInView } from 'react-intersection-observer'
import styles from './LoadMoreTrigger.module.css'

interface LoadMoreTriggerProps {
  hasMore: boolean
  loading: boolean
  onLoadMore: () => void
}

/**
 * Loads the next page when scrolled near the end of a list. The button is a fallback for
 * keyboard users and for when the list doesn't fill the screen.
 */
export function LoadMoreTrigger({ hasMore, loading, onLoadMore }: LoadMoreTriggerProps) {
  // Skipping while loading re-observes afterwards, so a sentinel still in view loads the next page.
  const sentinelRef = useOnInView<HTMLDivElement>(
    (inView) => {
      if (inView) onLoadMore()
    },
    { rootMargin: '0px 0px 400px 0px', skip: !hasMore || loading },
  )

  if (!hasMore) return null

  return (
    <div ref={sentinelRef} className={styles.trigger}>
      {loading ? (
        <Flex align="center" gap={8} role="status">
          <Spin size="small" />
          <Typography.Text type="secondary">Loading more…</Typography.Text>
        </Flex>
      ) : (
        <Button onClick={onLoadMore}>Load more</Button>
      )}
    </div>
  )
}
