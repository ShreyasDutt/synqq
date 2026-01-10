'use client'
import { RoomTab, roomTabAtom } from "@/atoms/atoms"
import { useAtom } from "jotai"
import MusicTab from "./Tabs/MusicTab";
import SessionTab from "./Tabs/SessionTab";
import ChatTab from "./Tabs/ChatTab";
import FlexTab from "./FlexTab";

const RoomTabs = () => {
    const [roomTab] = useAtom(roomTabAtom);
  return (
    <>
    <div className="lg:hidden h-full">
        {roomTab===RoomTab.MUSIC && (<MusicTab/>)}
        {roomTab===RoomTab.SESSION && (<SessionTab/>)}
        {roomTab===RoomTab.CHAT && (<ChatTab/>)}
    </div>
      <div className="hidden lg:block h-full">
        <FlexTab />
      </div>
    </>
  )
}

export default RoomTabs