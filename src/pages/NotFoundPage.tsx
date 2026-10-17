import { Button, Result } from 'antd'
import { useNavigate } from 'react-router'
import { paths } from '@/routes'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <>
      <title>Page not found · Registry UI</title>
      <Result
        status="404"
        title="Page not found"
        subTitle="The page you're looking for doesn't exist."
        extra={
          <Button type="primary" onClick={() => navigate(paths.explore)}>
            Explore images
          </Button>
        }
      />
    </>
  )
}
