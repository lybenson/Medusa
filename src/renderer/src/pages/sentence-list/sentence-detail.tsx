import { Button } from '@renderer/components/ui/button'
import { fetchOneSentence, updateSentence } from '@renderer/database/sentence'
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
import { sentences } from '@schema'
import { PopoverArrow } from '@radix-ui/react-popover'

export default function SentenceDetail() {
  const { id } = useParams()
  const navigate = useNavigate() // 获取 navigate 对象

  const { data: sentence, refetch } = useQuery({
    queryKey: ['sentenceDetail', id],
    queryFn: () => {
      return fetchOneSentence(Number(id))
    },
    enabled: !!id
  })

  console.log(sentence)

  const {
    fetchSSE,
    translationData,
    grammarData,
    isTranslating,
    isAnalyzing,
    resetGrammarData,
    resetTranslationData
  } = useChatApi(sentence?.original)

  const handleReplaceTranslation = async () => {
    if (!sentence) return
    await updateSentence(
      {
        ...sentence,
        translation: translationData
      },
      eq(sentences.id, sentence.id)
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
      eq(sentences.id, sentence.id)
    )
    await refetch()

    resetGrammarData()

    toggleGrammarReplaceOpen(false)
  }

  const [isTransitionReplaceOpen, toggleTransitionReplaceOpen] =
    useToggle(false)
  const [isGrammarReplaceOpen, toggleGrammarReplaceOpen] = useToggle(false)

  return (
    <div className='h-full'>
      <Button
        onClick={() => navigate(-1)}
        variant='ghost'
        size='sm'
      >
        <ArrowLeft size={20} />
      </Button>

      <div className='px-4'>
        <SentenceSection
          title='原文'
          content={sentence?.original || ''}
        />

        <SentenceSection
          title={
            <div className='flex items-center gap-x-3'>
              <span>译文</span>
              <Button
                onClick={() => fetchSSE('translate')}
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
          content={translationData || sentence?.translation || ''}
        />

        <SentenceSection
          title={
            <div className='flex items-center gap-x-3'>
              <span>语法分析</span>
              <Button
                onClick={() => fetchSSE('analyze')}
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
            <SentenceGrammar grammar={grammarData || sentence?.grammar || ''} />
          }
        />
      </div>
    </div>
  )
}
