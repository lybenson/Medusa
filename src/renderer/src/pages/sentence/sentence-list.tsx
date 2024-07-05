import { Button } from '@renderer/components/ui/button'
import { PER_PAGE } from '@renderer/constants'
import { fetchSentencesByGroupAndDateRange } from '@renderer/database/sentence'
import { SentenceGroupsReturn, WordsReturn } from '@schema'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Sheet, SheetContent } from '@renderer/components/ui/sheet'
import { useToggle } from '@uidotdev/usehooks'
import { useState } from 'react'
import dayjs from '@renderer/lib/dayjs'

import WordParaphrase from '@renderer/pages/word/word-paraphrase'
import { Tabs, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import SentenceItem from './sentence-item'

export default function SentenceList({
  group
}: {
  group?: SentenceGroupsReturn
}) {
  const now = dayjs()

  const tabs = [
    {
      label: '今日新增',
      value: 'today',
      dateRange: {
        start: now.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        end: now.endOf('day').format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      label: '昨日新增',
      value: 'yesterday',
      dateRange: {
        start: now
          .subtract(1, 'day')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss'),
        end: now.subtract(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      label: '最近三日',
      value: 'last3days',
      dateRange: {
        start: now.subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
        end: now.format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      label: '最近一周',
      value: 'last7days',
      dateRange: {
        start: now.subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
        end: now.format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      label: '最近一月',
      value: 'last30days',
      dateRange: {
        start: now.subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'),
        end: now.format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      label: '全部',
      value: 'all',
      dateRange: null
    }
  ]
  const [activeTab, setActiveTab] = useState(tabs[0].value)

  const { data, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ['sentenceList', group?.id, activeTab],
    queryFn: ({ pageParam }) => {
      return fetchSentencesByGroupAndDateRange(
        group?.id,
        tabs.find((tab) => tab.value === activeTab)?.dateRange,
        PER_PAGE,
        PER_PAGE * pageParam
      )
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PER_PAGE ? allPages.length : undefined
    },
    enabled: !!group && !!activeTab
  })
  const sentenceList = data?.pages.map((page) => page).flat()

  const [wordDetailOpen, toggleWordDetailOpen] = useToggle()
  const [selectedWord, setSelectedWord] = useState<WordsReturn>()

  return (
    <div>
      <h1 className='scroll-m-20 text-4xl font-bold tracking-tight'>
        {group?.name}
      </h1>

      <Tabs
        className='mt-4'
        defaultValue={activeTab}
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className='grid w-full grid-cols-6'>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.label}
              value={tab.value}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
