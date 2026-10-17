import { useSearchParams } from 'react-router'
import type { SearchSort } from '@/types/repository'

const DEFAULT_SORT: SearchSort = 'bestMatch'
const SORTS: readonly SearchSort[] = ['bestMatch', 'pullCount', 'lastUpdated']

interface ExploreState {
  query: string
  sort: SearchSort
}

/**
 * Search state lives in the URL (`?q=&sort=`) so results are shareable
 * and survive back/forward navigation from a repository page.
 */
export function useExploreSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const state: ExploreState = {
    query: searchParams.get('q')?.trim() ?? '',
    sort: parseSort(searchParams.get('sort')),
  }

  const update = (next: ExploreState) => {
    const params = new URLSearchParams()
    if (next.query) params.set('q', next.query)
    if (next.sort !== DEFAULT_SORT) params.set('sort', next.sort)
    setSearchParams(params)
  }

  return {
    ...state,
    setQuery: (query: string) => update({ ...state, query }),
    setSort: (sort: SearchSort) => update({ ...state, sort }),
  }
}

function parseSort(value: string | null): SearchSort {
  return SORTS.find((sort) => sort === value) ?? DEFAULT_SORT
}
