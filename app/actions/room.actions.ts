"use server";

import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { redirect } from "next/navigation";

export const joinRoomAction = async (displayName: string) => {
    const roomCode = await fetchMutation(api.room.joinRoom, { displayName });
    if(!roomCode) return console.error("No room code found while running createRoomAction")
    console.log("roomcode from convex:" + roomCode)
    return redirect(`room/${roomCode}`)
};