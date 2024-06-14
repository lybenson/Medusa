import AppHeader from './components/app-header'
import Sidebar from './components/sidebar'
import { routes } from './routes'
import { usePageStore } from './store'

export default function App() {
  const currentPath = usePageStore((state) => state.currentPath)

  return (
    <div className='flex flex-col h-screen'>
      <AppHeader />

      <div className='flex  flex-1'>
        <div className='w-60 flex-shrink-0 border-r bg-neutral-100'>
          <Sidebar />
        </div>
        <div className='flex-1 p-2'>
          {routes.map((route) => (
            <div key={route.path}>
              {route.path === currentPath ? route.component : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
