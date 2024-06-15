export const useSettings = () => {
  return {
    openAIApiKey: localStorage.getItem('OpenAI_ApiKey')
  }
}
