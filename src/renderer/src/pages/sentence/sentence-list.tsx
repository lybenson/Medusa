import { Button } from '@renderer/components/ui/button'
import { PER_PAGE } from '@renderer/constants'
import { fetchSentencesByGroup } from '@renderer/database/sentence'
import { SentenceGroupsReturn, WordsReturn } from '@schema'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Sheet, SheetContent } from '@renderer/components/ui/sheet'
import { useToggle } from '@uidotdev/usehooks'
import { useState } from 'react'
import WordParaphrase from '@renderer/pages/word/word-paraphrase'

import SentenceItem from './sentence-item'

export default function SentenceList({
  group
}: {
  group?: SentenceGroupsReturn
}) {
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
          <SentenceItem
            sentence={sentence}
            onRefetch={refetch}
            key={sentence.id}
            onSelectedWord={(word) => {
              setSelectedWord(word)
              toggleWordDetailOpen(true)
            }}
          />
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
