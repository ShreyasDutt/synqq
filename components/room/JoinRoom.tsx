"use client";

import { joinRoomAction } from "@/app/actions/room.actions";
import { createdRoomAtom, displayNameAtom } from "@/atoms/atoms";
import { roomDataAtom } from "@/atoms/convexQueriesAtoms";
import { api } from "@/convex/_generated/api";
import { generateRandomName } from "@/lib/generateName";
import { useQuery } from "convex/react";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";

const JoinRoom = ({ recievedRoomCode }: { recievedRoomCode: string }) => {
  const roomCode = Number(recievedRoomCode);
  const [displayName, setDisplayName] = useAtom(displayNameAtom);
  const [createdRoom] = useAtom(createdRoomAtom);
  const setRoomData = useSetAtom(roomDataAtom);
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

  const roomData = useQuery(api.room.getRoomData, {
    roomCode,
  });

  useEffect(() => {
    if (roomData !== undefined) {
      setRoomData(roomData);
    }
  }, [roomData, setRoomData]);
  

  return null;
};

export default JoinRoom;
