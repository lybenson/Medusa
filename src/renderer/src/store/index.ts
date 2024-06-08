import { DEFAULT_PATH } from '@renderer/constants'
import { RoutePath } from '@renderer/routes'
import { create } from 'zustand'

interface PageState {
  currentPath: RoutePath
  setCurrentPath: (path: RoutePath) => void
}

export const usePageStore = create<PageState>((set) => ({
  currentPath: DEFAULT_PATH,
  setCurrentPath: (path) => set({ currentPath: path })
}))
