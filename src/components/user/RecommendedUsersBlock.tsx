import { getCurrentUser } from '@/actions/session';
import { getUserRecommendations } from '@/actions/recsApi';
import type { RecommendationRow } from '@/actions/types';
import { UserItem } from '@/components/user/UserItem';
import { Section } from '@/components/ui/Section';
import { SectionSkeleton } from '@/components/ui/SectionSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';

const sectionProps = {
  title: (
    <>
      You have much <span className="text-mainOrange">in common:</span>
    </>
  ),
  titleClassName: 'text-[32px] text-mainDark',
  className:
    'w-full min-w-0 rounded-[12px] border-2 border-mainOrange bg-gradient-to-b from-white to-white/0 p-15',
};

export function RecommendedUsersSkeleton() {
  return (
    <SectionSkeleton
      {...sectionProps}
      count={4}
      gridClassName="flex w-full flex-row gap-10 overflow-hidden"
      itemClassName="h-[250px] w-[240px] shrink-0 animate-pulse rounded-[7px] bg-gray-300"
    />
  );
}

export async function RecommendedUsersBlock({
  showPlaceholder,
}: {
  showPlaceholder?: boolean;
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  const recommendations = await getUserRecommendations().catch(
    (): RecommendationRow[] => []
  );
  const users = recommendations.flatMap((rec) =>
    rec.RecommendedUser ? [rec.RecommendedUser] : []
  );
  if (users.length === 0 && !showPlaceholder) return null;

  return (
    <Section {...sectionProps}>
      {users.length > 0 ? (
        <div className="relative w-full">
          <div className="pointer-events-none absolute left-0 top-0 z-[1000] hidden h-full w-[10px] bg-gradient-to-r from-white to-transparent max-main:block" />
          <div className="pointer-events-none absolute right-0 top-0 z-[1000] hidden h-full w-[10px] bg-gradient-to-l from-white to-transparent max-main:block" />
          <div className="custom-scrollbar-x scrollbar-container-x flex flex-row gap-10 overflow-x-scroll">
            {users.map((recommended) => (
              <UserItem user={recommended} key={recommended.id} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState>
          You have no friends:( Like some tracks to see recommended users!
        </EmptyState>
      )}
    </Section>
  );
}
