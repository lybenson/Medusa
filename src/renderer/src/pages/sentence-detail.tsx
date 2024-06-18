import { Button } from '@renderer/components/ui/button'
import { fetchOneSentence } from '@renderer/database/sentence'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ChevronLeft } from 'lucide-react'
import {
  useLocation,
  useMatches,
  useNavigate,
  useParams
} from 'react-router-dom'

export default function SentenceDetail() {
  const { id } = useParams()
  console.log(id)
  const navigate = useNavigate() // 获取 navigate 对象

  const { data } = useQuery({
    queryKey: ['sentenceDetail', id],
    queryFn: () => {
      return fetchOneSentence(Number(id))
    },
    enabled: !!id
  })
  return (
    <div className='h-full'>
      <Button
        onClick={() => navigate(-1)}
        variant='ghost'
        size='sm'
      >
        <ArrowLeft size={20} />
      </Button>

      <div>{data?.grammar}</div>
    </div>
  )
}
