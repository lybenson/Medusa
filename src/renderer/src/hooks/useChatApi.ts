import { useState } from 'react'
import { useSettings } from './useSettings'
import { parseEventStream } from '@renderer/lib/utils'
import { ENDPOINT, MODEL } from '@renderer/constants'
import { type Action, actions } from '@renderer/lib/promots'

export const useChatApi = (message: string) => {
  const { openAIApiKey } = useSettings()

  const [data, setData] = useState('')

  const fetchSSE = async (action: Action) => {
    const messages = actions[action](message)

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
  }
  return {
    fetchSSE: fetchSSE,
    data
  }
}