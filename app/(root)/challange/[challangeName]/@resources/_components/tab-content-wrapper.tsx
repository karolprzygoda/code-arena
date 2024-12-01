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
      className={"h-full w-full overflow-y-auto px-4 pb-36 pt-3 outline-none"}
    >
      {children}
    </TabsContent>
  );
};

export default TabContentWrapper;
