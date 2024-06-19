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
      <div className='flex gap-x-2'>
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
