import { Play, QrCode, Users } from "lucide-react"
import { Button } from "../ui/button"

const Roomsidebar = () => {
  return (
    <div className="px-3">
        <div className="flex items-center justify-between py-2 border-b">
            <p># Room 1111</p>
            <Button variant={'ghost'}><QrCode/></Button>
        </div>
        <div className="flex items-center justify-between py-2 border-b">
            <p className="flex items-center gap-3"><Play/> Playback permissions</p>
            <Button>Everyone</Button>
        </div>

        <div >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <Users/>
                <p>Connected Users</p>
                </div>
                
                <p className="p-1 border">3</p>
            </div>
        </div>

    </div>
  )
}

export default Roomsidebar