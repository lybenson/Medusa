import { Popover } from '@radix-ui/react-popover'
import { PopoverAnchor, PopoverContent } from './ui/popover'
import { Button } from './ui/button'
import { BookA } from 'lucide-react'

interface TextPopoverProps {
  left: number
  top: number
  open: boolean
  toggleOpen: (open: boolean) => void
}

export default function TextPopover({
  left = 0,
  top = 0,
  open,
  toggleOpen
}: TextPopoverProps) {
  return (
    <Popover
      open={open}
      onOpenChange={toggleOpen}
    >
      <PopoverAnchor asChild>
        <div
          style={{
            left,
            top
          }}
          className='fixed bg-red-300'
          onClick={() => toggleOpen(true)}
        />
      </PopoverAnchor>
      <PopoverContent className='w-fit p-0 text-sm rounded-full'>
        <Button
          variant='default'
          className='rounded-full p-1.5 h-6 w-6'
        >
          <BookA />
        </Button>
      </PopoverContent>
    </Popover>
  )
}
