import type { ReactNode } from 'react';

export function LegalPage({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate?: string;
  children: ReactNode;
}) {
  return (
    <article className="container max-w-3xl space-y-4 px-15 py-30 text-mainDark [&_a]:text-mainOrange [&_a]:underline [&_h2]:pt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-mainBlack [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_table]:w-full [&_td]:border [&_td]:border-lightStormy [&_td]:p-2 [&_td]:align-top [&_th]:border [&_th]:border-lightStormy [&_th]:p-2 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-6">
      <h1 className="text-3xl font-bold text-mainBlack">{title}</h1>
      {effectiveDate && <p className="text-sm text-gray-500">Effective date: {effectiveDate}</p>}
      {children}
    </article>
  );
}
