import { DockerOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import { Link, Outlet } from 'react-router'
import { paths } from '@/routes'
import styles from './AppLayout.module.css'

const { Header, Content } = Layout

export function AppLayout() {
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <Link to={paths.explore} className={styles.brand}>
          <DockerOutlined className={styles.brandIcon} />
          <span>Registry UI</span>
        </Link>
      </Header>
      <Content className={styles.content}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  )
}
