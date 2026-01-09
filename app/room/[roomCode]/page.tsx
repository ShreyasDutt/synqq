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

import RoomHeroSection from "@/components/room/RoomHeroSection";
import JoinRoom from "@/components/room/JoinRoom";

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
      <JoinRoom recievedRoomCode={roomCode} />
      <TabNav/>
      <Roomsidebar />
      <RoomHeroSection />
    </div>
  )
}

export default page;
