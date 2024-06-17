import { Settings } from 'lucide-react'
import { Button } from './ui/button'

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@renderer/components/ui/drawer'
import { Input } from './ui/input'
import { useState } from 'react'
import store from '@renderer/settings/store'

export default function AppHeader() {
  const [open, setOpen] = useState(false)
  const [openAIApiKey, setOpenAIApiKey] = useState(
    store.getItem('OpenAI_ApiKey') || ''
  )

  const handleSave = () => {
    store.setItem('OpenAI_ApiKey', openAIApiKey)
    setOpen(false)
  }

  return (
    <div
      className='border-b flex flex-col'
      data-drag-region
    >
      <div className='flex items-center justify-between h-full'>
        <div />
        <div
          className='flex items-center'
          data-no-drag-region
        >
          <Button
            variant='ghost'
            className='hover:bg-transparent'
            onClick={() => setOpen(true)}
          >
            <Settings />
          </Button>
        </div>
      </div>
      <Drawer
        open={open}
        onOpenChange={setOpen}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>OpenAI Api Key</DrawerTitle>
          </DrawerHeader>

          <div className='mx-4'>
            <Input
              placeholder='Please input your openai api key'
              defaultValue={openAIApiKey}
              onChange={(e) => setOpenAIApiKey(e.target.value)}
            />
          </div>

          <DrawerFooter>
            <Button onClick={handleSave}>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
