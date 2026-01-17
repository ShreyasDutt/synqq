"use client";

import { joinRoomAction } from "@/app/actions/room.actions";
import { createdRoomAtom, displayNameAtom, roomCodeAtom } from "@/atoms/atoms";
import { roomDataAtom } from "@/atoms/convexQueriesAtoms";
import { api } from "@/convex/_generated/api";
import { generateRandomName } from "@/lib/generateName";
import { useMutation, useQuery } from "convex/react";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";

const JoinRoom = ({ recievedRoomCode }: { recievedRoomCode: string }) => {
  const setRoomCode = useSetAtom(roomCodeAtom);
  const roomCode = Number(recievedRoomCode);
  setRoomCode(roomCode);
  const [displayName, setDisplayName] = useAtom(displayNameAtom);
  const [createdRoom] = useAtom(createdRoomAtom);
  const setRoomData = useSetAtom(roomDataAtom);
  const updateLastSeen = useMutation(api.room.UpdateLastSeen);
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

useEffect(() => {

  const id = setInterval(() => {
    updateLastSeen({ roomCode, displayName });
  }, 10_000);

  return () => clearInterval(id);
}, [roomCode, displayName, updateLastSeen]);

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
