import { RouteItem } from '@renderer/routes'
import { NavLink, useLocation } from 'react-router-dom'

export default function MenuItem({ item }: { item: RouteItem }) {
  let location = useLocation()

  return (
    <div
      className={`cursor-pointer hover:bg-neutral-200 m-1 rounded-sm ${location.pathname === '/' + item.path ? 'text-neutral-700 bg-neutral-200' : 'text-neutral-500'}`}
    >
      <NavLink to={item.path}>
        <div className='flex items-center text-md min-h-8 py-0.5 px-2.5'>
          <div className='flex-shrink-0 flex-grow-0 mr-2'>{item.icon}</div>
          <div className='flex-1'>{item.text}</div>
        </div>
      </NavLink>
    </div>
  )
}
