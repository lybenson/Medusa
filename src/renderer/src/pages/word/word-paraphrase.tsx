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
import SpeakButton from '@renderer/components/speak-button'

type WordParaphraseProps = {
  word:
    | WordsReturn
    | {
        sentenceOriginal: string
        wordOriginal: string
      }
  onCreated?: () => void
}

export default function WordParaphrase({
  word,
  onCreated
}: WordParaphraseProps) {
  const {
    fetchSSE,
    data: wordTranslationData,
    isFetching: isTranslating
  } = useChatApi('word')

  const {
    mutateAsync: createWord,
    isPending: isCreatingWord
    // isSuccess: isCreateWordSuccess
    // isError: isCreateWordError
  } = useMutation({
    mutationKey: [
      'createWord',
      'id' in word ? word.original : word.wordOriginal
    ],
    mutationFn: insertWord
  })

  useEffect(() => {
    if ('wordOriginal' in word) fetchSSE(sentenceOriginal, wordOriginal)
  }, [])

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
      onCreated?.()
    } catch (error) {
      toast.error('添加失败')
    }
  }

  const Renderer = ({
    wordOriginal,
    literal
  }: {
    wordOriginal: string
    literal: string
  }) => {
    return (
      <div className='overflow-auto '>
        <div className='flex items-center '>
          <SpeakButton message={wordOriginal}>朗读</SpeakButton>
          {!('id' in word) && (
            <Button
              size='sm'
              className='mr-2'
              onClick={() => handleInsertWord()}
              disabled={isTranslating || isCreatingWord}
            >
              添加到生词簿
            </Button>
          )}
          {'wordOriginal' in word && (
            <Button
              onClick={() => fetchSSE(sentenceOriginal, wordOriginal)}
              size='sm'
              disabled={isTranslating || !wordOriginal}
            >
              <RotateCw
                size={16}
                className={`mr-2 ${isTranslating ? 'animate-spin' : ''}`}
              />
              翻译
            </Button>
          )}
        </div>

        <div className='mt-2'>
          <Paragraph literal={literal} />
        </div>
      </div>
    )
  }
  if ('id' in word) {
    return Renderer({
      wordOriginal: word.original,
      literal: word.translation
    })
  }
  const { sentenceOriginal, wordOriginal } = word

  return Renderer({
    wordOriginal,
    literal: wordTranslationData
  })
}
