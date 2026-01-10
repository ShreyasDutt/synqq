"use client";
import {
  Library,
  ListMusic,
  MessageCircleMore,
} from "lucide-react";
import { Button } from "../ui/button";
import { useSetAtom } from "jotai";
import { RoomTab, roomTabAtom } from "@/atoms/atoms";

const Roomsidebar = () => {
  const setRoomTab = useSetAtom(roomTabAtom);
  return (
    <div>
        <div className="lg:hidden">
            <div className="flex w-full">
                <Button variant="mobileNav" className="flex-1 rounded-none" onClick={()=>{
                    setRoomTab(RoomTab.SESSION);
                }}>
                    <Library />
                    <p>Session</p>
                </Button>

          <Button
            variant="mobileNav"
            className="flex-1 rounded-none"
            onClick={() => {
              setRoomTab(RoomTab.MUSIC);
            }}
          >
            <ListMusic />
            <p>Music</p>
          </Button>

                <Button variant="mobileNav" className="flex-1 rounded-none" onClick={()=>{
                    setRoomTab(RoomTab.CHAT)
                }}>
                    <MessageCircleMore />
                    <p>Chat</p>
                </Button>
            </div>
        </div>

    </div>
  );
};

export default Roomsidebar;
