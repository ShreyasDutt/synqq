"use server";
import { headers } from "next/headers";

;

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
    const h = await headers();

    const country = h.get("x-vercel-ip-country");
    const region = h.get("x-vercel-ip-country-region");
    const city = h.get("x-vercel-ip-city");
    console.log(country,region,city,"Location Data")
    const createdRoomCode = await fetchMutation(api.room.joinRoom, { displayName, roomCode });
    if (!createdRoomCode) return;
    return createdRoomCode;
};


export const leaveRoomAction = async ({ displayName, roomCode }: LeaveRoom) => {
    await fetchMutation(api.room.leaveRoom, {displayName, roomCode})
}