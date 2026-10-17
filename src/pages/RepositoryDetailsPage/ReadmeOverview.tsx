import { Empty } from 'antd'
import type { ComponentProps } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './ReadmeOverview.module.css'

/** The repository's README. */
export function ReadmeOverview({ markdown }: { markdown: string }) {
  if (!markdown.trim()) {
    return <Empty description="This repository has no overview." />
  }

  return (
    <article className={styles.markdown}>
      {/* skipHtml: READMEs may contain raw HTML; drop it rather than render untrusted markup. */}
      <Markdown remarkPlugins={[remarkGfm]} skipHtml components={{ a: ExternalLink }}>
        {markdown}
      </Markdown>
    </article>
  )
}

function ExternalLink({ href, children }: ComponentProps<'a'>) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}
