import { WordsReturn } from '@schema'
import { Button } from './ui/button'

export default function WordTags({
  words,
  onClickWord
}: {
  words: WordsReturn[]
  onClickWord?: (word: WordsReturn) => void
}) {
  return (
    <div>
      <div className='flex gap-2 flex-wrap'>
        {words.map((word) => (
          <Button
            size='sm'
            variant='destructive'
            key={word.id}
            onClick={(e) => {
              e.stopPropagation()

              onClickWord && onClickWord(word)
            }}
          >
            {word.original}
          </Button>
        ))}
      </div>
    </div>
  )
}
