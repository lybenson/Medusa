import { useState } from 'react'
import { useSettings } from './useSettings'
import { parseEventStream } from '@renderer/lib/utils'
import { ENDPOINT, MODEL } from '@renderer/constants'
import { type Action, actions, Message } from '@renderer/lib/promots'

import { toast } from 'sonner'

export const useChatApi = (action: Action) => {
  const { openAIApiKey } = useSettings()

  const [data, setData] = useState('')
  const [isFetching, setIsFetching] = useState(false)

  const fetchSSE = async ({
    sentence,
    word,
    chinese
  }: {
    sentence: string
    word?: string
    chinese?: string
  }) => {
    if (isFetching) return
    let messages: Message[] = []
    if (action === 'word') {
      if (!sentence || !word) return
      messages = actions[action](sentence, word)
    } else if (action === 'translate' || action === 'analyze') {
      if (!sentence) return
      messages = actions[action](sentence)
    } else if (action === 'correct') {
      if (!sentence) return
      messages = actions[action](sentence, chinese)
    }

    // or return new Error(), not toast.error()
    if (!openAIApiKey) {
      toast.error('请设置 OpenAI API Key')
      return
    }
    try {
      setIsFetching(true)
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAIApiKey}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: messages,
          stream: true
        })
      })
      if (!response.body) return
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let isDone = false

      let received = ''

      while (!isDone) {
        const { done, value } = await reader.read()
        if (done) {
          isDone = true
          break
        }
        const jsonArray = parseEventStream(decoder.decode(value))

        jsonArray.forEach((json: any) => {
          if (!json.choices || json.choices.length === 0) return

          received += json.choices[0].delta?.content || ''

          setData(received)
        })
      }
      setIsFetching(false)
    } catch (error) {
      setIsFetching(false)
    }
  }

  const resetData = () => setData('')

  return {
    fetchSSE,
    isFetching,
    data,
    resetData
  }
}
