import { ReactNode } from "react";
import Header from "@/app/(root)/_components/header/header";

type RootLayout = {
  children: Readonly<ReactNode>;
};

const RootLayout = ({ children }: RootLayout) => {
  return (
    <>
      <Header />
      <main className={"h-full w-full px-4 pb-4"}>{children}</main>
    </>
  );
};

export default RootLayout;
