import { atom } from "jotai";

export const displayNameAtom = atom<string>("");

export const createdRoomAtom = atom<boolean>(false);