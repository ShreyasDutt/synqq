<<<<<<<< HEAD:components/room/Tabs/MusicTab.tsx
import { Button } from "@/components/ui/button"
import { Minus } from "lucide-react"

========
import { Minus } from "lucide-react";
import { Button } from "../ui/button";
>>>>>>>> dc69fed6c6c8bb9d60892eb867380ed2503f86fc:components/room/Tracks.tsx

const tracks = [
  { id: 1, title: "Save Your Tears", artist: "The Weeknd", duration: "3:35" },
  { id: 2, title: "Blinding Lights", artist: "The Weeknd", duration: "3:20" },
  { id: 3, title: "Starboy", artist: "The Weeknd", duration: "3:50" },
];

const MusicTab = () => {
  return (
  <>
    
    <div className="mt-10 space-y-2">
      {tracks.length === 0 && (
        <div className="flex flex-col gap-3 items-center justify-center">
          <p className="text-neutral-400">No tracks yet</p>
          <Button className="rounded-full text-xs px-4 py-2">
            Load default tracks
          </Button>
        </div>
      )}

      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="flex items-center px-4 py-3 rounded-md group transition-colors select-none text-neutral-300 hover:bg-neutral-800 cursor-pointer"
        >
          <p className="w-6 text-sm text-neutral-500">{index + 1}</p>

          <div className="flex-1 ml-4">
            <p className="text-sm">
              {track.artist} – {track.title}
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <p className="text-neutral-400">{track.duration}</p>
            <Button size="icon" variant="ghost">
              <Minus size={18} />
            </Button>
          </div>
        </div>
      ))}
    </div>
<<<<<<<< HEAD:components/room/Tabs/MusicTab.tsx
    

    </>
  )
}

export default MusicTab
========
  );
};

export default Tracks;
>>>>>>>> dc69fed6c6c8bb9d60892eb867380ed2503f86fc:components/room/Tracks.tsx
