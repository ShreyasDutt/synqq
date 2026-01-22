"use client";
import { useQRCode} from "next-qrcode";
import {
  adminsPermissionAction,
  everyonePermissionAction,
} from "@/app/actions/room.actions";
import { displayNameAtom, roomCodeAtom } from "@/atoms/atoms";
import { amIAdminAtom, roomDataAtom } from "@/atoms/convexQueriesAtoms";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { countryCodeToEmoji } from "@/lib/generateName";
import { useMutation } from "convex/react";
import { useAtom } from "jotai";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  Copy,
  Crown,
  EllipsisVertical,
  Play,
  Plus,
  QrCode,
  Upload,
  Users,
  Volume2,
} from "lucide-react";
import { parseBlob } from "music-metadata";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SessionTab = () => {
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
  const MAX_DURATION = 10 * 60; // 10 minutes in seconds

  const { Canvas } = useQRCode();
  const [roomCode] = useAtom(roomCodeAtom);
  if (!roomCode) {
    console.error("Room code not found!!");
    return null;
  }
  const roomUrl = `${process.env.NEXT_PUBLIC_APP_URL}/room/${roomCode}`;

  const switchPlaybackPermission = () => {
    if (roomData?.room.playbackPermissions === "admins") {
      everyonePermissionAction({ roomCode });
    } else {
      adminsPermissionAction({ roomCode });
    }
  }
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const changeVolume = useMutation(api.room.changeVolume);
  const [roomData] = useAtom(roomDataAtom);
  const [displayName] = useAtom(displayNameAtom);

  const [amIAdmin, setAmIAdmin] = useAtom(amIAdminAtom);
  useEffect(() => {
    const check =
      roomData?.participants.find((p) => p.displayName === displayName)
        ?.role === "admin";

    setAmIAdmin(!!check);
  }, [roomData?.participants, displayName]);

  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const generateUploadUrlMutation = useMutation(api.song.generateUploadUrl);
  const uploadSongMutation = useMutation(api.song.uploadSong);
  const makeAdminMutation = useMutation(api.room.makeAdmin);
  const removeAdminMutation = useMutation(api.room.removeAdmin);

const uploadSong = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const input = e.currentTarget;
  const file = input.files?.[0];

  const reset = () => {
    input.value = "";
  };

  if (!file) {
    reset();
    return;
  }

  if (!file.type.startsWith("audio/")) {
    toast.warning("Only audio files are allowed");
    reset();
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.warning("File size must be 50MB or less");
    reset();
    return;
  }

  setUploading(true);

  try {
    const metadata = await parseBlob(file);
    const duration = metadata.format.duration;

    if (!duration) {
      toast.warning("Duration not found");
      return;
    }

    if (duration > MAX_DURATION) {
      toast.warning("Audio must be 10 minutes or less");
      return;
    }

    const postUrl = await generateUploadUrlMutation();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    const { storageId } = await result.json();

    await uploadSongMutation({
      duration,
      roomCode,
      storageId,
      title: file.name,
    });
  } catch (err) {
    console.error(err);
    toast.error("Upload failed");
  } finally {
    setUploading(false);
    reset(); // <-- important
  }
};



  return (
    <div className="flex flex-col h-full">
      {/* Session Nav */}
      <div className="flex items-center justify-between px-4 py-3 lg:bg-neutral-900">
        <p># Room {roomData?.room.roomCode}</p>
        <Dialog>
          <DialogTrigger>
            <Button variant="ghost" className="text-neutral-400">
              <span className="flex justify-center items-center gap-2">
                <QrCode /> QR
              </span>
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>
                Anyone who has this link will be able to join this room.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center">
              <Canvas text={roomUrl} options={{ width: 250, margin: 1 }} />
            </div>
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input id="link" value={roomUrl} readOnly />
              </div>

              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                aria-label="Copy link"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {/* Playback Permissions */}
      <div className="px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-neutral-400 uppercase">
          <Play size={15} />
          <p>Playback permissions</p>
        </div>

        <ButtonGroup className="w-full flex">
          <Button
            className="flex-1"
            variant={
              roomData?.room.playbackPermissions === "everyone"
                ? "default"
                : "outline"
            }
            disabled={!amIAdmin}
            onClick={switchPlaybackPermission}
          >
            <Users className="mr-2" />
            Everyone
          </Button>

          <Button
            className="flex-1"
            variant={
              roomData?.room.playbackPermissions === "admins"
                ? "default"
                : "outline"
            }
            disabled={!amIAdmin}
            onClick={switchPlaybackPermission}
          >
            <Crown className="mr-2" />
            Admins
          </Button>
        </ButtonGroup>
      </div>

      <Separator />

      {/* Global Volume */}
      <div className="px-4 py-4 flex flex-col gap-3 lg:bg-neutral-900 lg:hidden">
        <div className="flex items-center gap-2 text-sm text-neutral-400 uppercase">
          <Volume2 size={15} />
          <p>Global Volume</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            className={`w-full accent-foreground hover:accent-primary
            [&::-webkit-slider-thumb]:opacity-0
             ${(amIAdmin || roomData?.room.playbackPermissions === "everyone") && "hover:[&::-webkit-slider-thumb]:opacity-100"}`}
            value={roomData?.room.globalVolume ?? 75}
            onChange={(e) =>
              changeVolume({ roomCode, globalVolume: Number(e.target.value) })
            }
            disabled={
              !amIAdmin && !(roomData?.room.playbackPermissions === "everyone")
            }
          />

          <p className="text-xs text-neutral-400">
            {roomData?.room.globalVolume}%
          </p>
        </div>
      </div>

      <Separator className="lg:hidden" />

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
              className="relative flex items-center justify-between hover:bg-primary/20 py-3 px-2 cursor-pointer transition-colors duration-200 rounded-md"
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
              <div className="flex justify-center items-center gap-2">
                {participant.displayName === displayName && (
                  <span className="text-sm bg-primary/30 px-2 py-0.5 rounded-xl">
                    You
                  </span>
                )}
                {amIAdmin && !(participant.displayName === displayName) && (
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical size={20} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <div>
                          {participant.role === "admin" ? (
                            <Button
                              variant="destructive"
                              className="text-xs"
                              onClick={() =>
                                removeAdminMutation({
                                  participantId: participant._id,
                                })
                              }
                            >
                              <Crown />
                              Remove Admin
                            </Button>
                          ) : (
                            <Button
                              className="text-xs"
                              onClick={() =>
                                makeAdminMutation({
                                  participantId: participant._id,
                                })
                              }
                            >
                              <Crown />
                              Make Admin
                            </Button>
                          )}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <label
        className={`flex items-center gap-3 py-2 px-3 border rounded-lg m-3 mt-auto ${(amIAdmin || roomData?.room.playbackPermissions === "everyone") && "hover:bg-muted-foreground/10 cursor-pointer "}`}
      >
        <input
          type="file"
          className="hidden"
          accept="audio/*"
          onChange={uploadSong}
          disabled={
            (!amIAdmin &&
              !(roomData?.room.playbackPermissions === "everyone")) ||
            uploading
          }
        />
        {uploading ? (
          <>
            <>
              <div className="bg-primary p-2 rounded-lg">
                <Upload size={20} />
              </div>
              <div className="text-foreground text-md">Uploading...</div>
            </>
          </>
        ) : (
          <>
            <div
              className={` p-2 rounded-lg ${!amIAdmin && !(roomData?.room.playbackPermissions === "everyone") ? "bg-gray-600/50" : "bg-primary"}`}
            >
              <Plus size={20} />
            </div>
            <div>
              <div
                className={`text-sm ${!amIAdmin && !(roomData?.room.playbackPermissions === "everyone") ? "text-muted-foreground" : "text-foreground"}`}
              >
                Upload audio
              </div>
              <div className="text-muted-foreground text-[12px]">
                Add music to queue
              </div>
            </div>
          </>
        )}
      </label>
    </div>
  );
};

export default SessionTab;
