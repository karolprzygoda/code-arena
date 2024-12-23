import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/app/(root)/create-challange/_components/markdown-renderer";

type DescriptionPageProps = {
  params: Promise<{ challangeName: string }>;
};

const DescriptionPage = async ({ params }: DescriptionPageProps) => {
  const data = await prismadb.challenge.findFirst({
    where: {
      title: (await params).challangeName.split(" ").join("-").toLowerCase(),
    },
    select: {
      description: true,
    },
  });

  if (data === null) {
    notFound();
  }

  return (
    <div className={"h-[calc(100%-93px)] overflow-y-auto p-4 pb-8"}>
      <MarkdownRenderer markdown={data.description} />
    </div>
  );
};

export default DescriptionPage;
