import Paragraph from '@renderer/components/paragraph'
import { Button } from '@renderer/components/ui/button'
import { Textarea } from '@renderer/components/ui/textarea'
import { useChatApi } from '@renderer/hooks/useChatApi'
import { RotateCw } from 'lucide-react'
import { useState } from 'react'

export default function Correct() {
  const [chineseInputValue, setChineseInputValue] = useState('')
  const [englishInputValue, setEnglishInputValue] = useState('')
  const {
    fetchSSE: fetchCorrect,
    data: correctData,
    isFetching
  } = useChatApi('correct')
  return (
    <div className='p-2'>
      <Textarea
        id='selectable'
        className='min-h-20 mb-4 text-base'
        wrap='hard'
        placeholder='请输入中文(可选)'
        value={chineseInputValue}
        onChange={(e) => setChineseInputValue(e.target.value)}
      />

      <Textarea
        id='selectable'
        className='min-h-20 mb-4 text-base'
        wrap='hard'
        placeholder='请输入英文翻译'
        value={englishInputValue}
        onChange={(e) => setEnglishInputValue(e.target.value)}
      />
      <Button
        className=''
        onClick={() =>
          fetchCorrect({
            sentence: englishInputValue,
            chinese: chineseInputValue
          })
        }
        disabled={isFetching || !englishInputValue}
      >
        {isFetching && (
          <RotateCw
            size={18}
            className='animate-spin mr-2'
          />
        )}
        纠错
      </Button>

      <div className='mt-2'>
        <Paragraph literal={correctData} />
      </div>
    </div>
  )
}
