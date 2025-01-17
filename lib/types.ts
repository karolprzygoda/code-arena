import {
  Challenge,
  Language,
  Submission,
  UserRoles,
  Users,
  Votes,
} from "@prisma/client";
import { LucideIcon } from "lucide-react";
import { JwtPayload } from "jwt-decode";

declare global {
  namespace PrismaJson {
    type ErrorType = { message: string; stack: string };
    type InputType = { name: string; value: unknown };
    type TestCasesType = {
      inputs: InputType[];
      expectedOutput: unknown;
      hidden: boolean;
    }[];
    export type DefaultCodeType = Record<Lowercase<Language>, string>;
    type TestResultsType = {
      input: unknown;
      expectedOutput: unknown;
      actualOutput: unknown;
      passed: boolean;
      logs: string[];
      error?: ErrorType | null;
      hidden: boolean;
      executionTime: number;
      memoryUsage: number;
    }[];
  }
}

export type KafkaMessageType = {
  kafkaMessageId: string;
  code: string;
  testCases: PrismaJson.TestCasesType;
};

export type TypographyVariant =
  | "bold"
  | "italic"
  | "strike"
  | "inlineCode"
  | "quote"
  | "unorderedList"
  | "orderedList"
  | "h1"
  | "h2"
  | "h3";

export type TypographyAction = {
  id: string;
  label: string;
  Icon: LucideIcon;
  separator?: true;
  onClick: () => void;
};

type SuccessSubmissionResponse = {
  success: true;
  testResults: PrismaJson.TestResultsType;
  globalError: never;
};

type ErrorSubmissionResponse = {
  success: false;
  testResults: never;
  globalError: PrismaJson.ErrorType;
};

export type SubmissionResponse =
  | SuccessSubmissionResponse
  | ErrorSubmissionResponse;

export type JWTWithUserRole = {
  user_role: string;
} & JwtPayload;

export type MetricRange = {
  start: number;
  end: number;
  percentage: number;
};

export type ProcessedMetric = {
  range: string;
  solutions: number;
  isActive: boolean;
};

export type MetricData = {
  data: ProcessedMetric[];
  current: number;
  beat: number;
  unit: string;
};

export type TChallengeCard = Omit<
  Challenge,
  "description" | "testCases" | "authorId"
> & {
  submission: Array<Pick<Submission, "userId" | "challengeId">>;
  users: Pick<Users, "email">;
  votes: Votes[];
};

export type SelectionRange = {
  selectionStart: number;
  selectionEnd: number;
} | null;

export type MoreChallengesSheetType = Array<
  Pick<Challenge, "title" | "difficulty" | "id"> & {
    submission: Array<Pick<Submission, "challengeId" | "userId">>;
  }
>;

export type VotableItems = "challengeTitle" | "solutionId";

export type TUserRoles = Users & {
  userRoles: Array<Pick<UserRoles, "role">>;
};

export type TChallengeData = Challenge & {
  users: Users & TUserRoles;
} & {
  submission: Array<Pick<Submission, "userId" | "challengeId">>;
};

export type TChallengesSolvedByUser = Array<Pick<Challenge, "difficulty">>;
