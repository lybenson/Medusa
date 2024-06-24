import SpeakButton from '@renderer/components/speak-button'
import { Button } from '@renderer/components/ui/button'
import { PER_PAGE } from '@renderer/constants'
import { fetchWords } from '@renderer/database/word'
import { useInfiniteQuery } from '@tanstack/react-query'

export default function WordList() {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['wordList'],
    queryFn: ({ pageParam }) => {
      return fetchWords(PER_PAGE, PER_PAGE * pageParam)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PER_PAGE ? allPages.length : undefined
    }
  })

  const wordList = data?.pages.map((page) => page).flat()

  return (
    <div className='p-4'>
      <h1 className='scroll-m-20 text-4xl font-bold tracking-tight'>
        Word List
      </h1>
      <div className='flex flex-col gap-y-3 mt-4'>
        {wordList?.map((word) => (
          <div
            className=' bg-gray-100 px-4 py-2 rounded-md cursor-pointer'
            key={word.id}
          >
            <div>{word.original}</div>
            <div className='mt-2 text-sm text-gray-600 line-clamp-2'>
              {word.translation}
            </div>
            <div className='flex items-center mt-2 justify-end'>
              <SpeakButton
                message={word.original}
                variant='ghost'
                className='p-0'
              />
              {/* <Button
                  variant='ghost'
                  className='p-0'
                  onClick={async () => {
                    await updateWord(
                      {
                        ...word,
                        deleted: !word.deleted
                      },
                      eq(WordsTable.id, word.id)
                    )
                    refetch()
                  }}
                >
                  <Trash2 size={16} />
                </Button> */}
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
    </div>
  )
}
