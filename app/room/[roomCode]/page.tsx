import MusicPlayer from "@/components/room/MusicPlayer";
import RoomTabs from "@/components/room/RoomTabs";
import TabNav from "@/components/room/Tabs/TabNav";
import Roomsidebar from "@/components/room/Roomsidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AlertCircle } from "lucide-react";

type Props={
  params: {
    roomCode: string
  }
}

const page = async ({ params }: Props) => {
  const { roomCode } = await params;

  if (!roomCode || !/^\d{6}$/.test(roomCode)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <CardTitle className="text-foreground">Invalid Room Code</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription className="text-muted-foreground">
              Room code should be a 6 digit number
            </CardDescription>
          </CardContent>
        </Card>

      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TabNav/>
      <Roomsidebar/>
      <div className="flex-1 overflow-hidden">
        <RoomTabs/>
      </div>
      <div className="left-0 w-full flex justify-center lg:py-3 py-5 bg-neutral-900/10 border-t">
        <MusicPlayer />
      </div>
    </div>
  )
}

export default page;
