import Chat from '@renderer/pages/chat'
import SentenceDetail from '@renderer/pages/sentence-list/sentence-detail'
import SentenceList from '@renderer/pages/sentence-list/sentence-list'
import WordList from '@renderer/pages/word-list'
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
    icon: <Trophy size={18} />,
    children: [
      {
        path: ':id',
        component: <SentenceDetail />,
        isMenu: false,
        text: 'Sentence Detail'
      }
    ]
  },
  {
    path: 'word-list',
    component: <WordList />,
    text: 'Word List',
    isMenu: true,
    icon: <Swords size={18} />
  }
]
