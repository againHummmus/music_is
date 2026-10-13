import Link from 'next/link';
import { LegalPage } from '@/components/ui/LegalPage';
import { CONTACT_EMAIL, OPERATOR_NAME, SITE_NAME } from '@/lib/siteConfig';

export function TermsScreen() {
  return (
    <LegalPage title="Terms of Service" effectiveDate="[DATE]">
      <p>
        These terms govern your use of {SITE_NAME}, operated by {OPERATOR_NAME}. By creating an
        account or using the service, you agree to them. If you do not agree, please do not use{' '}
        {SITE_NAME}.
      </p>

      <h2>1. Who can use {SITE_NAME}</h2>
      <p>
        You must be at least 16 years old. You are responsible for keeping your password safe and
        for everything that happens under your account.
      </p>

      <h2>2. Your content</h2>
      <p>
        You keep all rights to the tracks, artwork, lyrics, posts and other content you upload. By
        uploading it, you give us a non-exclusive, worldwide, royalty-free license to store, stream,
        display and distribute it within {SITE_NAME}, only for the purpose of running the service.
        The license ends when you delete the content or your account, except for copies that other
        users have already received in messages.
      </p>
      <p>
        You confirm that you own the content you upload or have all the rights needed to share it on{' '}
        {SITE_NAME}.
      </p>

      <h2>3. Rules</h2>
      <p>You must not upload or send content that:</p>
      <ul>
        <li>infringes someone else&apos;s copyright or other rights;</li>
        <li>is illegal, hateful, harassing or threatening;</li>
        <li>contains sexual content involving minors;</li>
        <li>impersonates another person or artist;</li>
        <li>contains malware, spam or misleading links.</li>
      </ul>
      <p>
        You must not try to access other users&apos; accounts or data, overload the service, or
        bypass its security.
      </p>
      <p>[ADD ANY OTHER RULES]</p>

      <h2>4. Reporting and removing content</h2>
      <p>
        Anyone can report content that breaks these rules or the law. See{' '}
        <Link href="/report-content">Reporting content</Link> for how reports are handled. We may
        remove content or restrict accounts that break these terms, and we will tell you why by
        email.
      </p>

      <h2>5. Ending your account</h2>
      <p>
        You can delete your account at any time in Settings. We may suspend or delete accounts that
        seriously or repeatedly break these terms, in particular repeated copyright infringement.
      </p>

      <h2>6. The service is provided as is</h2>
      <p>
        {SITE_NAME} is a personal, non-commercial project provided free of charge and &quot;as
        is&quot;. We do our best to keep it running, but we do not guarantee that it will always be
        available or free of errors, and we may change or discontinue features.
      </p>

      <h2>7. Liability</h2>
      <p>
        To the extent permitted by law, we are not liable for indirect damages or loss of data
        arising from your use of {SITE_NAME}. Nothing in these terms limits liability that cannot be
        limited by law, including your rights as a consumer.
      </p>

      <h2>8. Privacy</h2>
      <p>
        How we handle your personal data is described in the{' '}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>9. Changes to these terms</h2>
      <p>
        We may update these terms. We will post the new version on this page and, for significant
        changes, notify you by email or in the app before they take effect.
      </p>

      <h2>10. Governing law</h2>
      <p>[GOVERNING LAW AND JURISDICTION]</p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
