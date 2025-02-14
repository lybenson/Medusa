import { useState } from 'react'
import { useSettings } from './useSettings'
import { type Action, actions, Message } from '@renderer/lib/promots'

import { toast } from 'sonner'
import { streamText } from 'ai'
import { anthropic } from '@renderer/lib/ai-providers'

export const useChatApi = (action: Action) => {
  const { claudeAIApiKey } = useSettings()

  const [data, setData] = useState('')
  const [isFetching, setIsFetching] = useState(false)

  const [cachedData, setCachedData] = useState<Map<string, string>>(new Map())

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
    if (!claudeAIApiKey) {
      toast.error('请设置 claude API Key')
      return
    }
    try {
      setIsFetching(true)

      const response = await streamText({
        model: anthropic('claude-3-5-sonnet-20240620'),
        messages,
        onError: (error) => {
          console.log(error)
        }
      })

      let received = ''
      for await (const textPart of response.textStream) {
        console.log(textPart)
        received += textPart

        if (action === 'translate' || action === 'analyze') {
          setCachedData((prev) => {
            const newMap = new Map(prev)
            newMap.set(sentence, received)
            return newMap
          })
        }
      }
      setData(received)
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
    resetData,
    cachedData
  }
}
