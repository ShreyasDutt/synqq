"use client";
import {
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { Progress } from "../ui/progress";
import { useAtom } from "jotai";
import { roomDataAtom } from "@/atoms/convexQueriesAtoms";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { roomCodeAtom } from "@/atoms/atoms";

const MusicPlayer = () => {
  const [roomData] = useAtom(roomDataAtom);
  const [roomCode] = useAtom(roomCodeAtom);
  if (!roomCode) {
    console.error("Room Code not found!!");
    return null;
  }
  const changeVolume = useMutation(api.room.changeVolume);
  return (
    <div className="w-full">
      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between px-8 gap-8">
        <div className="w-32"></div>

        <div className="flex-1 flex flex-col gap-3 max-w-2xl">
          <div className="flex items-center justify-center gap-6">
            <Shuffle
              className="text-neutral-400 cursor-pointer hover:text-white transition-colors"
              size={17}
            />
            <SkipBack className="fill-neutral-300 text-neutral-300 cursor-pointer hover:fill-white hover:text-white transition-colors" />
            <Play
              className="bg-white fill-black rounded-full w-10 h-10 p-2 cursor-pointer hover:scale-105 transition-transform"
              size={20}
            />
            <SkipForward className="fill-neutral-300 text-neutral-300 cursor-pointer hover:fill-white hover:text-white transition-colors" />
            <Repeat
              className="text-neutral-400 cursor-pointer hover:text-white transition-colors"
              size={17}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-400 gap-2">
            <p>00:00</p>
            <Progress
              value={roomData?.room.currentSongProgress || null}
              className="w-full"
            />
            <p>03:45</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-32">
          <Volume2 size={20} className="text-neutral-400" />
          <input
            type="range"
            min="0"
            max="100"
            className="w-full accent-foreground hover:accent-primary
            [&::-webkit-slider-thumb]:opacity-0
            hover:[&::-webkit-slider-thumb]:opacity-100"
            value={roomData?.room.globalVolume ?? 75}
            onChange={(e) =>
              changeVolume({ roomCode, globalVolume: Number(e.target.value) })
            }
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col gap-3">
        <div className="flex items-center justify-center gap-6">
          <Shuffle className="text-neutral-400" size={17} />
          <SkipBack className="fill-neutral-300 text-neutral-300" />
          <Play
            className="bg-white fill-black rounded-full w-12 h-12 p-2"
            size={20}
          />
          <SkipForward className="fill-neutral-300 text-neutral-300" />
          <Repeat className="text-neutral-400" size={17} />
        </div>
        <div className="flex items-center justify-between text-xs text-neutral-400 px-3 gap-2">
          <p>00:00</p>
          <Progress
            value={roomData?.room.currentSongProgress || null}
            className="w-full"
          />
          <p>03:45</p>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
