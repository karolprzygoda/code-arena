"use client";

import EditorButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/editor-button";
import PanelHeader from "@/app/(root)/challange/_components/panel-header";
import { TypographyAction } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Fragment } from "react";
import { CircleHelp } from "lucide-react";
import Link from "next/link";

type MarkdownEditorToolbarProps = {
  actions: TypographyAction[];
};

const MarkdownEditorHeaderToolbar = ({
  actions,
}: MarkdownEditorToolbarProps) => {
  return (
    <PanelHeader className={"justify-between overflow-x-auto px-4"}>
      <div className={"flex h-full items-center gap-4"}>
        {actions.map(({ id, label, Icon, onClick, separator }) => (
          <Fragment key={`toolbar-${id}`}>
            <EditorButton
              onClick={onClick}
              iconWidth={2}
              Icon={Icon}
              tooltipMessage={label}
            />
            {separator && (
              <Separator className={"h-3/4 w-0.5"} orientation="vertical" />
            )}
          </Fragment>
        ))}
      </div>
      <Link
        href={"https://www.markdownguide.org/basic-syntax/"}
        target={"_blank"}
      >
        <EditorButton
          iconWidth={2}
          Icon={CircleHelp}
          tooltipMessage={"How to use markdown"}
        />
      </Link>
    </PanelHeader>
  );
};

export default MarkdownEditorHeaderToolbar;
