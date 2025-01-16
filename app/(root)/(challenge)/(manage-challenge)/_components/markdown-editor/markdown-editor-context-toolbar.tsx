import { Fragment } from "react";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { TypographyAction } from "@/lib/types";

type MarkdownEditorContextToolbarProps = {
  actions: TypographyAction[];
};

const MarkdownEditorContextToolbar = ({
  actions,
}: MarkdownEditorContextToolbarProps) => {
  return (
    <ContextMenuContent className="w-64">
      {actions.map(({ id, label, Icon, onClick, separator }) => (
        <Fragment key={`context-${id}`}>
          <ContextMenuItem inset onClick={onClick}>
            {label}
            <ContextMenuShortcut>
              <Icon className="h-4 w-4" />
            </ContextMenuShortcut>
          </ContextMenuItem>
          {separator && <ContextMenuSeparator />}
        </Fragment>
      ))}
    </ContextMenuContent>
  );
};

export default MarkdownEditorContextToolbar;
