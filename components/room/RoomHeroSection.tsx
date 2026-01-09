"use client"
import MusicPlayer from "@/components/room/MusicPlayer";
import RoomTabs from "@/components/room/RoomTabs";

const RoomHeroSection = () => {
  return (
      <>
      <div className="flex-1 overflow-hidden">
        <RoomTabs />
      </div>
      <div className="left-0 w-full flex justify-center lg:py-3 py-5 bg-neutral-900/10 border-t">
        <MusicPlayer />
      </div>
    </>
  );
};

export default RoomHeroSection;
