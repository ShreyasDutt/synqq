import { Play, Repeat, Shuffle, SkipBack, SkipForward } from "lucide-react"
import { Progress } from "../ui/progress"

const MusicPlayer = () => {
  return (

    <div className="flex flex-col gap-3">
    <div className="flex items-center justify-center gap-6">
        <Shuffle className="text-neutral-400" size={17}/>
        <SkipBack className="fill-neutral-300 text-neutral-300"/>
        <Play className="bg-white fill-black rounded-full w-12 h-12 p-2" size={20} />
        <SkipForward className="fill-neutral-300 text-neutral-300" />
        <Repeat className="text-neutral-400" size={17}/>
    </div>

    <div className="flex items-center justify-between text-xs text-neutral-400 w-screen px-3 gap-2">
        <p>00:00</p>
        <Progress value={33} className={'w-full'} />
        <p>00:00</p>
    </div>
   
    </div>
   
  )
}

export default MusicPlayer
