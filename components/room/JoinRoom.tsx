"use client";

import { joinRoomAction } from "@/app/actions/room.actions";
import { createdRoomAtom, displayNameAtom } from "@/atoms/atoms";
import { generateRandomName } from "@/lib/generateName";
import { useAtom } from "jotai";
import { useEffect } from "react";

const JoinRoom = ({ recievedRoomCode }: { recievedRoomCode: string }) => {
  const roomCode = Number(recievedRoomCode);
  const [displayName, setDisplayName] = useAtom(displayNameAtom);
  const [createdRoom] = useAtom(createdRoomAtom);
  const joinRoom = async () => {
    if (!createdRoom) {
      if (displayName === "") {
        const name = generateRandomName();
        setDisplayName(name);
        await joinRoomAction({ displayName: name, roomCode });
        return;
      } else {
        await joinRoomAction({ displayName, roomCode });
        return;
      }
    }
  };
 
  useEffect(() => {
    joinRoom();
  }, []);

  return <></>;
};

export default JoinRoom;
