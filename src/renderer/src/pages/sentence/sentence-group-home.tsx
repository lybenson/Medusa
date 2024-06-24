import {
  deleteSentenceGroup,
  insertSentenceGroup,
  updateSentenceGroup
} from '@renderer/database/sentence-group'
import { useEffect, useState } from 'react'
import SentenceList from './sentence-list'
import { Ellipsis, Plus } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { useToggle } from '@uidotdev/usehooks'
import { SentenceGroupsReturn, SentenceGroupsTable } from '@schema'
import { eq } from 'drizzle-orm'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle
} from '@renderer/components/ui/alert-dialog'
import { useGlobalStore } from '@renderer/store'

export default function SentenceGroupHome() {
  const groups = useGlobalStore((state) => state.groups)
  const requestGroups = useGlobalStore((state) => state.requestGroups)

  const [dialogMode, setDialogMode] = useState<'edit' | 'add'>('edit')
  const [editGroup, setEditGroup] = useState<SentenceGroupsReturn>()
  const [groupDialog, toggleGroupDialogOpen] = useToggle()
  const [deleteConfimDialog, toggleDeleteConfimDialog] = useToggle()
  const [inputGroupName, setInputGroupName] = useState('')

  const selectedGroup = useGlobalStore((state) => state.selectedGroup)
  const onSelectedGroup = useGlobalStore((state) => state.onSelectedGroup)

  useEffect(() => {
    if (groups && !selectedGroup) {
      onSelectedGroup(groups[0])
    }
  }, [groups])

  const handleSaveSentenceGroup = async () => {
    if (dialogMode === 'edit' && editGroup) {
      await updateSentenceGroup(
        {
          ...editGroup,
          name: inputGroupName
        },
        eq(SentenceGroupsTable.id, editGroup?.id)
      )
      requestGroups()
      toggleGroupDialogOpen(false)
    } else {
      await insertSentenceGroup({
        name: inputGroupName
      })
      requestGroups()
      toggleGroupDialogOpen(false)
    }
  }
  return (
    <div className='flex h-full p-1'>
      <div className='max-w-40 flex flex-col gap-y-1 max-h-full overflow-scroll'>
        {groups?.map((group) => (
          <Button
            key={group.id}
            className={`${group.id === selectedGroup?.id ? 'text-neutral-700 bg-neutral-200' : ''} px-2 min-h-10 flex items-center cursor-pointer justify-between rounded-md max-w-full`}
            onClick={() => onSelectedGroup(group)}
            variant={'ghost'}
          >
            <span className='truncate mr-2'> {group.name}</span>
            <div className='shrink-0'>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className='focus-visible:outline-none focus-visible:shadow-none'
                  asChild
                >
                  <Button
                    variant='ghost'
                    className='p-0.5 hover:bg-neutral-400 h-54 focus-visible:outline-none focus-visible:shadow-none'
                    asChild
                  >
                    <Ellipsis size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Button
                      variant='ghost'
                      className='p-0.5 h-fit'
                      onClick={() => {
                        setDialogMode('edit')
                        setEditGroup(group)
                        toggleGroupDialogOpen(true)
                      }}
                    >
                      Rename
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      variant='ghost'
                      className='p-0.5 h-fit'
                      onClick={() => {
                        toggleDeleteConfimDialog(true)
                      }}
                    >
                      Delete
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Button>
        ))}

        <Button
          className='flex items-center cursor-pointer text-neutral-700 justify-center w-full'
          variant='ghost'
          onClick={() => {
            setDialogMode('add')
            toggleGroupDialogOpen(true)
          }}
        >
          <Plus
            size={16}
            className='mr-2'
          />
          <span className='text-sm'>New Group</span>
        </Button>
      </div>
      <div className='flex-1 max-h-full first-line:overflow-scroll px-4'>
        <SentenceList group={selectedGroup} />
      </div>

      <Dialog
        open={groupDialog}
        onOpenChange={toggleGroupDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'edit' ? 'Edit Group Name' : 'Add Group'}
            </DialogTitle>
          </DialogHeader>
          <div className='mt-2'>
            <Input
              defaultValue={dialogMode === 'edit' ? editGroup?.name : ''}
              onChange={(e) => setInputGroupName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type='submit'
              onClick={() => handleSaveSentenceGroup()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteConfimDialog}
        onOpenChange={toggleDeleteConfimDialog}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteSentenceGroup(
                  selectedGroup && eq(SentenceGroupsTable.id, selectedGroup.id)
                )
                toggleDeleteConfimDialog(false)
                requestGroups()
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
