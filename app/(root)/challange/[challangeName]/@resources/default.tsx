import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";

type ResourcesDefaultProps = {
  params: Promise<{ challangeName: string }>;
};

const ResourcesDefault = async ({ params }: ResourcesDefaultProps) => {
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

export default ResourcesDefault;
