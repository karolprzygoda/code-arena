import ChallengesListWrapper from "@/app/(root)/_components/challenges-list-wrapper";
import ChallengesSectionHeader from "@/app/(root)/_components/challenges-section-header";
import ChallengesSectionTitle from "@/app/(root)/_components/challenges-section-title";
import MoreChallengesLink from "@/app/(root)/_components/more-challenges-link";
import ChallengeCard from "@/app/(root)/_components/challenge-card";
import { TChallengeCard } from "@/lib/types";
import { Challenge } from "@prisma/client";

type ChallengesSectionProps = {
  challenges: TChallengeCard[];
  allChallenges: Array<Pick<Challenge, "difficulty">>;
};

const ChallengesSection = ({
  challenges,
  allChallenges,
}: ChallengesSectionProps) => {
  const difficultyTag = challenges[0].difficulty;
  const numberOfChallengesByDifficulty = allChallenges.filter(
    (challenge) => challenge.difficulty === difficultyTag,
  ).length;

  return (
    <section>
      <ChallengesSectionHeader>
        <ChallengesSectionTitle
          difficultyTag={difficultyTag}
          numberOfAllChallenges={numberOfChallengesByDifficulty}
        />
        <MoreChallengesLink difficultyTag={difficultyTag} />
      </ChallengesSectionHeader>
      <ChallengesListWrapper>
        {challenges.map((challenge) => (
          <ChallengeCard
            key={`challenges-${challenge.id}-card`}
            challenge={challenge}
          />
        ))}
      </ChallengesListWrapper>
    </section>
  );
};

export default ChallengesSection;
