import { marked } from 'marked'
import { forwardRef, useEffect, useState } from 'react'

function Paragraph({ literal }: { literal: string }, ref: any) {
  const [parsedData, setParsedData] = useState('')
  useEffect(() => {
    setParsedData(marked(literal || '').toString())
  }, [literal])

  return (
    <article
      className='prose prose-xs prose-zinc max-w-full'
      dangerouslySetInnerHTML={{
        __html: parsedData
      }}
      ref={ref}
    />
  )
}
export default forwardRef(Paragraph)
