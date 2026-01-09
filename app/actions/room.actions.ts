"use server";

import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { redirect } from "next/navigation";
type JoinRoom = {
    displayName: string
    roomCode?: number
}
export const joinRoomAction = async ({displayName, roomCode}: JoinRoom) => {
    const createdRoomCode = await fetchMutation(api.room.joinRoom, { displayName, roomCode });
    if (!createdRoomCode) return;
    console.log("roomcode from convex:" + createdRoomCode);
    redirect(`room/${createdRoomCode}`);
};