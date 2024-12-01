import ResourcesPanelWrapper from "@/app/(root)/challange/[challangeName]/@resources/_components/resources-panel-wrapper";
import { ReactNode } from "react";

type ResourcesLayoutProps = {
  children: ReactNode;
  params: Promise<{ challangeName: string }>;
};

const ResourcesLayout = async ({ children, params }: ResourcesLayoutProps) => {
  return (
    <ResourcesPanelWrapper challangeName={(await params).challangeName}>
      {children}
    </ResourcesPanelWrapper>
  );
};

export default ResourcesLayout;
