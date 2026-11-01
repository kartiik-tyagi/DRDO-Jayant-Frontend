import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './AppShell'
import SituationPage from '../pages/SituationPage'
import ForcesPage from '../pages/ForcesPage'
import ScenarioPage from '../pages/ScenarioPage'
import ConfigurationPage from '../pages/ConfigurationPage'

const PAGES = {
  situation: SituationPage,
  forces: ForcesPage,
  scenario: ScenarioPage,
  configuration: ConfigurationPage,
}

function visibleItems(navigation) {
  return (navigation?.items || []).filter(
    (item) => item && item.visible !== false && item.path && item.page,
  )
}

export default function AppRoutes({ config }) {
  const items = visibleItems(config.navigation)
  const fallback = items.some((item) => item.path === config.app?.defaultRoute)
    ? config.app.defaultRoute
    : items[0]?.path || '/'

  return (
    <Routes>
      <Route element={<AppShell config={config} />}>
        <Route index element={<Navigate to={fallback} replace />} />
        {items.map((item) => {
          const Page = PAGES[item.page]
          const element = Page ? (
            <Page config={config} />
          ) : (
            <ConfigurationPage
              config={config}
              missingPage={item.page}
            />
          )
          return <Route key={item.id} path={item.path} element={element} />
        })}
        <Route path="*" element={<Navigate to={fallback} replace />} />
      </Route>
    </Routes>
  )
}
