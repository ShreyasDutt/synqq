"use client";
import {
  Library,
  ListMusic,
  MessageCircleMore,
  Play,
  QrCode,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { useSetAtom } from "jotai";
import { RoomTab, roomTabAtom } from "@/atoms/atoms";

const Roomsidebar = () => {
  const setRoomTab = useSetAtom(roomTabAtom);
  return (
    <div>
      <div>
        <div className="flex w-full">
          <Button
            variant="mobileNav"
            className="flex-1 rounded-none"
            onClick={() => {
              setRoomTab(RoomTab.SESSION);
            }}
          >
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

          <Button
            variant="mobileNav"
            className="flex-1 rounded-none"
            onClick={() => {
              setRoomTab(RoomTab.CHAT);
            }}
          >
            <MessageCircleMore />
            <p>Chat</p>
          </Button>
        </div>
      </div>

      {/* larger display sidebar */}
      <div className="px-3 hidden">
        <div className="flex items-center justify-between py-2 border-b">
          <p># Room 1111</p>
          <Button variant={"ghost"}>
            <QrCode />
          </Button>
        </div>
        <div className="flex items-center justify-between py-2 border-b">
          <p className="flex items-center gap-3">
            <Play /> Playback permissions
          </p>
          <Button>Everyone</Button>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users />
              <p>Connected Users</p>
            </div>

            <p className="p-1 border">3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roomsidebar;
