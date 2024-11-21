import { Settings } from "lucide-react";
import EditorButton from "@/components/dashboard/buttons/editor-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SettingsForm } from "@/components/dashboard/settings-form";

const SettingsButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <EditorButton tooltipMessage={"Settings"} Icon={Settings} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <SettingsForm />
      </DialogContent>
    </Dialog>
  );
};

export default SettingsButton;
