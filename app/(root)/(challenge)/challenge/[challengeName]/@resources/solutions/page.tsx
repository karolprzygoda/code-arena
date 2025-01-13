import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import TabWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/tab-wrapper";
import FilteredDataStoreProvider from "@/stores/store-providers/filtered-data-store-provider";
import SolutionsWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/solutions/_components/solutions-wrapper";
import SolutionFilterButtonsWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/solutions/_components/solutions-filter-buttons-wrapper";
import { getUserById } from "@/actions/auth-actions";
import { getUserProfilePicture } from "@/lib/utils";

type SolutionsPageParams = {
  params: Promise<{ challengeName: string }>;
};

const SolutionsPage = async ({ params }: SolutionsPageParams) => {
  const supabaseClient = await createClient();
  const challengeName = (await params).challengeName;

  const {
    data: { user },
    error: authError,
  } = await supabaseClient.auth.getUser();

  if (authError || !user) {
    redirect("/sign-in");
  }

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
      votes: true,
    },
  });

  const userMap = new Map(
    (
      await Promise.all(
        solutions.map((solution) => getUserById(solution.authorId)),
      )
    ).map((user) => [user.id, user]),
  );

  const data = solutions.map((solution) => {
    const author = userMap.get(solution.authorId)!;

    return {
      ...solution,
      upVotes: solution.votes.filter(
        (vote) => vote.solutionId === solution.id && vote.voteType === "UPVOTE",
      ).length,
      downVotes: solution.votes.filter(
        (vote) =>
          vote.solutionId === solution.id && vote.voteType === "DOWNVOTE",
      ).length,
      author: {
        id: author.id,
        email: author.email,
        profileImageSrc: getUserProfilePicture(author),
        isAdmin: author.isAdmin,
      },
    };
  });

  if (solutions.length === 0) {
    notFound();
  }

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
          <SolutionsWrapper challengeName={challengeName} />
        </div>
      </FilteredDataStoreProvider>
    </TabWrapper>
  );
};

export default SolutionsPage;
