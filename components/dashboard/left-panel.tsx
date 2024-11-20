import { ResizablePanel } from "@/components/ui/resizable";
import PanelHeader from "@/components/dashboard/panel-header";
import ChallangeNavigator from "@/components/dashboard/challange-navigator";
import ChallangeGroupLink from "@/components/dashboard/challange-group-link";
import ChallangeTabs from "@/components/dashboard/challange-tabs";
import PanelWrapper from "@/components/dashboard/panel-wrapper";

const LeftPanel = () => {
  return (
    <ResizablePanel minSize={25} maxSize={65} defaultSize={50}>
      <PanelWrapper>
        <PanelHeader>
          <ChallangeGroupLink href={"/"} name={"Challenges Group Name"} />
          <ChallangeNavigator variant={"prev"} href={"/"} />
          <ChallangeNavigator variant={"next"} href={"/"} />
        </PanelHeader>
        <ChallangeTabs />
      </PanelWrapper>
    </ResizablePanel>
  );
};

export default LeftPanel;
