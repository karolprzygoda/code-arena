"use client";

import SubmissionRow from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/_components/submission-row";
import useSubmissionsContext from "@/hooks/use-submissions-context";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";
import NotFoundComponent from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/_components/not-found-component";

type SubmissionsWrapperProps = {
  challengeName: string;
};

const SubmissionsWrapper = ({ challengeName }: SubmissionsWrapperProps) => {
  const { submissions, initialSubmissions, setSubmissions, language, status } =
    useSubmissionsContext(
      useShallow((state) => ({
        submissions: state.submissions,
        initialSubmissions: state.initialSubmissions,
        setSubmissions: state.setSubmissions,
        language: state.language,
        status: state.status,
      })),
    );

  useEffect(() => {
    setSubmissions(
      initialSubmissions.filter((submission) => {
        const matchesLanguage =
          language === "LANGUAGE" || submission.language === language;
        const matchesStatus =
          status === "STATUS" || submission.status === status;
        return matchesLanguage && matchesStatus;
      }),
    );
  }, [language, status, setSubmissions, initialSubmissions]);

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
