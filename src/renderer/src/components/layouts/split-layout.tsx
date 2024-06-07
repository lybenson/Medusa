import { ReactNode } from 'react'

interface SplitLayoutProps {
  sidebar: ReactNode
  detail: ReactNode
}

export default function SplitLayout({ sidebar, detail }: SplitLayoutProps) {
  return (
    <div className='flex  flex-1'>
      <div className='w-1/4 border-r'>{sidebar}</div>
      <div className='w-3/4'>{detail}</div>
    </div>
  )
}
