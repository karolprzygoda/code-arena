import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditorShortcuts } from "@/components/dashboard/editor-shortcuts";
import { SquareSlash } from "lucide-react";
import EditorButton from "@/components/dashboard/buttons/editor-button";

type ShortcutButtonProps = {
  label?: string;
  className?: string;
};

const ShortcutButton = ({ label, className }: ShortcutButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <EditorButton
          tooltipMessage={"Shortcuts"}
          Icon={SquareSlash}
          label={label}
          className={className}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <EditorShortcuts />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShortcutButton;
