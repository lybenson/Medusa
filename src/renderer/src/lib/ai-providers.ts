import { createAnthropic } from '@ai-sdk/anthropic'
import store from '@renderer/settings/store'

export const anthropic = createAnthropic({
  apiKey: store.getItem('ClaudeAI_ApiKey') || '',
  headers: {
    'anthropic-dangerous-direct-browser-access': 'true'
  }
})
