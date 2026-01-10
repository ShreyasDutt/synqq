"use client";
import { roomDataAtom } from "@/atoms/convexQueriesAtoms";
import { useAtom } from "jotai";
import { Users } from "lucide-react";

const TabNavClient = () => {
  const [roomData] = useAtom(roomDataAtom);
  return (
    <>
      <span>#{roomData?.room.roomCode}</span>
      <div className="flex items-center gap-1">
        <Users size={14} />
        <span>{roomData?.participants.length} user</span>
      </div>
    </>
  );
};

export default TabNavClient;
