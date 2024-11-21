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

const ShortcutButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <EditorButton tooltipMessage={"Shortcuts"} Icon={SquareSlash} />
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
