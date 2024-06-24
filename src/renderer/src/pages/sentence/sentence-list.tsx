import { Button } from '@renderer/components/ui/button'
import WordTags from '@renderer/components/word-tags'
import { PER_PAGE } from '@renderer/constants'
import {
  fetchSentencesByGroup,
  updateSentence
} from '@renderer/database/sentence'
import { SentenceGroupsReturn, SentencesTable, WordsReturn } from '@schema'
import { useInfiniteQuery } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'
import { BadgeCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Sheet, SheetContent } from '@renderer/components/ui/sheet'
import { useToggle } from '@uidotdev/usehooks'
import { useState } from 'react'
import WordParaphrase from '@renderer/pages/word/word-paraphrase'
import SpeakButton from '@renderer/components/speak-button'

export default function SentenceList({
  group
}: {
  group?: SentenceGroupsReturn
}) {
  const navigate = useNavigate()
  const { data, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ['sentenceList', group?.id],
    queryFn: ({ pageParam }) => {
      return fetchSentencesByGroup(group?.id, PER_PAGE, PER_PAGE * pageParam)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PER_PAGE ? allPages.length : undefined
    },
    enabled: !!group
  })
  console.log(group?.id)

  const sentenceList = data?.pages.map((page) => page).flat()

  const [wordDetailOpen, toggleWordDetailOpen] = useToggle()
  const [selectedWord, setSelectedWord] = useState<WordsReturn>()

  return (
    <div>
      <h1 className='scroll-m-20 text-4xl font-bold tracking-tight'>
        {group?.name}
      </h1>
      <div className='flex flex-col gap-y-3 mt-4'>
        {sentenceList?.map((sentence) => (
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
            <div className=' mt-2 text-sm text-gray-600'>
              {sentence.translation}
            </div>
            <div className='flex justify-between items-center mt-4'>
              <div className='max-w-[80%]'>
                <WordTags
                  words={sentence.words}
                  onClickWord={(word) => {
                    setSelectedWord(word)
                    toggleWordDetailOpen()
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
                  className='p-0'
                  onClick={async (e) => {
                    e.stopPropagation()
                    await updateSentence(
                      {
                        ...sentence,
                        learned: !sentence.learned
                      },
                      eq(SentencesTable.id, sentence.id)
                    )
                    refetch()
                  }}
                >
                  <BadgeCheck size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-center mt-2 text-gray-300 font-normal'>
        <Button
          onClick={() => fetchNextPage()}
          variant='ghost'
          className='hover:bg-transparent'
        >
          {hasNextPage ? 'Load More' : 'No More Data'}
        </Button>
      </div>

      <Sheet
        open={wordDetailOpen}
        onOpenChange={toggleWordDetailOpen}
      >
        <SheetContent className='overflow-auto pt-14'>
          {selectedWord && <WordParaphrase word={selectedWord} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}
