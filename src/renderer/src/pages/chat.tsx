import { Button } from '@renderer/components/ui/button'
import { Textarea } from '@renderer/components/ui/textarea'
import { insertSentence } from '@renderer/database/sentence'
import { useChatApi } from '@renderer/hooks/useChatApi'
import { Action } from '@renderer/lib/promots'
import { useMutation } from '@tanstack/react-query'
import { Aperture, BarChart, Loader, Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import SentenceGrammar from './sentence-list/sentence-grammar'
import SentenceSection from './sentence-list/sentence-section'
import TextPopover from '@renderer/components/text-popover'
import { useToggle } from '@uidotdev/usehooks'

export default function Chat() {
  const [inputValue, setInputValue] = useState(
    `For years parents have espoused the health benefits of eating garlic bread with cheese to their children, with the food earning such an iconic status in our culture that kids will often dress up as warm, cheesy loaf for Halloween.`
  )

  const { fetchSSE, translationData, grammarData, isTranslating, isAnalyzing } =
    useChatApi(inputValue)

  const handleSendMessage = (action: Action) => {
    fetchSSE(action)
  }

  const {
    mutateAsync: createSentence,
    isPending: isCreatingSentence,
    isSuccess: isCreateSentenceSuccess,
    isError: isCreateSentenceError
  } = useMutation({
    mutationKey: ['createSentence', inputValue],
    mutationFn: insertSentence
  })

  isCreateSentenceSuccess && toast.success('添加到备忘录成功')
  isCreateSentenceError && toast.error('添加到备忘录失败')

  const [textPopoverOpen, toggleTextPopover] = useToggle(false)

  const [popoverPosition, setPopoverPosition] = useState({
    left: 0,
    top: 0
  })

  const handleSelection = () => {
    const selection = window.getSelection()
    if (
      selection &&
      selection.rangeCount > 0 &&
      selection.toString().length > 0
    ) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setPopoverPosition({
        left: rect.x + rect.width / 2,
        top: rect.y + rect.height + 5
      })
      toggleTextPopover(true)
    }
  }

  const selectableRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!selectableRef.current) return

    const selectableEle = selectableRef.current

    const handleMouseUp = handleSelection

    const handleKeyUp = (event) => {
      if (event.key === 'Shift') {
        handleSelection()
      }
    }

    selectableEle.addEventListener('mouseup', handleMouseUp)
    selectableEle.addEventListener('keyup', handleKeyUp)

    return () => {
      selectableEle.removeEventListener('mouseup', handleMouseUp)
      selectableEle.removeEventListener('keyup', handleKeyUp)
    }
  }, [selectableRef])

  return (
    <div className='relative'>
      <Textarea
        id='selectable'
        className='min-h-32 mb-4 text-base'
        wrap='hard'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (e.shiftKey) return
            else {
              e.preventDefault()
              handleSendMessage('translate')
            }
          }
        }}
      />
      <div className='flex justify-between'>
        <div></div>
        <div>
          <Button
            size='sm'
            className='mr-2'
            onClick={() => {
              handleSendMessage('translate')
            }}
            disabled={isTranslating}
          >
            {isTranslating ? (
              <Loader
                size='16'
                className='animate-spin mr-2'
              />
            ) : (
              <Aperture
                size='16'
                className='mr-2'
              />
            )}
            翻译
          </Button>
          <Button
            size='sm'
            className='mr-2'
            onClick={() => {
              handleSendMessage('analyze')
            }}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader
                size='16'
                className='animate-spin mr-2'
              />
            ) : (
              <BarChart
                size='16'
                className='mr-2'
              />
            )}
            语法分析
          </Button>
          <Button
            size='sm'
            disabled={
              isTranslating || isAnalyzing || !translationData || !grammarData
            }
            onClick={async () => {
              const res = await createSentence({
                original: inputValue,
                translation: translationData,
                grammar: grammarData
              })
              console.log(res)
            }}
          >
            {isCreatingSentence ? (
              <Loader
                size='16'
                className='mr-2 animate-spin'
              />
            ) : (
              <Star
                size='16'
                className='mr-2'
              />
            )}
            添加到备忘录
          </Button>
        </div>
      </div>

      <SentenceSection
        title='原文'
        content={<div ref={selectableRef}>{inputValue}</div>}
      />
      {translationData && (
        <SentenceSection
          title='译文'
          content={translationData}
        />
      )}

      {grammarData && (
        <SentenceSection
          title='语法分析'
          content={<SentenceGrammar grammar={grammarData} />}
        />
      )}

      <TextPopover
        left={popoverPosition.left}
        top={popoverPosition.top}
        open={textPopoverOpen}
        toggleOpen={toggleTextPopover}
      />
    </div>
  )
}
