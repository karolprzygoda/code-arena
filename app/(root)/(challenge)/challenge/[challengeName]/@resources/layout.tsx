import { ReactNode } from "react";
import ResourcesWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/resources-wrapper";

type ResourcesLayoutProps = {
  children: ReactNode;
  params: Promise<{ challengeName: string }>;
};

const ResourcesLayout = async ({ children, params }: ResourcesLayoutProps) => {
  return (
    <ResourcesWrapper challengeName={(await params).challengeName}>
      {children}
    </ResourcesWrapper>
  );
};

export default ResourcesLayout;
