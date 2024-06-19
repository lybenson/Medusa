import Chat from '@renderer/pages/chat'
import SentenceDetail from '@renderer/pages/sentence/sentence-detail'
import SentenceList from '@renderer/pages/sentence/sentence-list'
import WordList from '@renderer/pages/word/word-list'
import { MessageCircleQuestion, Swords, Trophy } from 'lucide-react'

export type RoutePath =
  | 'chat'
  | 'sentence-list'
  | 'word-list'
  | 'sentence-list/:id'

export type RouteItem = {
  path: RoutePath | ':id'
  component: React.ReactNode
  icon?: React.ReactNode
  isMenu: boolean
  text: string
  children?: RouteItem[]
}

export const routes: RouteItem[] = [
  {
    path: 'chat',
    component: <Chat />,
    text: 'Chat',
    isMenu: true,
    icon: <MessageCircleQuestion size={18} />
  },
  {
    path: 'sentence-list',
    component: <SentenceList />,
    text: 'Sentence List',
    isMenu: true,
    icon: <Trophy size={18} />
  },
  {
    path: 'sentence-list/:id',
    component: <SentenceDetail />,
    text: 'Sentence Detail',
    isMenu: false
  },
  {
    path: 'word-list',
    component: <WordList />,
    text: 'Word List',
    isMenu: true,
    icon: <Swords size={18} />
  }
]
