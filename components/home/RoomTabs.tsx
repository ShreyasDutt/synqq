'use client'

import { RoomTab, roomTabAtom } from "@/atoms/atoms"
import { useAtom } from "jotai"
import MusicTab from "./Tabs/MusicTab";
import SessionTab from "./Tabs/SessionTab";
import ChatTab from "./Tabs/ChatTab";

const RoomTabs = () => {
    const [roomTab] = useAtom(roomTabAtom);
    console.log(roomTab)
  return (
    <div>
        {roomTab===RoomTab.MUSIC && (<MusicTab/>)}
        {roomTab===RoomTab.SESSION && (<SessionTab/>)}
        {roomTab===RoomTab.CHAT && (<ChatTab/>)}

    </div>
  )
}

export default RoomTabs