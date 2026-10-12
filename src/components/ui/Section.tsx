import type { ReactNode } from 'react';
import { ArrowButton } from '@/components/ui/buttons/ArrowButton';

export interface SectionProps {
  title: ReactNode;
  titleClassName?: string;
  className?: string;
  buttonLabel?: string;
  buttonHref?: string;
  children: ReactNode;
}

export function Section({
  title,
  titleClassName,
  className,
  buttonLabel,
  buttonHref,
  children,
}: SectionProps) {
  return (
    <div className={`flex flex-col gap-10 ${className ?? ''}`}>
      <div className={`font-bold ${titleClassName ?? 'text-[24px] text-mainBlack'}`}>
        {title}
      </div>
      {children}
      {buttonHref && buttonLabel && (
        <ArrowButton
          title={buttonLabel}
          href={buttonHref}
          color="mainOrange"
          maxWidth="100px"
        />
      )}
    </div>
  );
}
