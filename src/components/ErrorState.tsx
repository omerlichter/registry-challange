import { ReloadOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'

interface ErrorStateProps {
  title: string
  error: Error
  onRetry?: () => void
}

export function ErrorState({ title, error, onRetry }: ErrorStateProps) {
  return (
    <Result
      status="warning"
      title={title}
      subTitle={error.message}
      extra={
        onRetry && (
          <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
            Try again
          </Button>
        )
      }
    />
  )
}
