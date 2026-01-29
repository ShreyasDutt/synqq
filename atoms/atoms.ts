import { atom } from "jotai";

export enum RoomTab {
  CHAT = "CHAT",
  MUSIC = "MUSIC",
  SESSION = "SESSION",
}

export const displayNameAtom = atom<string>("");
export const roomCodeAtom = atom<number>();
export const createdRoomAtom = atom<boolean>(false);
export const roomTabAtom = atom<RoomTab>(RoomTab.MUSIC);

export const audioEnabledAtom = atom<boolean>(false);
export const currentSongTimeAtom = atom<number>(0);
export const currentSongStateAtom = atom<boolean>(false);