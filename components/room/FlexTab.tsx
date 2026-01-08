import SessionTab from './Tabs/SessionTab'
import MusicTab from './Tabs/MusicTab'
import ChatTab from './Tabs/ChatTab'
import { Play, Repeat, Shuffle, SkipBack, SkipForward } from "lucide-react"
import { Progress } from "../ui/progress"

const FlexTab = () => {
  return (
    <div className='flex flex-col h-full'>
      {/* Main content area - takes remaining space */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Larger display sidebar */}
        <div className="hidden lg:block w-82 lg:bg-neutral-900 overflow-y-auto">
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
      
      {/* Music Player - fixed at bottom */}
      {/* <div className="bg-neutral-900 border-t border-neutral-800 py-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-6">
            <Shuffle className="text-neutral-400 cursor-pointer hover:text-white transition-colors" size={17}/>
            <SkipBack className="fill-neutral-300 text-neutral-300 cursor-pointer hover:fill-white hover:text-white transition-colors"/>
            <Play className="bg-white fill-black rounded-full w-12 h-12 p-2 cursor-pointer hover:scale-105 transition-transform" size={20} />
            <SkipForward className="fill-neutral-300 text-neutral-300 cursor-pointer hover:fill-white hover:text-white transition-colors" />
            <Repeat className="text-neutral-400 cursor-pointer hover:text-white transition-colors" size={17}/>
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-400 px-8 gap-2">
            <p>00:00</p>
            <Progress value={33} className={'w-full'} />
            <p>00:00</p>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default FlexTab