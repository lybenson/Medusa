import SplitLayout from './components/layouts/split-layout'

export default function App() {
  console.log('App')

  return (
    <div className='flex flex-col h-screen'>
      <div
        id='drag-region'
        className='h-10 border-b w-full'
        style={
          {
            WebkitAppRegion: 'drag',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          } as React.CSSProperties
        }
      />
      <SplitLayout
        sidebar={<></>}
        detail={<></>}
      />
    </div>
  )
}
