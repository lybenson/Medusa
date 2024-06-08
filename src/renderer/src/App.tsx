import Sidebar from './components/sidebar'
import { routes } from './routes'
import { usePageStore } from './store'

export default function App() {
  const currentPath = usePageStore((state) => state.currentPath)

  return (
    <div className='flex flex-col h-screen'>
      <div
        id='drag-region'
        className='h-10 border-b w-full'
        style={
          {
            WebkitAppRegion: 'drag',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          } as React.CSSProperties
        }
      />
      <div className='flex  flex-1'>
        <div className='w-60 flex-shrink-0 border-r bg-neutral-100'>
          <Sidebar />
        </div>
        <div className='flex-1'>
          {routes.map((route) =>
            route.path === currentPath ? route.component : null
          )}
        </div>
      </div>
    </div>
  )
}
