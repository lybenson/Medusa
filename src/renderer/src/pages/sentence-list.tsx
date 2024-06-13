import { fetchSentences } from '@renderer/database/sentence'
import { useQuery } from '@tanstack/react-query'

export default function SentenceList() {
  const { data: sentenceList } = useQuery({
    queryKey: ['sentenceList'],
    queryFn: fetchSentences
  })

  console.log(sentenceList)

  return (
    <div>
      <h1 className='scroll-m-20 text-4xl font-bold tracking-tight'>
        Sentence List
      </h1>
      {sentenceList?.map((sentence) => (
        <div key={sentence.id}>{sentence.original}</div>
      ))}
    </div>
  )
}
