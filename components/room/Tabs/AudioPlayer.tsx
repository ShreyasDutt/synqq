"use client";

import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { roomCodeAtom, audioEnabledAtom } from "@/atoms/atoms";

export default function AudioPlayer() {
  const [roomCode] = useAtom(roomCodeAtom);
  const [audioEnabled] = useAtom(audioEnabledAtom);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const roomData = useQuery(api.room.getRoomData, {
    roomCode: Number(roomCode),
  });

  const songUrl = roomData?.room.currentSong ?? null;
  const isPlaying = roomData?.room.currentSongState === true;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !songUrl || !audioEnabled) return; 

    if (audio.src !== songUrl) {
      audio.src = songUrl;
      audio.load();
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.log("Autoplay blocked");
        });
      }
    } else {
      audio.pause();
    }
  }, [songUrl, isPlaying, audioEnabled]);

  return <audio ref={audioRef} preload="auto" hidden />;
}