export default function ChallangeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className={"flex h-full w-full flex-col"}>{children}</main>
    </>
  );
}
