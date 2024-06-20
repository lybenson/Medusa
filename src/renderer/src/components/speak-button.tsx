import useTTS from '@renderer/hooks/useTTS'
import { Button } from './ui/button'
import { AudioLines, RotateCw } from 'lucide-react'
import AudioPlayingIcon from './audio-playing-icon'
import type { ButtonProps } from '@renderer/components/ui/button'
import { cn } from '@renderer/lib/utils'

type SpeakButtonProps = {
  message?: string
} & ButtonProps

export default function SpeakButton({
  message,
  children,
  ...rest
}: SpeakButtonProps) {
  const { isFetching, isSpeaking, speak } = useTTS()
  return (
    <Button
      disabled={isFetching || isSpeaking || !message}
      size='sm'
      className={`${cn('mr-2', rest.className)}`}
      onClick={(e) => {
        e.stopPropagation()
        if (message) {
          speak(message)
        }
      }}
      {...rest}
    >
      {isFetching ? (
        <RotateCw
          size={16}
          className={`mr-2 ${isFetching ? 'animate-spin' : ''}`}
        />
      ) : isSpeaking ? (
        <AudioPlayingIcon />
      ) : (
        <AudioLines
          size={16}
          className='mr-2'
        />
      )}
      {children}
    </Button>
  )
}
