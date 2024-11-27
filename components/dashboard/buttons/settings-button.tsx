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

type SettingsButtonProps = {
  label?: string;
  className?: string;
};

const SettingsButton = ({ label, className }: SettingsButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <EditorButton
          tooltipMessage={"Settings"}
          Icon={Settings}
          label={label}
          className={className}
        />
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
