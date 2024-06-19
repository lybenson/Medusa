import { marked } from 'marked'
import { useEffect, useState } from 'react'

export default function Paragraph({ literal }: { literal: string }) {
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
    />
  )
}
