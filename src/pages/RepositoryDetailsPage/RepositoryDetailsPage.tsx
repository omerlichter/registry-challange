import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Card, Result, Skeleton, Tabs } from 'antd'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { ApiError } from '@/api/client'
import { ErrorState } from '@/components/ErrorState'
import { useRepository } from '@/hooks/useRepository'
import { useRepositoryTags } from '@/hooks/useRepositoryTags'
import { paths } from '@/routes'
import { ReadmeOverview } from './ReadmeOverview'
import { RepositoryHeader } from './RepositoryHeader'
import { TagsPanel } from './TagsPanel'
import styles from './RepositoryDetailsPage.module.css'

type TabKey = 'tags' | 'overview'

export function RepositoryDetailsPage() {
  const { namespace = '', name = '' } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: repository, error, isPending, refetch } = useRepository(namespace, name)
  // Shares the cache with the tags tab; only used for the count in the tab label.
  const tagCount = useRepositoryTags(namespace, name).data?.pages[0]?.total

  // The active tab lives in the URL so a link can point straight at the overview.
  const activeTab: TabKey = searchParams.get('tab') === 'overview' ? 'overview' : 'tags'
  const handleTabChange = (key: string) => setSearchParams(key === 'overview' ? { tab: key } : {}, { replace: true })

  const isNotFound = error instanceof ApiError && error.status === 404

  return (
    <>
      <title>{`${repository?.displayName ?? name} · Registry UI`}</title>
      <BackButton />

      {isNotFound ? (
        <Result
          status="404"
          title="Repository not found"
          subTitle={`There's no public repository named “${namespace}/${name}” on Docker Hub.`}
          extra={
            <Button type="primary" onClick={() => navigate(paths.explore)}>
              Explore images
            </Button>
          }
        />
      ) : error ? (
        <ErrorState title="Couldn't load this repository" error={error} onRetry={() => refetch()} />
      ) : isPending ? (
        <Card>
          <Skeleton active avatar={{ shape: 'square', size: 72 }} paragraph={{ rows: 4 }} />
        </Card>
      ) : (
        <>
          <RepositoryHeader repository={repository} />
          <Card className={styles.tabsCard}>
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={[
                {
                  key: 'tags',
                  label: tagCount === undefined ? 'Tags' : `Tags (${tagCount.toLocaleString()})`,
                  children: <TagsPanel namespace={namespace} name={name} imageName={repository.displayName} />,
                },
                {
                  key: 'overview',
                  label: 'Overview',
                  children: <ReadmeOverview markdown={repository.readme} />,
                },
              ]}
            />
          </Card>
        </>
      )}
    </>
  )
}

/** Returns to the previous page (keeping Explore's search and scroll), or to Explore when opened directly. */
function BackButton() {
  const navigate = useNavigate()
  const location = useLocation()
  // React Router uses the "default" key for the first page loaded in this tab.
  const hasHistory = location.key !== 'default'

  return (
    <Button
      type="link"
      icon={<ArrowLeftOutlined />}
      className={styles.back}
      onClick={() => (hasHistory ? navigate(-1) : navigate(paths.explore))}
    >
      {hasHistory ? 'Back' : 'Explore images'}
    </Button>
  )
}
