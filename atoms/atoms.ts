import { atom } from "jotai";

export enum RoomTab{
    CHAT = "CHAT",
    MUSIC="MUSIC",
    SESSION="SESSION"
}



export const displayNameAtom = atom<string>("");
export const createdRoomAtom = atom<boolean>(false);
export const roomTabAtom = atom<RoomTab>(RoomTab.MUSIC);