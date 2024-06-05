import { Button } from './components/ui/button'
import Versions from './components/Versions'

export default function App() {
  console.log('App')

  return (
    <>
      <div className="text-red-500 font-medium text-5xl md:text-stone-400">213213</div>
      <Versions></Versions>
      <Button variant="destructive">asdww</Button>
    </>
  )
}
