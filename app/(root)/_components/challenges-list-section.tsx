import ChallengesListWrapper from "@/app/(root)/_components/challenges-list-wrapper";
import ChallengesListHeader from "@/app/(root)/_components/challenges-list-header";
import ChallengesListTitle from "@/app/(root)/_components/challenges-list-title";
import MoreChallengesLink from "@/app/(root)/_components/more-challenges-link";
import ChallengeCard from "@/app/(root)/_components/challenge-card";
import { ChallengeCardType } from "@/lib/types";
import { User } from "@supabase/supabase-js";

type ChallengesListProps = {
  signedInUser: User;
  challenges: ChallengeCardType[];
};

const ChallengesListSection = ({
  challenges,
  signedInUser,
}: ChallengesListProps) => {
  const difficultyTag = challenges[0].difficulty;

  return (
    <section>
      <ChallengesListHeader>
        <ChallengesListTitle difficultyTag={difficultyTag} />
        <MoreChallengesLink difficultyTag={difficultyTag} />
      </ChallengesListHeader>
      <ChallengesListWrapper>
        {challenges.map((challenge) => (
          <ChallengeCard
            key={`challenges-${challenge.id}-card`}
            signedInUser={signedInUser}
            challenge={challenge}
          />
        ))}
      </ChallengesListWrapper>
    </section>
  );
};

export default ChallengesListSection;
