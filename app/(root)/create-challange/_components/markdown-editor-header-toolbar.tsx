"use client";

import EditorButton from "@/app/(root)/challange/_components/buttons/editor-button";
import PanelHeader from "@/app/(root)/challange/_components/panel-header";
import { TypographyAction } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Fragment } from "react";

type MarkdownEditorToolbarProps = {
  actions: TypographyAction[];
};

const MarkdownEditorHeaderToolbar = ({
  actions,
}: MarkdownEditorToolbarProps) => {
  return (
    <PanelHeader className={"gap-4 px-4"}>
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
    </PanelHeader>
  );
};

export default MarkdownEditorHeaderToolbar;
