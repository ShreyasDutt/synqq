"use client";

import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { roomCodeAtom, audioEnabledAtom, currentSongTimeAtom, currentSongStateAtom } from "@/atoms/atoms";

export default function AudioPlayer() {
  const [roomCode] = useAtom(roomCodeAtom);
  const [audioEnabled] = useAtom(audioEnabledAtom);
  const [currentSongState,] = useAtom(currentSongStateAtom);
  const [, setCurrentSongTime] = useAtom(currentSongTimeAtom);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!roomCode) {
    console.error("Room Code not found!!");
    return null;
  }

  const roomData = useQuery(api.room.getRoomData, {
    roomCode: Number(roomCode),
  });

  const songUrl = roomData?.room.currentSong ?? null;
  const isPlaying = roomData?.room.currentSongState === true;
  const flipSongState = useMutation(api.song.FlipSongPlayState);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !songUrl || !audioEnabled) return; 

    if (audio.src !== songUrl) {
      audio.src = songUrl;
      audio.load();
    }

    if (isPlaying) {
      const playPromise = audio.play();
      console.log("Current Time : "+audio.currentTime)
      setCurrentSongTime(audio.currentTime);
      audio.currentTime = roomData?.room.currentSongProgress || 0;
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.log("Autoplay blocked");
        });
      }
    } else {
      audio.pause();
     console.log("Paused At : "+audio.currentTime)
    setCurrentSongTime(audio.currentTime);
        

    }
  }, [songUrl, isPlaying, audioEnabled]);


   const handlePlay = () => {
    const audio = audioRef.current!;
    flipSongState({
      roomCode,
      isPlaying: true,
      currentSongTime: audio.currentTime,
    });
  };

  const handlePause = () => {
    const audio = audioRef.current!;
    flipSongState({
      roomCode,
      isPlaying: false,
      currentSongTime: audio.currentTime,
    });
  };

  const handleSeeked = () => {
    const audio = audioRef.current!;
    flipSongState({
      roomCode,
      isPlaying,
      currentSongTime: audio.currentTime,
    });
    
  };

  return <audio ref={audioRef} 
    preload="auto" 
    controls  
    onPlay={handlePlay}
    onPause={handlePause}
    onSeeked={handleSeeked} />;
}