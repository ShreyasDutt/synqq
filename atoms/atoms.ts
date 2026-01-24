import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

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
