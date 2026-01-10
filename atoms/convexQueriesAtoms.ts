import { atom } from "jotai";

type Room = {
  _id: string;
  _creationTime: number;
  songsQueue?: string[];
  currentSong?: string;
  roomCode: number;
  createdAt: number;
  currentSongState: boolean;
  currentLoopState: string;
  currentSongProgress: number;
  playbackPermissions: "admins" | "everyone",
  globalVolume: number;
};

type RoomParticipant = {
  _id: string;
  _creationTime: number;
  displayName: string;
  roomId: string;
  role: string;
  joinedAt: number | null | undefined;
  country: string;
};

type RoomData = {
  room: Room;
  participants: RoomParticipant[] ;
};

export const roomDataAtom = atom<RoomData | undefined | null>();
