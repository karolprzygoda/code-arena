import { ReactNode } from "react";

type ChallangePageLayoutProps = {
  children: ReactNode;
};

const ChallangePageLayout = ({ children }: ChallangePageLayoutProps) => {
  return <main className={"flex h-full w-full flex-col"}>{children}</main>;
};

export default ChallangePageLayout;
