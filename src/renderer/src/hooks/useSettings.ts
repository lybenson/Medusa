import store from '@renderer/settings/store'

export const useSettings = () => {
  return {
    openAIApiKey: store.getItem('OpenAI_ApiKey'),
    claudeAIApiKey: store.getItem('ClaudeAI_ApiKey')
  }
}
