import { Button } from './components/ui/button'
import { Textarea } from './components/ui/textarea'

export default function App() {
  console.log('App')

  return (
    <>
      <div className='w-full min-h-screen flex items-center  flex-col p-2'>
        <Textarea placeholder='Type you want translate message' />

        <Button variant='default'>submit</Button>
      </div>
    </>
  )
}
