import Header from "@/components/header/header";
import { ReactNode } from "react";

type RootLayout = {
  children: Readonly<ReactNode>;
};

const RootLayout = ({ children }: RootLayout) => {
  return (
    <>
      <Header />
      <main className={"flex h-full w-full flex-col overflow-hidden"}>
        {children}
      </main>
    </>
  );
};

export default RootLayout;
