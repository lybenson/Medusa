import MenuItem from './menu-item'
import { routes } from '@renderer/routes'

export default function Menu() {
  return (
    <div className='font-semibold'>
      {routes.map((item) => (
        <MenuItem
          item={item}
          key={item.path}
        />
      ))}
    </div>
  )
}
