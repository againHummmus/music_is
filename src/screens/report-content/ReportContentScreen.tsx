import Link from 'next/link';
import { LegalPage } from '@/components/ui/LegalPage';
import { CONTACT_EMAIL, CONTENT_REVIEW_DAYS, SITE_NAME } from '@/lib/siteConfig';

export function ReportContentScreen() {
  return (
    <LegalPage title="Reporting content">
      <p>
        If you believe something on {SITE_NAME} is illegal, infringes your rights or breaks our{' '}
        <Link href="/terms">Terms of Service</Link>, please let us know.
      </p>

      <h2>How to report</h2>
      <p>
        Use the Report option on a track or a post, or email{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Please include:
      </p>
      <ul>
        <li>a link to the content or a clear description of where it is;</li>
        <li>why you think it should be removed;</li>
        <li>your name and email address, so we can reply.</li>
      </ul>
      <p>For copyright complaints, please also include:</p>
      <ul>
        <li>which work of yours is being infringed;</li>
        <li>
          a statement that you believe in good faith that the use is not authorized by you, your
          agent or the law;
        </li>
        <li>
          a statement that the information in your report is accurate and that you are the rights
          holder or authorized to act on their behalf.
        </li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>We confirm that we received your report.</li>
        <li>
          We review it and, if the content breaks the law or our rules, remove it within{' '}
          {CONTENT_REVIEW_DAYS} days.
        </li>
        <li>We email the person who uploaded the content, explaining what was removed and why.</li>
        <li>We let you know the outcome of your report.</li>
      </ol>

      <h2>If your content was removed</h2>
      <p>
        If you think we made a mistake, reply to the email explaining the removal. We will review
        the decision again and tell you the result.
      </p>

      <h2>Repeated violations</h2>
      <p>
        Accounts that repeatedly upload infringing or illegal content may be suspended or deleted.
        Reports that are knowingly false may be ignored.
      </p>
    </LegalPage>
  );
}
