import { ReactNode } from "react";
import DashBoardWrapper from "@/components/dashboard/dashboard-wrapper";
import { ResizableHandle } from "@/components/ui/resizable";
import type { Metadata } from "next";

type ChallangeLayoutProps = {
  editor: ReactNode;
  resources: ReactNode;
  params: Promise<{ challangeName: string }>;
};

export async function generateMetadata({
  params,
}: ChallangeLayoutProps): Promise<Metadata> {
  const name = (await params).challangeName;

  return {
    title: `${name} - CodeArena`,
  };
}

const ChallangeLayout = ({ editor, resources }: ChallangeLayoutProps) => {
  return (
    <DashBoardWrapper>
      {resources}
      <ResizableHandle
        className={"group order-2 bg-background p-2"}
        withHandle
      />
      {editor}
    </DashBoardWrapper>
  );
};

export default ChallangeLayout;
