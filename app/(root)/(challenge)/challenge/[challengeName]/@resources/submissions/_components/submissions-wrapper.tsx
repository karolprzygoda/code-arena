"use client";

import SubmissionRow from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/_components/submission-row";
import { useShallow } from "zustand/react/shallow";
import NotFoundComponent from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/_components/not-found-component";
import useFilteredDataContext from "@/hooks/use-filtered-data-context";
import { Submission } from "@prisma/client";

type SubmissionsWrapperProps = {
  challengeName: string;
};

const SubmissionsWrapper = ({ challengeName }: SubmissionsWrapperProps) => {
  const submissions = useFilteredDataContext<Submission, Submission[]>(
    useShallow((state) => state.data),
  );

  if (submissions.length < 1) {
    return (
      <div className={"flex h-full flex-col"}>
        <NotFoundComponent />
      </div>
    );
  }

  return (
    <ul className={"flex h-full flex-col"}>
      {submissions.map((submission, index) => (
        <SubmissionRow
          challengeName={challengeName}
          key={`submission-${submission.id}`}
          submission={submission}
          index={index}
        />
      ))}
    </ul>
  );
};

export default SubmissionsWrapper;
