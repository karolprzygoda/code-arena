import { notFound, redirect } from "next/navigation";
import TabWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/tab-wrapper";
import SubmissionsStoreProvider from "@/stores/store-providers/submissions-store-provider";
import { createClient } from "@/lib/supabase/server";
import prismadb from "@/lib/prismadb";
import SubmissionsWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/_components/submissions-wrapper";
import FilterButtonsWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/_components/filter-buttons-wrapper";

type SubmissionsPageProps = {
  params: Promise<{ challengeName: string }>;
};

const SubmissionsPage = async ({ params }: SubmissionsPageProps) => {
  const supabaseClient = await createClient();
  const challengeName = (await params).challengeName;

  const {
    data: { user },
    error: authError,
  } = await supabaseClient.auth.getUser();

  if (authError || !user) {
    redirect("/sign-in");
  }

  const submissions = await prismadb.submission.findMany({
    where: {
      userId: user.id,
      challenge: {
        title: challengeName,
      },
      NOT: {
        status: "PENDING",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (submissions.length === 0) {
    notFound();
  }

  return (
    <TabWrapper>
      <div
        className={
          "flex h-full w-full min-w-[784px] flex-col text-sm font-semibold text-muted-foreground"
        }
      >
        <SubmissionsStoreProvider
          submissions={submissions}
          initialSubmissions={submissions}
          language={"LANGUAGE"}
          status={"STATUS"}
        >
          <div
            className={
              "flex w-full border-b border-zinc-300 py-2 dark:border-zinc-700"
            }
          >
            <FilterButtonsWrapper />
            <div className={"w-44 shrink-0"}>Runtime</div>
            <div className={"w-44 shrink-0"}>Memory</div>
          </div>
          <SubmissionsWrapper challengeName={challengeName} />
        </SubmissionsStoreProvider>
      </div>
    </TabWrapper>
  );
};

export default SubmissionsPage;
