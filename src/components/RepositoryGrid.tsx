import { Card, Skeleton } from 'antd'
import type { RepositorySummary } from '@/types/repository'
import { RepositoryCard } from './RepositoryCard'
import styles from './RepositoryGrid.module.css'

export function RepositoryGrid({ repositories }: { repositories: RepositorySummary[] }) {
  return (
    <div className={styles.grid}>
      {repositories.map((repository) => (
        <RepositoryCard key={`${repository.namespace}/${repository.name}`} repository={repository} />
      ))}
    </div>
  )
}

export function RepositoryGridSkeleton({ count }: { count: number }) {
  return (
    <div className={styles.grid} aria-busy="true" aria-label="Loading repositories">
      {Array.from({ length: count }, (_, index) => (
        <Card key={index}>
          <Skeleton active avatar={{ shape: 'square', size: 48 }} paragraph={{ rows: 3 }} />
        </Card>
      ))}
    </div>
  )
}
