import { Button } from '@renderer/components/ui/button'
import { Textarea } from '@renderer/components/ui/textarea'
import { insertSentence } from '@renderer/database/sentence'
import { useChatApi } from '@renderer/hooks/useChatApi'
import { useMutation } from '@tanstack/react-query'
import {
  Aperture,
  BarChart,
  Check,
  ChevronsUpDown,
  Loader,
  Star
} from 'lucide-react'
import { useChat } from '@ai-sdk/react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import SentenceGrammar from './sentence/sentence-grammar'
import SentenceSection from './sentence/sentence-section'
import TextPopover from '@renderer/components/text-popover'
import { useToggle } from '@uidotdev/usehooks'
import { Sheet, SheetContent } from '@renderer/components/ui/sheet'
import WordParaphrase from './word/word-paraphrase'
import SpeakButton from '@renderer/components/speak-button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@renderer/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@renderer/components/ui/command'
import { useGlobalStore } from '@renderer/store'
import { cn } from '@renderer/lib/utils'
import { SentenceGroupsReturn } from '@schema'
import Paragraph from '@renderer/components/paragraph'

export default function Chat() {
  const [inputValue, setInputValue] = useState(
    'The AI SDK standardizes integrating artificial intelligence (AI) models across supported providers. This enables developers to focus on building great AI applications, not waste time on technical details.'
  )
  const groups = useGlobalStore((state) => state.groups)

  const [trimedInputValue, setTrimedInputValue] = useState('')
  useEffect(() => {
    setTrimedInputValue(inputValue.trim())
  }, [inputValue])

  const {
    fetchSSE: fetchTranslate,
    cachedData: translationCachedData,
    isFetching: isTranslating
  } = useChatApi('translate')

  useChat({})

  const {
    fetchSSE: fetchAnalyse,
    cachedData: grammarCachedData,
    isFetching: isAnalyzing
  } = useChatApi('analyze')

  const { mutateAsync: createSentence, isPending: isCreatingSentence } =
    useMutation({
      mutationKey: ['createSentence', trimedInputValue],
      mutationFn: insertSentence
    })

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
      const trimedSelectedText = selection.toString().trim()

      if (trimedSelectedText) {
        setSelectedText(
          trimedSelectedText.charAt(0).toLowerCase() +
            trimedSelectedText.slice(1)
        )
        toggleTextPopover(true)
      }
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
  }, [selectableRef.current])

  const [sheetOpen, toggleSheetOpen] = useToggle(false)
  const handleTranslateWord = () => {
    toggleTextPopover(false)
    toggleSheetOpen(true)
  }

  const [selectedGroup, setSelectedGroup] = useState<SentenceGroupsReturn>()
  const [selectGroupOpen, toggleSelectGroupOpen] = useToggle(false)

  return (
    <div className='relative p-4'>
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
              fetchTranslate({
                sentence: trimedInputValue
              })
            }
          }
        }}
      />
      <div className='flex justify-between items-center'>
        <div></div>
        <div className='flex items-center'>
          <Popover
            open={selectGroupOpen}
            onOpenChange={toggleSelectGroupOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                className='w-40 justify-between h-8 mr-2 flex'
              >
                <span className='truncate'>
                  {selectedGroup
                    ? groups.find((group) => group.name === selectedGroup.name)
                        ?.name
                    : 'Select Group'}
                </span>
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>

            <PopoverContent className='w-fit p-0'>
              <Command>
                <CommandInput
                  placeholder='Search group...'
                  className='h-8'
                />
                <CommandList>
                  <CommandEmpty>No group found.</CommandEmpty>
                  <CommandGroup>
                    {groups.map((group) => (
                      <CommandItem
                        key={group.id}
                        value={group.name}
                        onSelect={(currentValue) => {
                          const group = groups.find(
                            (group) => group.name === currentValue
                          )

                          setSelectedGroup(
                            currentValue === selectedGroup?.name
                              ? undefined
                              : group
                          )
                          toggleSelectGroupOpen(false)
                        }}
                      >
                        <span className='truncate'>{group.name}</span>
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4 shrink-0',
                            selectedGroup?.name === group.name
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <SpeakButton message={trimedInputValue}>朗读</SpeakButton>
          <Button
            size='sm'
            className='mr-2'
            onClick={() => fetchTranslate({ sentence: trimedInputValue })}
            disabled={isTranslating || !trimedInputValue}
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
            onClick={() => fetchAnalyse({ sentence: trimedInputValue })}
            disabled={isAnalyzing || !trimedInputValue}
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
              isTranslating ||
              isAnalyzing ||
              !trimedInputValue ||
              !translationCachedData.get(trimedInputValue)
            }
            onClick={async () => {
              if (!selectedGroup) return toast.error('请选择一个组')
              try {
                await createSentence({
                  original: trimedInputValue,
                  translation:
                    translationCachedData.get(trimedInputValue) || '',
                  grammar: grammarCachedData.get(trimedInputValue),
                  groupId: selectedGroup.id
                })
                toast.success('添加到备忘录成功')
              } catch (error) {
                toast.error('添加到备忘录失败')
              }
              return null
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
      {/* <div ref={selectableRef}>{trimedInputValue}</div> */}
      {trimedInputValue && (
        <SentenceSection
          title='原文'
          content={
            <Paragraph
              literal={trimedInputValue}
              ref={selectableRef}
            ></Paragraph>
          }
        />
      )}

      {translationCachedData.get(trimedInputValue) && (
        <SentenceSection
          title='译文'
          content={
            <Paragraph
              literal={translationCachedData.get(trimedInputValue) || ''}
            ></Paragraph>
          }
        />
      )}

      {grammarCachedData.get(trimedInputValue) && (
        <SentenceSection
          title='语法分析'
          content={
            <SentenceGrammar
              grammar={grammarCachedData.get(trimedInputValue)}
            />
          }
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
            word={{
              wordOriginal: selectedText,
              sentenceOriginal: trimedInputValue
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
