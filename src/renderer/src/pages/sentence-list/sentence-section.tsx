import { ReactNode } from 'react'

export default function SentenceSection({
  title,
  content
}: {
  title: string | ReactNode
  content: string | React.ReactNode
}) {
  return (
    <div className='mt-4'>
      <div className='font-semibold text-primary text-lg'>{title}</div>
      <div className='mt-2'>{content}</div>
    </div>
  )
}
