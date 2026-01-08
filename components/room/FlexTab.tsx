import SessionTab from './Tabs/SessionTab'
import MusicTab from './Tabs/MusicTab'
import ChatTab from './Tabs/ChatTab'

const FlexTab = () => {
  return (
    <div className='flex flex-col h-full'>
      {/* Main content area - takes remaining space */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Larger display sidebar */}
        <div className="hidden lg:block w-78 lg:bg-neutral-900 overflow-y-auto">
          <SessionTab/>
        </div>
        
        {/* Tracks */}
        <div className='flex-1 px-7 overflow-y-auto'>
          <MusicTab/>
        </div>
        
        {/* Chat */}
        <div className='w-82 overflow-y-auto lg:border-l lg:px-1'>
          <ChatTab/>
        </div>
      </div>
    </div>
  )
}

export default FlexTab