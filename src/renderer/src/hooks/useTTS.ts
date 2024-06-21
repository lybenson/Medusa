import { TTS_CLIENT_TOKEN } from '@renderer/constants'
import { parseTTSStream } from '@renderer/lib/utils'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
export default function useTTS() {
  const [isFetching, setIsFetching] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = (message: string) => {
    const ws = new WebSocket(
      `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TTS_CLIENT_TOKEN}`
    )
    ws.binaryType = 'arraybuffer'

    const speechConfig = `X-Timestamp:${new Date().toISOString()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"true"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`

    const ssmlVoice = 'zh-CN-XiaoxiaoNeural'
    const ssmlProsody = {
      pitch: '+0Hz',
      rate: '1',
      volume: '100'
    }
    const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${ssmlVoice}'><prosody pitch='${ssmlProsody.pitch}' rate='${ssmlProsody.rate}' volume='${ssmlProsody.volume}'>${message}</prosody></voice></speak>`
    const requestId = uuidv4().replace(/-/g, '')

    let audioData = new ArrayBuffer(0)

    setIsFetching(true)
    ws.onopen = () => {
      ws.send(speechConfig)
      ws.send(
        `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${new Date().toISOString()}\r\nPath:ssml\r\n\r\n${ssml}`
      )
    }
    ws.onmessage = (event: MessageEvent) => {
      if (typeof event.data === 'string') {
        const { headers } = parseTTSStream(event.data)
        const path = headers['Path'] // 'turn.start' | 'turn.end'

        if (path === 'turn.end') {
          setIsFetching(false)
          const audioBlob = new Blob([audioData], { type: 'audio/mp3' })
          const audioUrl = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrl)
          audio.play()

          audio.onplay = () => {
            setIsSpeaking(true)
          }
          audio.onended = () => {
            setIsSpeaking(false)
            ws.close()
          }
        }
      } else if (event.data instanceof ArrayBuffer) {
        const dataview = new DataView(event.data)
        const headerLength = dataview.getInt16(0)
        if (event.data.byteLength > headerLength + 2) {
          const newBody = event.data.slice(2 + headerLength)
          const newAudioData = new ArrayBuffer(
            audioData.byteLength + newBody.byteLength
          )
          const mergedUint8Array = new Uint8Array(newAudioData)
          mergedUint8Array.set(new Uint8Array(audioData), 0)
          mergedUint8Array.set(new Uint8Array(newBody), audioData.byteLength)
          audioData = newAudioData
        }
      }
    }
    ws.onclose = () => {
      setIsFetching(false)
      setIsSpeaking(false)
    }
    ws.onerror = () => {
      setIsFetching(false)
      setIsSpeaking(false)
    }
  }
  return {
    speak,
    isFetching,
    isSpeaking
  }
}
