import { Input } from 'antd'
import { useState } from 'react'

interface SearchBarProps {
  query: string
  onSearch: (query: string) => void
}

export function SearchBar({ query, onSearch }: SearchBarProps) {
  const [value, setValue] = useState(query)
  const [syncedQuery, setSyncedQuery] = useState(query)

  // Reflect URL changes (back/forward, header link) in the input.
  if (query !== syncedQuery) {
    setSyncedQuery(query)
    setValue(query)
  }

  return (
    <Input.Search
      size="large"
      placeholder="Search Docker Hub, e.g. nginx, postgres, grafana"
      aria-label="Search Docker Hub"
      allowClear
      enterButton="Search"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onSearch={(value) => onSearch(value.trim())}
    />
  )
}
