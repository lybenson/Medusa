import { Button } from '@renderer/components/ui/button'
import { Textarea } from '@renderer/components/ui/textarea'
import { db } from '@renderer/db'
import { translate } from '@renderer/translate'
import { sentense } from '@schema'
import { useEffect, useState } from 'react'

export default function Chat() {
  const handleSubmit = () => {
    translate('Event has been created.')
  }
  const [postList, setPosts] = useState([] as any[])

  useEffect(() => {
    db.query.sentense.findMany().then((result) => {
      setPosts(result)
    })
  }, [])

  return (
    <div>
      <Textarea className='min-h-32 mb-4 text-base' />
      <Button
        size='sm'
        onClick={handleSubmit}
      >
        Submit
      </Button>
      <Button
        size='sm'
        onClick={async () => {
          await db.insert(sentense).values({
            id: Math.floor(Math.random() * 1000),
            title: 'hello world'
          })
        }}
      >
        Add to memorandum
      </Button>
      We are using Node.js <span id='node-version'></span>
      {postList.map((post) => {
        return <div key={post.id}>{post.title}</div>
      })}
    </div>
  )
}
