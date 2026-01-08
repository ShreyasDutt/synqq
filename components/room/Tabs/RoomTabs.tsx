"use client";

import { RoomTab, roomTabAtom } from "@/atoms/atoms";
import { useAtom } from "jotai";
import MusicTab from "./MusicTab";
import SessionTab from "./SessionTab";
import ChatTab from "./ChatTab";

const RoomTabs = () => {
  const [roomTab] = useAtom(roomTabAtom);
  console.log(roomTab);
  return (
    <div>
      {roomTab === RoomTab.MUSIC && <MusicTab />}
      {roomTab === RoomTab.SESSION && <SessionTab />}
      {roomTab === RoomTab.CHAT && <ChatTab />}
    </div>
  );
};

export default RoomTabs;
