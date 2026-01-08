import MusicPlayer from "@/components/home/MusicPlayer";
import TabNav from "@/components/home/Tabs/TabNav";
import Roomsidebar from "@/components/room/Roomsidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (  
            <div>
                <TabNav/>
                <Roomsidebar/>
                {children}
                <div className="fixed bottom-0 left-0 w-full flex justify-center py-5 bg-secondary/20 border-t">
                <MusicPlayer />
                </div>
            </div>
  );
}
