import { CopyButton } from './CopyButton'
import styles from './CommandSnippet.module.css'

/** A shell command shown as code, with a copy button. */
export function CommandSnippet({ command }: { command: string }) {
  return (
    <div className={styles.snippet}>
      <code className={styles.command}>
        <span className={styles.prompt} aria-hidden>
          $
        </span>
        {command}
      </code>
      <CopyButton text={command} type="primary" label="Copy" />
    </div>
  )
}
