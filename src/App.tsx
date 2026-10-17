import { Route, Routes } from 'react-router'
import { AppLayout } from '@/layouts/AppLayout'
import { ExplorePage } from '@/pages/ExplorePage/ExplorePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RepositoryDetailsPage } from '@/pages/RepositoryDetailsPage/RepositoryDetailsPage'
import { paths } from '@/routes'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={paths.explore} element={<ExplorePage />} />
        <Route path={paths.repository} element={<RepositoryDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
