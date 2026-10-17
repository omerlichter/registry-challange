import { Flex, Typography } from 'antd'
import { ErrorState } from '@/components/ErrorState'
import { RepositoryGrid, RepositoryGridSkeleton } from '@/components/RepositoryGrid'
import { usePopularRepositories } from '@/hooks/usePopularRepositories'

const POPULAR_COUNT = 10

export function PopularRepositories() {
  const { data, error, isPending, refetch } = usePopularRepositories(POPULAR_COUNT)

  return (
    <section aria-labelledby="popular-heading">
      <Flex vertical gap={4} style={{ marginBottom: 16 }}>
        <Typography.Title level={4} id="popular-heading" style={{ margin: 0 }}>
          Popular images
        </Typography.Title>
        <Typography.Text type="secondary">The most pulled images on Docker Hub</Typography.Text>
      </Flex>

      {error ? (
        <ErrorState title="Couldn't load popular images" error={error} onRetry={() => refetch()} />
      ) : isPending ? (
        <RepositoryGridSkeleton count={POPULAR_COUNT} />
      ) : (
        <RepositoryGrid repositories={data} />
      )}
    </section>
  )
}
