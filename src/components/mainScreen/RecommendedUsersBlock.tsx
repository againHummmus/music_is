'use client';
import { User } from '../shared/user/UserItem';
import { useStore } from '@/app/store';
import { getUserRecommendations } from '@/actions/recsApi';
import { ContentBlock } from '../shared/ContentBlock';

export function RecommendedUsersBlock({
  showPlaceholder,
}: {
  showPlaceholder?: boolean;
}) {
  const currentUser = useStore((state) => state.user);

  if (!currentUser) return null;

  return (
    <ContentBlock
      title={
        <>
          You have much <span className="text-mainOrange">in common:</span>
        </>
      }
      titleClassName="text-[32px] text-mainDark"
      fetchItems={() =>
        getUserRecommendations()
      }
      renderGrid={(recs) => (
        <div className="relative w-full">
          <div className="pointer-events-none absolute left-0 top-0 z-[1000] hidden h-full w-[10px] bg-gradient-to-r from-white to-transparent max-main:block" />
          <div className="pointer-events-none absolute right-0 top-0 z-[1000] hidden h-full w-[10px] bg-gradient-to-l from-white to-transparent max-main:block" />
          <div className="custom-scrollbar-x scrollbar-container-x flex flex-row gap-10 overflow-x-scroll">
            {recs.map((rec) => (
              <User user={rec.RecommendedUser} key={rec.RecommendedUser.id} />
            ))}
          </div>
        </div>
      )}
      skeletonCount={4}
      skeletonItemClassName="w-[25%] min-h-[250px] bg-gray-300 animate-pulse rounded"
      emptyLabel={
        showPlaceholder
          ? 'You have no friends:( Like some tracks to see recommended users!'
          : "Looks like you're already friends with everyone!"
      }
      hideIfEmpty={!showPlaceholder}
      className="w-full min-w-0 rounded-[12px] border-2 border-mainOrange bg-gradient-to-b from-white to-white/0 p-15"
    />
  );
}
