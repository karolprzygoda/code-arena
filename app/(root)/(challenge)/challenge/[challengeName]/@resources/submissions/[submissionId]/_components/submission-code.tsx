import { Separator } from "@/components/ui/separator";
import MarkdownRenderer from "@/app/(root)/(challenge)/_components/markdown/markdown-renderer";
import { Language } from "@prisma/client";

type SubmissionCodeProps = {
  code: string;
  language: Language;
};

const SubmissionCode = ({ code, language }: SubmissionCodeProps) => {
  return (
    <div className={"flex w-full flex-col"}>
      <div
        className={
          "flex items-center gap-2 text-sm font-semibold text-muted-foreground"
        }
      >
        Code
        <Separator
          orientation="vertical"
          className={"h-3 bg-muted-foreground"}
        />
        {language}
      </div>
      <div>
        <MarkdownRenderer markdown={code} />
      </div>
    </div>
  );
};

export default SubmissionCode;
