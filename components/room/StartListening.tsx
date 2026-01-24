"use client";

import { useState, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { audioEnabledAtom } from "@/atoms/atoms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export default function RoomClientLayout({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  const enableAudio = useAtomValue(audioEnabledAtom);
  const setEnableAudio = useSetAtom(audioEnabledAtom);

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => {
        setProgress((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const handleStartListening = () => {
    setEnableAudio(true);
  };

  if (!enableAudio) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Card className="w-120 bg-zinc-900 border-zinc-800">
          <CardHeader className="text-center space-y-3 pb-6">
            {progress < 100 ? (
              <>
                <div className="mx-auto w-16 h-16 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-zinc-700 border-t-white animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{progress}%</span>
                  </div>
                </div>
                <CardTitle className="text-white text-xl">Synq calibrating</CardTitle>
                <CardDescription className="text-zinc-400 text-sm">Synchronizing time...</CardDescription>
              </>
            ) : (
              <>
                <div className="mx-auto w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <CardTitle className="text-white text-xl">Synchronization Complete</CardTitle>
                <CardDescription className="text-zinc-400 text-sm">Your device is now synchronized with this room.</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {progress < 100 ? (
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-30 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            ) : (
              <>
                <Button
                  onClick={handleStartListening}
                  className="w-full bg-white text-black hover:bg-zinc-200"
                >
                  Start System
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}