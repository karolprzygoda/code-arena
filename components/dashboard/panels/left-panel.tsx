import { ResizablePanel } from "@/components/ui/resizable";
import PanelHeader from "@/components/dashboard/panels/panel-header";
import ChallangeNavigator from "@/components/dashboard/buttons/challange-navigator";
import ChallangeGroupLink from "@/components/dashboard/buttons/challange-group-link";
import ChallangeTabs from "@/components/dashboard/challange-tabs";
import PanelWrapper from "@/components/dashboard/panels/panel-wrapper";

const LeftPanel = () => {
  return (
    <ResizablePanel minSize={25} maxSize={65} defaultSize={50}>
      <PanelWrapper>
        <PanelHeader>
          <ChallangeGroupLink href={"/"} name={"Challenges Group Name"} />
          <ChallangeNavigator
            tooltipMessage={"Previous"}
            variant={"prev"}
            href={"/"}
          />
          <ChallangeNavigator
            tooltipMessage={"Next"}
            variant={"next"}
            href={"/"}
          />
        </PanelHeader>
        <ChallangeTabs />
      </PanelWrapper>
    </ResizablePanel>
  );
};

export default LeftPanel;
