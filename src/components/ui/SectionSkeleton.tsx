import { Section } from '@/components/ui/Section';
import type { SectionProps } from '@/components/ui/Section';

export const TRACK_GRID_CLASS = 'grid grid-cols-1 main:grid-cols-2 w-full gap-10';
export const TRACK_SKELETON_CLASS =
  'h-[50px] main:h-[70px] bg-gray-300 animate-pulse rounded';

export function SectionSkeleton({
  count = 6,
  gridClassName = TRACK_GRID_CLASS,
  itemClassName = TRACK_SKELETON_CLASS,
  ...sectionProps
}: Omit<SectionProps, 'children' | 'buttonLabel' | 'buttonHref'> & {
  count?: number;
  gridClassName?: string;
  itemClassName?: string;
}) {
  return (
    <Section {...sectionProps}>
      <div className={gridClassName}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={itemClassName} />
        ))}
      </div>
    </Section>
  );
}
