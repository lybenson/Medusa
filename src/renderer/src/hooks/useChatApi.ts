import { useState } from 'react'
import { useSettings } from './useSettings'
import { parseEventStream } from '@renderer/lib/utils'
import { ENDPOINT, MODEL } from '@renderer/constants'
import { type Action, actions } from '@renderer/lib/promots'

export const useChatApi = (message: string) => {
  const { openAIApiKey } = useSettings()

  const [translationData, setTranslationData] = useState('')
  const [grammarData, setGrammarData] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchSSE = async (action: Action) => {
    const messages = actions[action](message)
    try {
      setIsLoading(true)
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

          if (action === 'translate') setTranslationData(received)
          else if (action === 'analyze') setGrammarData(received)
        })
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }
  return {
    fetchSSE: fetchSSE,
    isLoading,
    translationData,
    grammarData
  }
}
