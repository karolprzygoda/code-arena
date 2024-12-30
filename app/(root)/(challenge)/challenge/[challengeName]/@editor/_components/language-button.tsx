import { useShallow } from "zustand/react/shallow";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Language } from "@prisma/client";
import useEditorContext from "@/hooks/use-editor-context";

type LanguageButtonProps = {
  language: Lowercase<Language>;
};

const LanguageButton = ({ language }: LanguageButtonProps) => {
  const { setLanguage } = useEditorContext(
    useShallow((state) => ({
      setLanguage: state.setLanguage,
    })),
  );

  const IconComponent = Icons[language];

  return (
    <Button
      className={"h-auto w-full items-center justify-start gap-4 !rounded-xl"}
      variant={"ghost"}
      onClick={() => setLanguage(language)}
    >
      <IconComponent className={"h-6 w-6"} />
      {language}
    </Button>
  );
};

export default LanguageButton;
