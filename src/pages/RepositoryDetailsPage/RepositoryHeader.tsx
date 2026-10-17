import { ClockCircleOutlined, DownloadOutlined, SafetyCertificateOutlined, StarOutlined } from '@ant-design/icons'
import { Alert, Card, Flex, Tag, Tooltip, Typography } from 'antd'
import { CommandSnippet } from '@/components/CommandSnippet'
import { RepositoryLogo } from '@/components/RepositoryLogo'
import type { RepositoryDetails } from '@/types/repository'
import { formatCompactNumber, formatDateTime, formatRelativeTime } from '@/utils/format'
import styles from './RepositoryDetailsPage.module.css'

export function RepositoryHeader({ repository }: { repository: RepositoryDetails }) {
  const { name, displayName, owner, description, pullCount, starCount, updatedAt, isOfficial, isDeprecated } =
    repository

  return (
    <Card className={styles.header}>
      <Flex vertical gap={20}>
        {isDeprecated && (
          <Alert
            type="warning"
            showIcon
            title="This image is deprecated"
            description="Its maintainers no longer recommend it. Check the description for a suggested replacement."
          />
        )}

        <Flex gap={20} align="flex-start" wrap>
          <RepositoryLogo name={name} size={72} />
          <Flex vertical gap={6} className={styles.headerText}>
            <Flex align="center" gap={12} wrap>
              <Typography.Title level={2} className={styles.title}>
                {displayName}
              </Typography.Title>
              {isOfficial && (
                <Tooltip title="A curated image maintained by Docker">
                  <Tag color="green" icon={<SafetyCertificateOutlined />}>
                    Docker Official Image
                  </Tag>
                </Tooltip>
              )}
            </Flex>
            <Typography.Text type="secondary">by {owner}</Typography.Text>
            <Typography.Paragraph className={styles.description}>
              {description || <Typography.Text type="secondary">No description provided</Typography.Text>}
            </Typography.Paragraph>
            <Flex gap={20} wrap className={styles.stats}>
              <Tooltip title={`${pullCount.toLocaleString()} pulls`}>
                <span>
                  <DownloadOutlined /> {formatCompactNumber(pullCount)} pulls
                </span>
              </Tooltip>
              <Tooltip title={`${starCount.toLocaleString()} stars`}>
                <span>
                  <StarOutlined /> {formatCompactNumber(starCount)} stars
                </span>
              </Tooltip>
              <Tooltip title={formatDateTime(updatedAt)}>
                <span>
                  <ClockCircleOutlined /> Updated {formatRelativeTime(updatedAt)}
                </span>
              </Tooltip>
            </Flex>
            {repository.categories.length > 0 && (
              <Flex wrap gap={4}>
                {repository.categories.map((category) => (
                  <Tag key={category}>{category}</Tag>
                ))}
              </Flex>
            )}
          </Flex>
        </Flex>

        <CommandSnippet command={`docker pull ${displayName}`} />
      </Flex>
    </Card>
  )
}
