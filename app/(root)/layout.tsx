export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-6xl w-full flex items-center justify-center mx-auto my-22">
      {children}
    </div>
  );
}
