import { Card, CardContent } from '@renderer/components/ui/card'
import { marked } from 'marked'
import { useEffect, useState } from 'react'

export default function SentenceGrammar({ grammar }) {
  const [parsedGrammarData, setParsedGrammarData] = useState('')
  useEffect(() => {
    setParsedGrammarData(marked(grammar || '').toString())
  }, [grammar])

  return (
    <Card>
      <CardContent className='max-h-80 overflow-auto pt-6'>
        <article
          className='prose prose-xs prose-zinc max-w-full'
          dangerouslySetInnerHTML={{
            __html: parsedGrammarData
          }}
        />
      </CardContent>
    </Card>
  )
}
