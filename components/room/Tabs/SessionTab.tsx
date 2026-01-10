"use client"
import { displayNameAtom } from '@/atoms/atoms'
import { roomDataAtom } from '@/atoms/convexQueriesAtoms'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { countryCodeToEmoji } from '@/lib/generateName'
import { useAtom } from 'jotai'
import { Crown, Play, QrCode, Users, Volume2 } from 'lucide-react'

const users = [
  {
    id: "u1",
    name: "amiable-cat",
    isYou: true,
    isAdmin: true,
  },
  {
    id: "u2",
    name: "brave-otter",
    isYou: false,
    isAdmin: false,
  },
  {
    id: "u3",
    name: "curious-fox",
    isYou: false,
    isAdmin: false,
  },
]

const SessionTab = () => {
  const [roomData] = useAtom(roomDataAtom);
  const [displayName] = useAtom(displayNameAtom);
  console.log("roomData: ",roomData)
  return (
    <div>
      {/* Session Nav */}
      <div className="flex items-center justify-between px-4 py-3 lg:bg-neutral-900">
        <p># Room {roomData?.room.roomCode}</p>
        <Button variant="ghost" className="text-neutral-400">
          <QrCode /> QR
        </Button>
      </div>

      <Separator />

      {/* Playback Permissions */}
      <div className="px-4 py-4 flex flex-col gap-3 lg:bg-neutral-900">
        <div className="flex items-center gap-2 text-sm text-neutral-400 uppercase">
          <Play size={15} />
          <p>Playback permissions</p>
        </div>

        <ButtonGroup className="w-full flex lg:bg-neutral-900">
          <Button className="flex-1" variant="outline">
            <Users />
            Everyone
          </Button>
          <Button className="flex-1" variant="outline">
            <Crown />
            Admins
          </Button>
        </ButtonGroup>
      </div>

      <Separator />

      {/* Global Volume */}
      <div className="px-4 py-4 flex flex-col gap-3 lg:bg-neutral-900">
        <div className="flex items-center gap-2 text-sm text-neutral-400 uppercase">
          <Volume2 size={15} />
          <p>Global Volume</p>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={75} className="w-full" />
          <p className="text-xs text-neutral-400">75%</p>
        </div>
      </div>

      <Separator />

      {/* Connected Users */}
      <div className="px-4 py-4 flex flex-col gap-4 lg:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between text-sm text-neutral-400">
          <div className="flex items-center gap-2">
            <Users size={15} />
            <p className="uppercase">Connected Users</p>
          </div>
          <p className="px-2 border rounded-md">
            {roomData?.participants.length}
          </p>
        </div>

        {/* Users List */}
        <div className="flex flex-col">
          {roomData?.participants.map((participant) => (
            <div
              key={participant._id}
              className="flex items-center justify-between hover:bg-primary/20 py-3 px-2 cursor-pointer transition-colors duration-200 rounded-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-neutral-600 contain-content rounded-full text-[38px] flex items-center justify-center">
                  {countryCodeToEmoji(participant.country)}
                </div>
                <p className="text-sm">{participant.displayName}</p>
                {participant.role === "admin" && (
                  <Crown size={14} className="text-yellow-500" />
                )}
              </div>

              {participant.displayName === displayName && (
                <span className="text-xs bg-primary/30 px-2 py-0.5 rounded-xl">
                  You
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SessionTab
