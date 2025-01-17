"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

import { getSolvedChallenges } from "@/actions/utils-actions";
import { Challenge } from "@prisma/client";
import { toast } from "sonner";

type UserContextProps = {
  children: ReactNode;
};

export const SolvedChallengesContext = createContext<{
  solvedChallenges: Array<Pick<Challenge, "difficulty" | "id">> | null;
}>({ solvedChallenges: null });

const SolvedChallengesContextProvider = ({ children }: UserContextProps) => {
  const [solvedChallenges, setSolvedChallenges] = useState<Array<
    Pick<Challenge, "difficulty" | "id">
  > | null>(null);

  useLayoutEffect(() => {
    (async () => {
      const { error, solvedChallenges } = await getSolvedChallenges();

      if (error || !solvedChallenges) {
        toast.error(error);
      } else {
        setSolvedChallenges(solvedChallenges);
      }
    })();
  }, []);

  return (
    <SolvedChallengesContext.Provider value={{ solvedChallenges }}>
      {children}
    </SolvedChallengesContext.Provider>
  );
};

export default SolvedChallengesContextProvider;
export const useSolvedChallengesContext = () =>
  useContext(SolvedChallengesContext);
