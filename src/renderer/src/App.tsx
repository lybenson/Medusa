import { Navigate, Route, Routes } from 'react-router-dom'
import AppHeader from './components/app-header'
import Sidebar from './components/sidebar'
import { routes } from './routes'
import KeepAlive from 'keepalive-for-react'

export default function App() {
  return (
    <div className='flex flex-col h-screen'>
      <AppHeader />

      <div className='flex  flex-1'>
        <div className='w-60 flex-shrink-0 border-r bg-neutral-100'>
          <Sidebar />
        </div>
        <div className='flex-1 p-2'>
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
                />
              )
            })}

            <Route
              path='/'
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
