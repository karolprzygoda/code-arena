import { ReactNode } from "react";
import DashBoardWrapper from "@/app/(root)/challange/_components/dashboard-wrapper";
import { ResizableHandle } from "@/components/ui/resizable";
import type { Metadata } from "next";

type DashBoardLayoutProps = {
  editor: ReactNode;
  resources: ReactNode;
  params: Promise<{ challangeName: string }>;
};

export const generateMetadata = async ({
  params,
}: DashBoardLayoutProps): Promise<Metadata> => {
  const name = (await params).challangeName;

  return {
    title: `${name} - CodeArena`,
  };
};

const DashBoardLayout = ({ editor, resources }: DashBoardLayoutProps) => {
  return (
    <DashBoardWrapper>
      {resources}
      <ResizableHandle
        className={"group order-2 bg-background p-2"}
        withCustomHandle
      />
      {editor}
    </DashBoardWrapper>
  );
};

export default DashBoardLayout;
