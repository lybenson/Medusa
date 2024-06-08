import Chat from '@renderer/pages/chat'
import SentenceList from '@renderer/pages/sentence-list'
import WordList from '@renderer/pages/word-list'
import { MessageCircleQuestion, Swords, Trophy } from 'lucide-react'

export type RoutePath = 'chat' | 'sentence-list' | 'word-list'

export type RouteItem = {
  path: RoutePath
  component: React.ReactNode
  icon: React.ReactNode
  text: string
}

export const routes: RouteItem[] = [
  {
    path: 'chat',
    component: <Chat />,
    text: 'Chat',
    icon: <MessageCircleQuestion size={18} />
  },
  {
    path: 'sentence-list',
    component: <SentenceList />,
    text: 'Sentence List',
    icon: <Trophy size={18} />
  },
  {
    path: 'word-list',
    component: <WordList />,
    text: 'Word List',
    icon: <Swords size={18} />
  }
]
