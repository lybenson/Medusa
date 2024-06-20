import { motion, MotionConfig } from 'framer-motion'
import { Volume, Volume1, Volume2 } from 'lucide-react'

interface AudioPlayingIconProps {
  size?: number
}

export default function AudioPlayingIcon({ size = 16 }: AudioPlayingIconProps) {
  return (
    <div className='relative'>
      <MotionConfig
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: 'linear'
        }}
      >
        <motion.div
          animate={{ visibility: ['visible', 'hidden', 'hidden'] }}
          className='absolute top-0 left-0'
        >
          <Volume size={size} />
        </motion.div>

        <motion.div
          animate={{ visibility: ['hidden', 'visible', 'hidden'] }}
          className='absolute top-0 left-0'
        >
          <Volume1 size={size} />
        </motion.div>

        <motion.div
          animate={{ visibility: ['hidden', 'hidden', 'visible'] }}
          className='mr-2'
        >
          <Volume2 size={size} />
        </motion.div>
      </MotionConfig>
    </div>
  )
}
