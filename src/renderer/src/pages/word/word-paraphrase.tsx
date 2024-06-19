import { useChatApi } from '@renderer/hooks/useChatApi'
import { Button } from '@renderer/components/ui/button'
import { useEffect } from 'react'
import Paragraph from '@renderer/components/paragraph'
import { useMutation } from '@tanstack/react-query'
import { insertWord } from '@renderer/database/word'
import { fetchOneSentenceByOriginal } from '@renderer/database/sentence'
import { toast } from 'sonner'
import { WordsReturn } from '@schema'
import { RotateCw } from 'lucide-react'

type WordParaphraseProps =
  | {
      sentenceOriginal: string
      wordOriginal: string
    }
  | {
      word: WordsReturn
    }
export default function WordParaphrase(props: WordParaphraseProps) {
  const {
    fetchSSE,
    data: wordTranslationData,
    isfetching: isTranslating
  } = useChatApi('word')

  const {
    mutateAsync: createWord,
    isPending: isCreatingWord
    // isSuccess: isCreateWordSuccess
    // isError: isCreateWordError
  } = useMutation({
    mutationKey: [
      'createWord',
      'word' in props ? props.word.original : props.wordOriginal
    ],
    mutationFn: insertWord
  })

  useEffect(() => {
    if ('wordOriginal' in props) fetchSSE(sentenceOriginal, wordOriginal)
  }, [])

  const Renderer = (literal: string) => {
    return (
      <div className='overflow-auto'>
        <Button
          size='sm'
          onClick={() => handleInsertWord()}
          disabled={isTranslating || isCreatingWord}
        >
          添加到生词簿
        </Button>

        {'wordOriginal' in props && (
          <Button
            onClick={() => fetchSSE(sentenceOriginal, wordOriginal)}
            variant='ghost'
            className='p-0 ml-1 hover:bg-transparent'
          >
            <RotateCw
              size={16}
              className={`ml-1 ${isTranslating ? 'animate-spin' : ''}`}
            />
          </Button>
        )}

        <div className='mt-2'>
          <Paragraph literal={literal} />
        </div>
      </div>
    )
  }
  if ('word' in props) {
    return Renderer(props.word.translation)
  }

  const { sentenceOriginal, wordOriginal } = props

  const handleInsertWord = async () => {
    let sentence
    try {
      sentence = await fetchOneSentenceByOriginal(sentenceOriginal).then(
        (res) => {
          return res
        }
      )
      if (!sentence?.id) toast.error('未找到句子')

      await createWord({
        original: wordOriginal,
        translation: wordTranslationData,
        sentenceId: sentence.id
      })
      toast.success('添加成功')
    } catch (error) {
      toast.error('添加失败')
    }
  }

  return Renderer(wordTranslationData)
}
