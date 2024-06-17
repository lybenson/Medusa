import { fetchWords } from '@renderer/database/word'
import { useQuery } from '@tanstack/react-query'

export default function WordList() {
  const { data: wordList } = useQuery({
    queryKey: ['wordList'],
    queryFn: fetchWords
  })
  return (
    <div>
      <h1 className='scroll-m-20 text-4xl font-bold tracking-tight'>
        Word List
      </h1>
      {/* {wordList?.map((word) => <div key={word.id}>{word.original}</div>)} */}
    </div>
  )
}
