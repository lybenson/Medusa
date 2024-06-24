import { SentenceGroupsReturn } from '@schema'
import { create } from 'zustand'

interface GolbalState {
  selectedGroup: SentenceGroupsReturn | undefined
  onSelectedGroup: (group: SentenceGroupsReturn) => void
}

export const useGlobalStore = create<GolbalState>((set) => ({
  selectedGroup: undefined,
  onSelectedGroup: (group) => set(() => ({ selectedGroup: group }))
}))
