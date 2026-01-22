import { Id } from "@/convex/_generated/dataModel";
import { atom } from "jotai";

type Room = {
  _id: Id<"room">;
  _creationTime: number;
  songsQueue?: string[];
  currentSong?: string;
  roomCode: number;
  createdAt: number;
  currentSongState: boolean;
  currentLoopState: string;
  currentSongProgress: number;
  playbackPermissions: string,
  globalVolume: number;
};

type RoomParticipant = {
  _id: Id<"participant">;
  _creationTime: number;
  displayName: string;
  roomId: Id<"room">;
  role: string;
  joinedAt: number | null | undefined;
  country: string;
};

type RoomData = {
  room: Room;
  participants: RoomParticipant[] ;
};

export const roomDataAtom = atom<RoomData | undefined | null>();

export const amIAdminAtom = atom<boolean>(false);
