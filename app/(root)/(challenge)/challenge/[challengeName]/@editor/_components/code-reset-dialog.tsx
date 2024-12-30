import { useShallow } from "zustand/react/shallow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import useEditorContext from "@/hooks/use-editor-context";

type CodeResetDialogProps = {
  isDesktop: boolean;
  isOpen: boolean;
  defaultCode: PrismaJson.DefaultCodeType;
  handleClose: () => void;
};

const CodeResetDialog = ({
  isDesktop,
  isOpen,
  defaultCode,
  handleClose,
}: CodeResetDialogProps) => {
  const { setCode, language } = useEditorContext(
    useShallow((state) => ({
      setCode: state.setCode,
      language: state.language,
    })),
  );

  const handleReset = () => {
    setCode(language, defaultCode[language]);
    handleClose();
  };

  if (isDesktop) {
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete code
              that you have written.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer dismissible={false} open={isOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete code that
            you have written.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button onClick={handleClose} variant="outline">
              Cancel
            </Button>
          </DrawerClose>
          <Button onClick={handleReset}>Continue</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CodeResetDialog;
