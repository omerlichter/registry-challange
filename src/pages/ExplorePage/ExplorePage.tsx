import { Typography } from 'antd'
import { PopularRepositories } from './PopularRepositories'
import { SearchBar } from './SearchBar'
import { SearchResults } from './SearchResults'
import { useExploreSearchParams } from './useExploreSearchParams'
import styles from './ExplorePage.module.css'

export function ExplorePage() {
  const { query, sort, setQuery, setSort } = useExploreSearchParams()

  return (
    <>
      <div className={styles.hero}>
        <Typography.Title level={2}>
          Explore Docker Hub
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Search container images by keyword and find the right tag to pull.
        </Typography.Paragraph>
        <SearchBar query={query} onSearch={setQuery} />
      </div>

      {query ? (
        <SearchResults query={query} sort={sort} onSortChange={setSort} onClearSearch={() => setQuery('')} />
      ) : (
        <PopularRepositories />
      )}
    </>
  )
}
