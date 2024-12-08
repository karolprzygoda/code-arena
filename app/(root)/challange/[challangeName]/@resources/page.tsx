import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";

type DescriptionPageProps = {
  params: Promise<{ challangeName: string }>;
};

const DescriptionPage = async ({ params }: DescriptionPageProps) => {
  const data = await prismadb.challenge.findFirst({
    where: {
      title: (await params).challangeName,
    },
    select: {
      description: true,
    },
  });

  if (data === null) {
    notFound();
  }

  return <div>{data.description}</div>;
};

export default DescriptionPage;
