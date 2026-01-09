"use server";

import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
type JoinRoom = {
    displayName: string
    roomCode?: number
}
type LeaveRoom = {
  displayName: string;
  roomCode: number;
};
export const joinRoomAction = async ({displayName, roomCode}: JoinRoom) => {
    const createdRoomCode = await fetchMutation(api.room.joinRoom, { displayName, roomCode });
    if (!createdRoomCode) return;
    return createdRoomCode;
};


export const leaveRoomAction = async ({ displayName, roomCode }: LeaveRoom) => {
    await fetchMutation(api.room.leaveRoom, {displayName, roomCode})
}