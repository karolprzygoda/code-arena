import Header from "@/components/header/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className={"flex h-full w-full flex-col"}>{children}</main>
    </>
  );
}
