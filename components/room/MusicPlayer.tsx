"use client";
import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { useAtom, useSetAtom } from "jotai";
import {
  amIAdminAtom,
  CurrentPlayingSong,
  roomDataAtom,
} from "@/atoms/convexQueriesAtoms";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { currentSongTimeAtom, roomCodeAtom } from "@/atoms/atoms";
import AudioPlayer from "./AudioPlayer";
import formatTime from "@/lib/formatSongTime";
import { playNextSongAtom, playPreviousSongAtom } from "@/atoms/song";

const MusicPlayer = () => {
  const [roomCode] = useAtom(roomCodeAtom);
  if (!roomCode) {
    console.error("Room Code not found!!");
    return null;
  }
  const [roomData] = useAtom(roomDataAtom);
  const [amIAdmin] = useAtom(amIAdminAtom);
  const myPlayPermission =
    amIAdmin || roomData?.room.playbackPermissions === "everyone";
  const [currentPlayingSong] = useAtom(CurrentPlayingSong);
  const [currentSongTime ] = useAtom(currentSongTimeAtom);
  const setPlayNextSong = useSetAtom(playNextSongAtom);
  const setPlayPreviousSong = useSetAtom(playPreviousSongAtom);
  
  const changeVolume = useMutation(api.room.changeVolume);
  const changeSongStateMutation = useMutation(api.song.changeSongState);
  const updateCurrentSongProgress = useMutation(api.song.updateCurrentSongProgress);

  const changeSongState = () => {
    changeSongStateMutation({ roomCode });
  };
  return (
    <div className="w-full">
      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between px-8 gap-8">
        <div className="w-32"></div>

        <div className="flex-1 flex flex-col gap-3 max-w-2xl">
          <div className="flex items-center justify-center gap-6">
            <Shuffle
              className={`${!myPlayPermission ? "text-muted-foreground/70" : "text-neutral-400 hover:text-white cursor-pointer"} transition-colors`}
              size={17}
              onClick={() => {
                if (myPlayPermission) {
                }
              }}
            />
            <SkipBack
              className={`${!myPlayPermission ? "fill-muted-foreground/70 text-muted-foreground/70" : "fill-neutral-300 text-neutral-300 cursor-pointer hover:fill-white hover:text-white"} transition-colors`}
              onClick={() => {
                if (myPlayPermission) {
                  setPlayPreviousSong(true);
                }
              }}
            />
            {!roomData?.room.currentSongState ? (
              <div>
                <Play
                  onClick={() => {
                    if (myPlayPermission) changeSongState();
                  }}
                  className={`${!myPlayPermission ? "bg-muted-foreground/70 text-muted-foreground/70" : "bg-white fill-black cursor-pointer hover:scale-105"} rounded-full w-10 h-10 p-2 transition-transform`}
                  size={20}
                />
              </div>
            ) : (
              <div>
                <Pause
                  onClick={() => {
                    if (myPlayPermission) changeSongState();
                  }}
                  className={`${!myPlayPermission ? "bg-muted-foreground/70 text-muted-foreground/70" : "bg-white fill-black cursor-pointer hover:scale-105"} rounded-full w-10 h-10 p-2 transition-transform`}
                  size={20}
                />
              </div>
            )}

            <SkipForward
              className={`${!myPlayPermission ? "fill-muted-foreground/70 text-muted-foreground/70" : "fill-neutral-300 text-neutral-300 cursor-pointer hover:fill-white hover:text-white"} transition-colors`}
              onClick={() => {
                if (myPlayPermission) {
                  setPlayNextSong(true);
                }
              }}
            />
            <Repeat
              className={`${!myPlayPermission ? "text-muted-foreground/70" : "text-neutral-400 hover:text-white cursor-pointer"} transition-colors`}
              size={17}
              onClick={() => {
                if (myPlayPermission) {
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-400 gap-2">
            <p>{formatTime(currentSongTime) || "00:00"}</p>
            <input
              type="range"
              min="0"
              max={currentPlayingSong?.Duration || 0}
              className={`w-full accent-foreground hover:accent-primary
            [&::-webkit-slider-thumb]:opacity-0
             ${myPlayPermission && "hover:[&::-webkit-slider-thumb]:opacity-100"}`}
              value={currentSongTime || 0}
              onChange={(e) =>
                updateCurrentSongProgress({roomCode, currentSongProgress: Number(e.target.value) })
              }
              disabled={!myPlayPermission}
            />
            <p>{currentPlayingSong?.Duration}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-32">
          <Volume2 size={20} className="text-neutral-400" />
          <input
            type="range"
            min="0"
            max="100"
            className={`w-full accent-foreground hover:accent-primary
            [&::-webkit-slider-thumb]:opacity-0
             ${myPlayPermission && "hover:[&::-webkit-slider-thumb]:opacity-100"}`}
            value={roomData?.room.globalVolume ?? 75}
            onChange={(e) =>
              changeVolume({ roomCode, globalVolume: Number(e.target.value) })
            }
            disabled={!myPlayPermission}
          />
        </div>
      </div>
      <div className="">
        <AudioPlayer />
      </div>
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col gap-3">
        <div className="flex items-center justify-center gap-6">
          <Shuffle
            className={`${!myPlayPermission ? "text-muted-foreground/70" : "text-neutral-400"}`}
            size={17}
            onClick={() => {
              if (myPlayPermission) {
              }
            }}
          />
          <SkipBack
            className={`${!myPlayPermission ? "fill-muted-foreground/70 text-muted-foreground/70" : "fill-neutral-300 text-neutral-300"}`}
            onClick={() => {
              if (myPlayPermission) {
                setPlayPreviousSong(true);
              }
            }}
          />
          {!roomData?.room.currentSongState ? (
            <div>
              <Play
                onClick={() => {
                  if (myPlayPermission) changeSongState();
                }}
                className={`${!myPlayPermission ? "bg-muted-foreground/70 text-muted-foreground/70" : "bg-white fill-black"} rounded-full w-10 h-10 p-2 transition-transform`}
                size={20}
              />
            </div>
          ) : (
            <div>
              <Pause
                onClick={() => {
                  if (myPlayPermission) changeSongState();
                }}
                className={`${!myPlayPermission ? "bg-muted-foreground/70 text-muted-foreground/70" : "bg-white fill-black"} rounded-full w-10 h-10 p-2 transition-transform`}
                size={20}
              />
            </div>
          )}
          <SkipForward
            className={`${!myPlayPermission ? "fill-muted-foreground/70 text-muted-foreground/70" : "fill-neutral-300 text-neutral-300"}`}
            onClick={() => {
              if (myPlayPermission) {
                setPlayNextSong(true);
              }
            }}
          />
          <Repeat
            className={`${!myPlayPermission ? "text-muted-foreground/70" : "text-neutral-400"}`}
            size={17}
            onClick={() => {
              if (myPlayPermission) {
              }
            }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-neutral-400 px-3 gap-2">
          <p>{formatTime(currentSongTime)}</p>
          <input
            type="range"
            min="0"
            max={currentPlayingSong?.Duration || 100}
            className={`w-full accent-foreground hover:accent-primary
            [&::-webkit-slider-thumb]:opacity-0
             ${myPlayPermission && "hover:[&::-webkit-slider-thumb]:opacity-100"}`}
            value={currentSongTime || 0}
            // onChange={(e) =>

            // }i
            disabled={!myPlayPermission}
          />
          <p>{currentPlayingSong?.Duration || "00:00"}</p>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
