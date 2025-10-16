import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import remarkRemoveComments from "remark-remove-comments";
import rehypeKatex from "rehype-katex";
// import "katex/dist/katex.min.css";
import { Icons } from "@/components/icons";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import "./markdown.css";
import { unified } from "unified";

// TODO: add css styles for rehype syntax highlighting

type MarkdownRendererProps = {
  markdown: string;
};

const SSRMarkdownRenderer = async ({ markdown }: MarkdownRendererProps) => {
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRemoveComments)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);

  if (markdown === "") {
    return (
      <div
        className={
          "flex h-full w-full flex-col items-center justify-center gap-6"
        }
      >
        <Icons.noData className={"h-56 w-56"} />
        <p className={"text-2xl font-bold"}>Description is Empty</p>
      </div>
    );
  }

  return (
    <div
      className="markdown prose-invert w-full overflow-x-hidden leading-7"
      dangerouslySetInnerHTML={{ __html: String(processedContent) }}
    />
  );
};

export default SSRMarkdownRenderer;
