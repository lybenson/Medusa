import Paragraph from '@renderer/components/paragraph'
import { Card, CardContent } from '@renderer/components/ui/card'

export default function SentenceGrammar({ grammar }) {
  return (
    <Card>
      <CardContent className='overflow-auto pt-6'>
        <Paragraph literal={grammar} />
      </CardContent>
    </Card>
  )
}
