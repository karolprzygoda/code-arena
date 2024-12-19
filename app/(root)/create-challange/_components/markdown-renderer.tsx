"use client";

import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vs,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import Markdown from "react-markdown";
import { useTheme } from "next-themes";

type MarkdownRendererProps = {
  markdown: string;
};

const MarkdownRenderer = ({ markdown }: MarkdownRendererProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      className="prose-invert overflow-y-auto p-4 leading-7"
      components={{
        h1: ({ ...props }) => (
          <h1 {...props} className="mb-2 pb-2 text-3xl font-bold" />
        ),
        h2: ({ ...props }) => (
          <h2 {...props} className="mb-2 pb-2 text-2xl font-bold" />
        ),
        h3: ({ ...props }) => (
          <h3 {...props} className="mb-2 pb-2 text-xl font-bold" />
        ),
        p: ({ ...props }) => (
          <p {...props} className="mb-4 overflow-hidden text-ellipsis" />
        ),
        ol: ({ ...props }) => (
          <ol {...props} className={"mb-4 list-decimal ps-10"} />
        ),
        ul: ({ ...props }) => (
          <ul {...props} className={"mb-4 list-disc ps-10"} />
        ),
        hr: ({ ...props }) => (
          <hr {...props} className={"my-4 dark:border-zinc-700"} />
        ),
        a: ({ ...props }) => (
          <a {...props} className={"whitespace-nowrap text-blue-500"} />
        ),
        blockquote: ({ ...props }) => (
          <blockquote
            {...props}
            className={
              "mx-0 my-[10px] border-l-8 border-gray-400 bg-zinc-200 px-2 py-[10px] dark:border-gray-200 dark:bg-zinc-700"
            }
          />
        ),
        code(props) {
          const { children, className, node, ref, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              {...rest}
              node={node}
              PreTag="div"
              language={match[1]}
              style={resolvedTheme === "dark" ? vscDarkPlus : vs}
              className={"rounded-md"}
              customStyle={{
                scrollbarWidth: "thin",
              }}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              {...rest}
              className={
                "rounded-md border border-zinc-300 bg-neutral-200 px-1 py-[0.10rem] font-mono text-zinc-600 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
              }
              ref={ref}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {markdown}
    </Markdown>
  );
};

export default MarkdownRenderer;
