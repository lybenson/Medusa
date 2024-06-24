import SpeakButton from '@renderer/components/speak-button'
import { Button } from '@renderer/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@renderer/components/ui/popover'
import WordTags from '@renderer/components/word-tags'
import { updateSentence } from '@renderer/database/sentence'
import { useGlobalStore } from '@renderer/store'
import { SentencesRelationReturn, SentencesTable, WordsReturn } from '@schema'
import { useToggle } from '@uidotdev/usehooks'
import { eq } from 'drizzle-orm'
import { BadgeCheck, CornerUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SentenceItem({
  sentence,
  onRefetch,
  onSelectedWord
}: {
  sentence: SentencesRelationReturn
  onRefetch: any
  onSelectedWord: (word: WordsReturn) => void
}) {
  const navigate = useNavigate()

  const [moveToGroupOpen, toggleMoveToGroup] = useToggle()
  const groups = useGlobalStore((state) => state.groups)

  return (
    <div
      className=' bg-gray-100 px-4 py-2 rounded-md cursor-pointer'
      key={sentence.id}
      onClick={() => {
        navigate(`${sentence.id}`)
      }}
    >
      <div className={sentence.learned ? 'line-through italic' : ''}>
        {sentence.original}
      </div>
      <div className=' mt-2 text-sm text-gray-600'>{sentence.translation}</div>
      <div className='flex justify-between items-center mt-4'>
        <div className='max-w-[80%]'>
          <WordTags
            words={sentence.words}
            onClickWord={(word) => {
              onSelectedWord(word)
            }}
          />
        </div>

        <div className='flex gap-x-2 items-center'>
          <SpeakButton
            message={sentence.original}
            variant='ghost'
            className='p-0'
          />
          {/* <Button
        variant='ghost'
        className='p-0'
        onClick={async () => {
          await updateSentence(
            {
              ...sentence,
              deleted: !sentence.deleted
            },
            eq(SentencesTable.id, sentence.id)
          )
          refetch()
        }}
      >
        <Trash2 size={16} />
      </Button> */}

          <Button
            variant='ghost'
            className='p-0 mr-2'
            onClick={async (e) => {
              e.stopPropagation()
              await updateSentence(
                {
                  ...sentence,
                  learned: !sentence.learned
                },
                eq(SentencesTable.id, sentence.id)
              )
              onRefetch()
            }}
          >
            <BadgeCheck size={16} />
          </Button>

          <Popover
            open={moveToGroupOpen}
            onOpenChange={toggleMoveToGroup}
          >
            <PopoverTrigger asChild>
              <Button
                variant='ghost'
                className='p-0'
                onClick={async (e) => {
                  e.stopPropagation()
                }}
              >
                <CornerUpRight size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-fit p-2'>
              <div className='flex flex-col'>
                <div>Move to</div>
                <div className='h-[1px] bg-gray-200'></div>
                <div className='flex flex-col mt-1'>
                  {groups.map((group) => (
                    <Button
                      key={group.id}
                      variant='ghost'
                      size='sm'
                      className='px-2 py-0 justify-start'
                      onClick={async (e) => {
                        e.stopPropagation()
                        if (group.id === sentence.groupId) {
                          toggleMoveToGroup(false)
                          return
                        }
                        await updateSentence(
                          {
                            ...sentence,
                            groupId: group.id
                          },
                          eq(SentencesTable.id, sentence.id)
                        )
                        toggleMoveToGroup(false)
                        onRefetch()
                      }}
                    >
                      {group.name}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
