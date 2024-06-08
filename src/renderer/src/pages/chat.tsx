import { Button } from '@renderer/components/ui/button'
import { Textarea } from '@renderer/components/ui/textarea'
import { toast } from 'sonner'

export default function Chat() {
  return (
    <div>
      <Textarea className='min-h-32 mb-4 text-base' />
      <Button size='sm'>Submit</Button>
      <Button
        size='sm'
        onClick={() => toast.success('Event has been created.')}
      >
        Add to memorandum
      </Button>
    </div>
  )
}
