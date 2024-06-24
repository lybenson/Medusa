import { Navigate, Route, Routes } from 'react-router-dom'
import AppHeader from './components/app-header'
import Sidebar from './components/sidebar'
import { routes } from './routes'
import KeepAlive from 'keepalive-for-react'
import { useGlobalStore } from './store'
import { useEffect } from 'react'

export default function App() {
  const requestGroups = useGlobalStore((state) => state.requestGroups)

  useEffect(() => {
    requestGroups()
  }, [])
  return (
    <div className='flex flex-col h-screen max-h-screen'>
      <AppHeader />

      <div className='flex flex-1 h-[calc(100vh-3.5rem)]'>
        <div className='w-60 flex-shrink-0 border-r bg-neutral-100'>
          <Sidebar />
        </div>
        <div className='flex-1 overflow-scroll'>
          <Routes>
            {routes.map((route) => {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <KeepAlive activeName={route.path}>
                      {route.component}
                    </KeepAlive>
                  }
                >
                  {route.children?.map((childRoute) => {
                    return (
                      <Route
                        key={childRoute.path}
                        path={childRoute.path}
                        element={
                          childRoute.keepAlive ? (
                            <KeepAlive activeName={childRoute.path}>
                              {childRoute.component}
                            </KeepAlive>
                          ) : (
                            childRoute.component
                          )
                        }
                      />
                    )
                  })}
                </Route>
              )
            })}

            <Route
              path='*'
              element={
                <Navigate
                  to='/chat'
                  replace
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}
