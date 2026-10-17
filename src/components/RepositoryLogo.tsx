import { Avatar } from 'antd'
import styles from './RepositoryLogo.module.css'

interface RepositoryLogoProps {
  name: string
  src?: string | null
  size?: number
}

export function RepositoryLogo({ name, src, size = 48 }: RepositoryLogoProps) {
  return (
    <Avatar
      shape="square"
      size={size}
      src={src ?? undefined}
      className={src ? `${styles.logo} ${styles.image}` : styles.logo}
      aria-hidden
    >
      {name.charAt(0).toUpperCase()}
    </Avatar>
  )
}
