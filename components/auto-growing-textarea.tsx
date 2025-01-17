"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface AutoGrowingTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxHeight?: number;
}

export function AutoGrowingTextarea({
  maxHeight,
  className,
  onChange,
  ...props
}: AutoGrowingTextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;

    textarea.style.height = "auto";

    const newHeight = textarea.scrollHeight;

    const exceedsMaxHeight = newHeight > (maxHeight || Infinity);
    setIsOverflowing(exceedsMaxHeight);

    textarea.style.height = `${Math.min(newHeight, maxHeight || Infinity)}px`;

    onChange?.(event);
  };

  React.useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight || Infinity)}px`;
    }
  }, [maxHeight]);

  return (
    <Textarea
      ref={textareaRef}
      onChange={handleChange}
      className={cn(
        "transition-height w-full resize-none",
        isOverflowing ? "overflow-auto" : "overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}
