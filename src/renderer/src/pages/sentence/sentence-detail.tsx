import { Button } from '@renderer/components/ui/button'
import {
  fetchOneSentenceById,
  updateSentence
} from '@renderer/database/sentence'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CircleHelp, RotateCw } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import SentenceGrammar from './sentence-grammar'
import SentenceSection from './sentence-section'
import { useChatApi } from '@renderer/hooks/useChatApi'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@renderer/components/ui/popover'
import { useToggle } from '@uidotdev/usehooks'
import { eq } from 'drizzle-orm'
import { SentencesTable, WordsReturn } from '@schema'
import { PopoverArrow } from '@radix-ui/react-popover'
import WordTags from '@renderer/components/word-tags'
import { Sheet, SheetContent } from '@renderer/components/ui/sheet'
import { useEffect, useRef, useState } from 'react'
import WordParaphrase from '@renderer/pages/word/word-paraphrase'
import SpeakButton from '@renderer/components/speak-button'
import TextPopover from '@renderer/components/text-popover'
import { useSelectText } from '@renderer/hooks/useSelectText'

export default function SentenceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: sentence, refetch } = useQuery({
    queryKey: ['sentenceDetail', id],
    queryFn: () => {
      return fetchOneSentenceById(Number(id))
    },
    enabled: !!id
  })

  const {
    fetchSSE: fetchTranslate,
    data: translationData,
    isFetching: isTranslating,
    resetData: resetTranslationData
  } = useChatApi('translate')

  const {
    fetchSSE: fetchAnalyse,
    data: grammarData,
    isFetching: isAnalyzing,
    resetData: resetGrammarData
  } = useChatApi('analyze')

  const handleReplaceTranslation = async () => {
    if (!sentence) return
    await updateSentence(
      {
        ...sentence,
        translation: translationData
      },
      eq(SentencesTable.id, sentence.id)
    )
    await refetch()

    resetTranslationData()

    toggleTransitionReplaceOpen(false)
  }

  const handleReplaceGrammar = async () => {
    if (!sentence) return
    await updateSentence(
      {
        ...sentence,
        grammar: grammarData
      },
      eq(SentencesTable.id, sentence.id)
    )
    await refetch()

    resetGrammarData()

    toggleGrammarReplaceOpen(false)
  }

  const [isTransitionReplaceOpen, toggleTransitionReplaceOpen] =
    useToggle(false)
  const [isGrammarReplaceOpen, toggleGrammarReplaceOpen] = useToggle(false)

  const [wordDetailOpen, toggleWordDetailOpen] = useToggle()
  const [selectedWord, setSelectedWord] = useState<
    WordsReturn | { sentenceOriginal: string; wordOriginal: string }
  >()

  const [isRednered, setIsRendered] = useState(false)
  const selectableRef = useRef<HTMLDivElement>(null)
  const { selectedText, popoverPosition } = useSelectText(
    selectableRef,
    isRednered
  )
  useEffect(() => {
    if (sentence && !isRednered) {
      setIsRendered(true)
    }
  }, [sentence, isRednered])
  const [textPopoverOpen, toggleTextPopover] = useToggle(false)
  useEffect(() => {
    if (selectedText) {
      toggleTextPopover(true)
      setSelectedWord({
        sentenceOriginal: sentence?.original || '',
        wordOriginal: selectedText
      })
    }
  }, [selectedText])

  return (
    <div className='h-full p-1'>
      <Button
        onClick={() => navigate(-1)}
        variant='ghost'
        size='sm'
      >
        <ArrowLeft size={20} />
      </Button>

      {sentence && (
        <div className='px-4'>
          <SentenceSection
            title={
              <div className='flex items-center gap-x-3'>
                <span>原文</span>
                <SpeakButton
                  variant='secondary'
                  size='sm'
                  className='ml-1'
                  message={sentence.original || ''}
                >
                  朗读
                </SpeakButton>
              </div>
            }
            content={<div ref={selectableRef}>{sentence.original || ''}</div>}
          />

          <SentenceSection
            title={
              <div className='flex items-center gap-x-3'>
                <span>译文</span>
                <Button
                  onClick={() =>
                    fetchTranslate({
                      sentence: sentence.original
                    })
                  }
                  variant='ghost'
                  className='p-0 ml-1 hover:bg-transparent'
                >
                  <RotateCw
                    size={16}
                    className={`ml-1 ${isTranslating ? 'animate-spin' : ''}`}
                  />
                </Button>

                <Popover
                  open={isTransitionReplaceOpen}
                  onOpenChange={toggleTransitionReplaceOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant='secondary'
                      size='sm'
                      className='ml-1'
                      disabled={isTranslating || !translationData}
                      onClick={() => {}}
                    >
                      替换
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className='w-fit p-2'>
                    <PopoverArrow className='fill-neutral-200' />
                    <div className='flex items-center text-sm'>
                      <CircleHelp
                        size={16}
                        className='inline-block mr-1 text-destructive'
                      />
                      是否确认替换？
                    </div>
                    <div className='flex justify-end mt-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='px-2 h-6 mr-1'
                        onClick={() => toggleTransitionReplaceOpen(false)}
                      >
                        No
                      </Button>
                      <Button
                        size='sm'
                        className='px-2 h-6'
                        onClick={handleReplaceTranslation}
                      >
                        Yes
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button
                  variant='secondary'
                  size='sm'
                  className='ml-1'
                  disabled={isTranslating || !translationData}
                  onClick={() => resetTranslationData()}
                >
                  撤销
                </Button>
              </div>
            }
            content={translationData || sentence.translation || ''}
          />
          {sentence.words.length > 0 && (
            <SentenceSection
              title='生词'
              content={
                <WordTags
                  words={sentence.words}
                  onClickWord={(word) => {
                    setSelectedWord(word)
                    toggleWordDetailOpen()
                  }}
                />
              }
            />
          )}

          <SentenceSection
            title={
              <div className='flex items-center gap-x-3'>
                <span>语法分析</span>
                <Button
                  onClick={() =>
                    fetchAnalyse({
                      sentence: sentence.original
                    })
                  }
                  variant='ghost'
                  className='p-0 ml-1 hover:bg-transparent'
                >
                  <RotateCw
                    size={16}
                    className={`ml-1 ${isAnalyzing ? 'animate-spin' : ''}`}
                  />
                </Button>

                <Popover
                  open={isGrammarReplaceOpen}
                  onOpenChange={toggleGrammarReplaceOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant='secondary'
                      size='sm'
                      className='ml-1'
                      disabled={isAnalyzing || !grammarData}
                      onClick={() => {}}
                    >
                      替换
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-fit p-2'>
                    <div className='flex items-center text-sm'>
                      <CircleHelp
                        size={16}
                        className='inline-block mr-1 text-destructive'
                      />
                      是否确认替换？
                    </div>
                    <div className='flex justify-end mt-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='px-2 h-6 mr-1'
                        onClick={() => toggleGrammarReplaceOpen(false)}
                      >
                        No
                      </Button>
                      <Button
                        size='sm'
                        className='px-2 h-6'
                        onClick={handleReplaceGrammar}
                      >
                        Yes
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button
                  variant='secondary'
                  size='sm'
                  className='ml-1'
                  disabled={isAnalyzing || !grammarData}
                  onClick={() => resetGrammarData()}
                >
                  撤销
                </Button>
              </div>
            }
            content={
              <SentenceGrammar
                grammar={grammarData || sentence.grammar || ''}
              />
            }
          />
        </div>
      )}

      <Sheet
        open={wordDetailOpen}
        onOpenChange={toggleWordDetailOpen}
      >
        <SheetContent className='overflow-auto pt-14'>
          {selectedWord && (
            <WordParaphrase
              word={selectedWord}
              onCreated={() => {
                refetch()
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      <TextPopover
        left={popoverPosition.left}
        top={popoverPosition.top}
        open={textPopoverOpen}
        toggleOpen={toggleTextPopover}
        onTrigger={() => {
          toggleWordDetailOpen(true)
        }}
      />
    </div>
  )
}
