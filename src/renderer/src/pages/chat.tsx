import { Button } from '@renderer/components/ui/button'
import { Textarea } from '@renderer/components/ui/textarea'
import { insertSentence } from '@renderer/database/sentence'
import { insertWord, insertWordWithRelation } from '@renderer/database/word'

import { translate } from '@renderer/translate'
import { useMutation } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'

export default function Chat() {
  const handleSubmit = () => {
    translate('Event has been created.')
  }
  const {
    mutateAsync: createSentence,
    isPending: isCreatingSentence,
    isSuccess: isCreateSentenceSuccess,
    isError: isCreateSentenceError
  } = useMutation({
    mutationKey: ['createSentence'],
    mutationFn: insertSentence
  })

  isCreateSentenceSuccess && toast.success('添加到备忘录成功')
  isCreateSentenceError && toast.error('添加到备忘录失败')

  return (
    <div>
      <Textarea className='min-h-32 mb-4 text-base' />
      <Button
        size='sm'
        onClick={handleSubmit}
      >
        提交
      </Button>
      <Button
        size='sm'
        onClick={() =>
          createSentence({
            original: 'I am a student 23',
            translation: '我是一名学生 23'
          })
        }
      >
        {isCreatingSentence && <Loader className='mr-2 h-4 w-4 animate-spin' />}
        添加到备忘录
      </Button>
    </div>
  )
}
