import { fetchSentencesGroup } from '@renderer/database/sentence-group'
import { SentenceGroupsReturn } from '@schema'
import { create } from 'zustand'

interface GolbalState {
  groups: SentenceGroupsReturn[]
  selectedGroup: SentenceGroupsReturn | undefined
  onSelectedGroup: (group: SentenceGroupsReturn) => void
  requestGroups: () => void
}

export const useGlobalStore = create<GolbalState>((set) => ({
  groups: [],
  selectedGroup: undefined,
  onSelectedGroup: (group) => set(() => ({ selectedGroup: group })),
  requestGroups: () =>
    fetchSentencesGroup().then((groups) => {
      set(() => ({ groups }))
    })
}))
