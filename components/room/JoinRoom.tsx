"use client";

import { joinRoomAction, leaveRoomAction } from "@/app/actions/room.actions";
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
  const leaveRoom = async () => {
    await leaveRoomAction({ displayName, roomCode });
  };
  useEffect(() => {
    joinRoom();
    return () => {
      leaveRoom();
    };
  }, []);

  return <></>;
};

export default JoinRoom;
