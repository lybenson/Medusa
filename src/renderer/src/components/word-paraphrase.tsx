import { useChatApi } from '@renderer/hooks/useChatApi'
import { Button } from './ui/button'
import { useEffect } from 'react'
import Paragraph from './paragraph'

interface WordParaphraseProps {
  sentence: string
  word: string
}
export default function WordParaphrase({
  sentence,
  word
}: WordParaphraseProps) {
  const { fetchSSE, data } = useChatApi('word')

  useEffect(() => {
    fetchSSE(sentence, word)
  }, [])
  return (
    <div className=' overflow-auto'>
      <div>{word}</div>
      <Button size='sm'>添加到生词簿</Button>

      <div>
        <Paragraph literal={data} />
      </div>
    </div>
  )
}
