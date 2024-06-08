import { RouteItem } from '@renderer/routes'
import { usePageStore } from '@renderer/store'

export default function MenuItem({ item }: { item: RouteItem }) {
  const currentPath = usePageStore((state) => state.currentPath)
  const setCurrentPath = usePageStore((state) => state.setCurrentPath)

  return (
    <div
      className={`cursor-pointer hover:bg-neutral-200 m-1 rounded-sm ${currentPath === item.path ? 'text-neutral-700 bg-neutral-200' : 'text-neutral-500'}`}
      onClick={() => setCurrentPath(item.path)}
    >
      <div className='flex items-center text-md min-h-8 py-0.5 px-2.5'>
        <div className='flex-shrink-0 flex-grow-0 mr-2'>{item.icon}</div>
        <div className='flex-1'>{item.text}</div>
      </div>
    </div>
  )
}
