import { Alert, Button, Empty, Flex, Input, Typography } from 'antd'
import { useState } from 'react'
import { ErrorState } from '@/components/ErrorState'
import { LoadMoreTrigger } from '@/components/LoadMoreTrigger'
import { useRepositoryTag, useRepositoryTags } from '@/hooks/useRepositoryTags'
import { TagsTable } from './TagsTable'
import styles from './RepositoryDetailsPage.module.css'

interface TagsPanelProps {
  namespace: string
  name: string
  imageName: string
}

export function TagsPanel({ namespace, name, imageName }: TagsPanelProps) {
  const [inputValue, setInputValue] = useState('')
  const [lookup, setLookup] = useState('')

  const clearLookup = () => {
    setInputValue('')
    setLookup('')
  }

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center" wrap gap={12}>
        <Typography.Text type="secondary">
          {lookup ? `Looking up the tag “${lookup}”` : 'Most recently updated first'}
        </Typography.Text>
        <Input.Search
          className={styles.tagLookup}
          placeholder="Find a tag by exact name, e.g. latest"
          aria-label="Find a tag by exact name"
          allowClear
          enterButton="Find"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onSearch={(value) => setLookup(value.trim())}
        />
      </Flex>

      {lookup ? (
        <TagLookupResult namespace={namespace} name={name} imageName={imageName} tag={lookup} onClear={clearLookup} />
      ) : (
        <TagList namespace={namespace} name={name} imageName={imageName} />
      )}
    </Flex>
  )
}

function TagList({ namespace, name, imageName }: TagsPanelProps) {
  const { data, error, isPending, isFetchingNextPage, isFetchNextPageError, hasNextPage, fetchNextPage, refetch } =
    useRepositoryTags(namespace, name)

  if (error && !data) {
    return <ErrorState title="Couldn't load tags" error={error} onRetry={() => refetch()} />
  }

  const tags = data?.pages.flatMap((page) => page.items) ?? []
  const total = data?.pages[0]?.total ?? 0

  if (!isPending && tags.length === 0) {
    return <Empty description="This repository has no tags yet." />
  }

  return (
    <>
      <TagsTable tags={tags} imageName={imageName} loading={isPending} />
      {data && (
        <Flex vertical align="center" gap={8}>
          {isFetchNextPageError ? (
            <Alert
              type="warning"
              showIcon
              title="Couldn't load more tags"
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
          {!hasNextPage && tags.length < total && (
            <Typography.Text type="secondary">
              Docker Hub lets anonymous users list the newest {tags.length.toLocaleString()} of {total.toLocaleString()}{' '}
              tags. Use “Find” to look up an older tag by its exact name.
            </Typography.Text>
          )}
        </Flex>
      )}
    </>
  )
}

interface TagLookupResultProps extends TagsPanelProps {
  tag: string
  onClear: () => void
}

function TagLookupResult({ namespace, name, imageName, tag, onClear }: TagLookupResultProps) {
  const { data, error, isPending, refetch } = useRepositoryTag(namespace, name, tag)

  if (error) {
    return <ErrorState title="Couldn't look up the tag" error={error} onRetry={() => refetch()} />
  }

  if (data === null) {
    return (
      <Empty
        description={
          <Flex vertical gap={4}>
            <Typography.Text strong>No tag named “{tag}”</Typography.Text>
            <Typography.Text type="secondary">Tag names must match exactly, e.g. “1.27-alpine”.</Typography.Text>
          </Flex>
        }
      >
        <Button onClick={onClear}>Show all tags</Button>
      </Empty>
    )
  }

  return (
    <Flex vertical gap={12}>
      <TagsTable tags={data ? [data] : []} imageName={imageName} loading={isPending} />
      <Button type="link" onClick={onClear} className={styles.showAllTags}>
        Show all tags
      </Button>
    </Flex>
  )
}
