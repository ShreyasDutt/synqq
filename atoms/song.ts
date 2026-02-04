import { atom } from "jotai";

export const uploadingAudioAtom = atom<boolean>(false);
export const playNextSongAtom = atom<boolean>(false);
export const playPreviousSongAtom = atom<boolean>(false);
export const songEndsAtom = atom<boolean>(false);