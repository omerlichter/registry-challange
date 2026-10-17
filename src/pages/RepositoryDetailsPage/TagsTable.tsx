import { Flex, Grid, Table, Tag, Tooltip, Typography, type TableColumnsType } from 'antd'
import { CopyButton } from '@/components/CopyButton'
import type { RepositoryTag, TagPlatform } from '@/types/repository'
import { formatBytes, formatDateTime, formatRelativeTime } from '@/utils/format'

const VISIBLE_PLATFORMS = 3

interface TagsTableProps {
  tags: RepositoryTag[]
  /** Image reference used in the pull command, e.g. `nginx`. */
  imageName: string
  loading?: boolean
}

export function TagsTable({ tags, imageName, loading }: TagsTableProps) {
  // Below `md` the size and date columns are hidden, so they move under the tag name.
  const isNarrow = !Grid.useBreakpoint().md

  const columns: TableColumnsType<RepositoryTag> = [
    {
      title: 'Tag',
      dataIndex: 'name',
      render: (name: string, tag) => (
        <Flex vertical>
          <Typography.Text strong style={{ wordBreak: 'break-all' }}>
            {name}
          </Typography.Text>
          {isNarrow && (
            <Typography.Text type="secondary">
              {formatBytes(tag.size)} · {formatRelativeTime(tag.updatedAt)}
            </Typography.Text>
          )}
        </Flex>
      ),
    },
    {
      title: 'Platforms',
      dataIndex: 'platforms',
      responsive: ['lg'],
      render: (platforms: TagPlatform[]) => <PlatformList platforms={platforms} />,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      responsive: ['md'],
      render: (size: number) => (
        <Tooltip title="Compressed size">
          <span>{formatBytes(size)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Last updated',
      dataIndex: 'updatedAt',
      responsive: ['md'],
      render: (updatedAt: string) => (
        <Tooltip title={formatDateTime(updatedAt)}>
          <span>{formatRelativeTime(updatedAt)}</span>
        </Tooltip>
      ),
    },
    {
      key: 'pull',
      align: 'right',
      render: (_, tag) => <CopyButton text={`docker pull ${imageName}:${tag.name}`} label="Copy command" size="small" />,
    },
  ]

  return <Table rowKey="name" columns={columns} dataSource={tags} loading={loading} pagination={false} />
}

function PlatformList({ platforms }: { platforms: TagPlatform[] }) {
  if (platforms.length === 0) return <Typography.Text type="secondary">—</Typography.Text>

  const hidden = platforms.slice(VISIBLE_PLATFORMS)
  return (
    <Flex wrap gap={4}>
      {platforms.slice(0, VISIBLE_PLATFORMS).map((platform) => (
        <Tooltip key={platform.label} title={formatBytes(platform.size)}>
          <Tag>{platform.label}</Tag>
        </Tooltip>
      ))}
      {hidden.length > 0 && (
        <Tooltip
          title={
            <Flex vertical>
              {hidden.map((platform) => (
                <span key={platform.label}>
                  {platform.label} · {formatBytes(platform.size)}
                </span>
              ))}
            </Flex>
          }
        >
          <Tag>+{hidden.length} more</Tag>
        </Tooltip>
      )}
    </Flex>
  )
}
