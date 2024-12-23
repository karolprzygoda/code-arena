import { ReactNode } from "react";
import { TabsContent } from "@/components/ui/tabs";

type TabContentWrapperProps = {
  value: string;
  children: ReactNode;
};
const TabContentWrapper = ({ value, children }: TabContentWrapperProps) => {
  return (
    <TabsContent
      value={value}
      className={"m-0 h-full w-full overflow-y-hidden outline-none"}
    >
      {children}
    </TabsContent>
  );
};

export default TabContentWrapper;
