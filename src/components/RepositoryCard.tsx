import { ClockCircleOutlined, DownloadOutlined, StarOutlined } from '@ant-design/icons'
import { Card, Flex, Tag, Tooltip, Typography } from 'antd'
import { Link } from 'react-router'
import { repositoryPath } from '@/routes'
import type { RepositorySummary } from '@/types/repository'
import { formatCompactNumber, formatDateTime, formatRelativeTime } from '@/utils/format'
import { RepositoryLogo } from './RepositoryLogo'
import styles from './RepositoryCard.module.css'

const MAX_CATEGORIES = 2

export function RepositoryCard({ repository }: { repository: RepositorySummary }) {
  const {
    namespace,
    name,
    displayName,
    owner,
    description,
    pullCount,
    starCount,
    updatedAt,
    isDeprecated,
    categories,
    logoUrl,
  } = repository

  return (
    <Link to={repositoryPath(namespace, name)} className={styles.link} aria-label={`View ${displayName}`}>
      <Card hoverable className={styles.card} styles={{ body: { height: '100%' } }}>
        <Flex vertical gap={12} className={styles.body}>
          <Flex gap={12} align="center">
            <RepositoryLogo name={name} src={logoUrl} />
            <div className={styles.heading}>
              <Typography.Text strong ellipsis={{ tooltip: displayName }} className={styles.name}>
                {displayName}
              </Typography.Text>
              <Typography.Text type="secondary" ellipsis={{ tooltip: owner }} className={styles.owner}>
                by {owner}
              </Typography.Text>
            </div>
          </Flex>

          {(isDeprecated || categories.length > 0) && (
            <Flex wrap gap={4}>
              {isDeprecated && <Tag color="warning">Deprecated</Tag>}
              {categories.slice(0, MAX_CATEGORIES).map((category) => (
                <Tag key={category}>{category}</Tag>
              ))}
            </Flex>
          )}

          <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }} className={styles.description}>
            {description || <span className={styles.placeholder}>No description provided</span>}
          </Typography.Paragraph>

          <Flex gap={16} wrap className={styles.stats}>
            <Tooltip title={`${pullCount.toLocaleString()} pulls`}>
              <span>
                <DownloadOutlined /> {formatCompactNumber(pullCount)}
              </span>
            </Tooltip>
            <Tooltip title={`${starCount.toLocaleString()} stars`}>
              <span>
                <StarOutlined /> {formatCompactNumber(starCount)}
              </span>
            </Tooltip>
            <Tooltip title={`Last updated ${formatDateTime(updatedAt)}`}>
              <span>
                <ClockCircleOutlined /> {formatRelativeTime(updatedAt)}
              </span>
            </Tooltip>
          </Flex>
        </Flex>
      </Card>
    </Link>
  )
}
