import { notFound } from "next/navigation";
import prismadb from "@/lib/prismadb";
import TabWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/tab-wrapper";
import FilteredDataStoreProvider from "@/stores/store-providers/filtered-data-store-provider";
import SolutionsList from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/solutions/_components/solutions-list";
import SolutionFilterButtonsWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/solutions/_components/solutions-filter-buttons-wrapper";

type SolutionsPageParams = {
  params: Promise<{ challengeName: string }>;
};

const SolutionsPage = async ({ params }: SolutionsPageParams) => {
  const challengeName = (await params).challengeName;

  const solutions = await prismadb.solution.findMany({
    where: {
      challenge: {
        title: challengeName,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: {
        select: {
          voteType: true,
        },
      },
      users: {
        select: {
          id: true,
          profile_picture: true,
          email: true,
          userRoles: {
            select: {
              role: true,
            },
          },
        },
      },
    },
  });

  if (solutions.length === 0) {
    notFound();
  }

  const data = solutions.map((solution) => ({
    ...solution,
    upVotes: solution.votes.filter((vote) => vote.voteType === "UPVOTE").length,
    downVotes: solution.votes.filter((vote) => vote.voteType === "DOWNVOTE")
      .length,
  }));

  return (
    <TabWrapper>
      <FilteredDataStoreProvider
        initialData={data}
        filters={{
          language: "LANGUAGE",
        }}
        sortKey={"createdAt"}
        sortOrder={"asc"}
      >
        <div className={"flex h-full w-full flex-col"}>
          <SolutionFilterButtonsWrapper />
          <SolutionsList challengeName={challengeName} />
        </div>
      </FilteredDataStoreProvider>
    </TabWrapper>
  );
};

export default SolutionsPage;
