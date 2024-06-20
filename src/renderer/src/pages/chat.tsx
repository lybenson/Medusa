import { Button } from '@renderer/components/ui/button'
import { Textarea } from '@renderer/components/ui/textarea'
import { insertSentence } from '@renderer/database/sentence'
import { useChatApi } from '@renderer/hooks/useChatApi'
import { useMutation } from '@tanstack/react-query'
import { Aperture, BarChart, Loader, Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import SentenceGrammar from './sentence/sentence-grammar'
import SentenceSection from './sentence/sentence-section'
import TextPopover from '@renderer/components/text-popover'
import { useToggle } from '@uidotdev/usehooks'
import { Sheet, SheetContent } from '@renderer/components/ui/sheet'
import WordParaphrase from './word/word-paraphrase'
import SpeakButton from '@renderer/components/speak-button'

export default function Chat() {
  const [inputValue, setInputValue] = useState('')

  const {
    fetchSSE: fetchTranslate,
    data: translationData,
    isFetching: isTranslating
  } = useChatApi('translate')

  const {
    fetchSSE: fetchAnalyse,
    data: grammarData,
    isFetching: isAnalyzing
  } = useChatApi('analyze')

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

  const [selectedText, setSelectedText] = useState('')
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
      setSelectedText(selection.toString())
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

  const [sheetOpen, toggleSheetOpen] = useToggle(false)
  const handleTranslateWord = () => {
    toggleTextPopover(false)
    toggleSheetOpen(true)
  }

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
              fetchTranslate(inputValue)
            }
          }
        }}
      />
      <div className='flex justify-between'>
        <div></div>
        <div>
          <SpeakButton message={inputValue}>朗读</SpeakButton>
          <Button
            size='sm'
            className='mr-2'
            onClick={() => fetchTranslate(inputValue)}
            disabled={isTranslating || !inputValue}
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
            onClick={() => fetchAnalyse(inputValue)}
            disabled={isAnalyzing || !inputValue}
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

      {inputValue && (
        <SentenceSection
          title='原文'
          content={<div ref={selectableRef}>{inputValue}</div>}
        />
      )}

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
        onTrigger={handleTranslateWord}
      />

      <Sheet
        open={sheetOpen}
        onOpenChange={toggleSheetOpen}
      >
        <SheetContent
          className='overflow-auto pt-14'
          onEscapeKeyDown={(e) => e.preventDefault()}
          // onInteractOutside={(e) => e.preventDefault()}
        >
          <WordParaphrase
            wordOriginal={selectedText}
            sentenceOriginal={inputValue}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
