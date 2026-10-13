import Link from 'next/link';
import { LegalPage } from '@/components/ui/LegalPage';
import { CONTACT_EMAIL, OPERATOR_NAME, SITE_NAME } from '@/lib/siteConfig';

export function PrivacyScreen() {
  return (
    <LegalPage title="Privacy Policy" effectiveDate="13.10.2026">
      <p>
        This policy explains what personal data {SITE_NAME} (&quot;we&quot;, &quot;us&quot;)
        collects, why, and what you can do about it.
      </p>

      <h2>Who we are</h2>
      <p>
        {SITE_NAME} is operated by {OPERATOR_NAME}, Serbia. You can contact us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account data</strong> — your email address, username and password. Passwords are
          handled by our authentication provider and stored only in hashed form; we never see them.
        </li>
        <li>
          <strong>Profile data</strong> — your avatar and, if you become an artist, your artist name
          and artwork.
        </li>
        <li>
          <strong>Content you create</strong> — playlists, likes, follows, posts, uploaded tracks,
          album artwork and lyrics.
        </li>
        <li>
          <strong>Messages</strong> — private messages you send to other users, including tracks you
          attach to them.
        </li>
        <li>
          <strong>Taste profile</strong> — the tracks you like are used to suggest people with
          similar taste. Suggestions are calculated when you open the page and are not stored. You
          can turn this off in Settings; your likes are then not used and you are not suggested to
          others.
        </li>
        <li>
          <strong>Technical data</strong> — IP address, browser type and request logs, collected
          automatically by our hosting providers for security and to keep the service running.
        </li>
      </ul>
      <p>
        We do not collect payment data, precise location, contacts, or any special categories of
        data such as health or religion.
      </p>

      <h2>What is public</h2>
      <p>
        Your username, avatar, role, sign-up date, posts, public playlists, and the tracks, albums
        and artwork you upload are visible to everyone. So are your likes on tracks, posts and
        playlists, the people you follow and the people who follow you. Uploaded files are served
        from public URLs. Your email address is never shown to other users. Private messages are
        visible only to the participants of the conversation.
      </p>

      <h2>Why we use your data</h2>
      <table>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Data</th>
            <th>Legal basis (GDPR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Creating and running your account</td>
            <td>Account and profile data</td>
            <td>Contract</td>
          </tr>
          <tr>
            <td>Showing your content and delivering messages</td>
            <td>Content, messages</td>
            <td>Contract</td>
          </tr>
          <tr>
            <td>Suggesting people with similar taste</td>
            <td>Likes, taste profile</td>
            <td>Legitimate interest — you can object in Settings</td>
          </tr>
          <tr>
            <td>Security, abuse prevention, debugging</td>
            <td>Technical data</td>
            <td>Legitimate interest</td>
          </tr>
          <tr>
            <td>Service emails (confirmation, password reset)</td>
            <td>Email</td>
            <td>Contract</td>
          </tr>
          <tr>
            <td>Handling content reports and legal requests</td>
            <td>Any relevant data</td>
            <td>Legal obligation</td>
          </tr>
        </tbody>
      </table>
      <p>
        We do not use your data for advertising, we do not sell it, and we do not share it for
        cross-context behavioral advertising. Suggestions do not produce decisions with legal or
        similarly significant effects on you.
      </p>

      <h2>Cookies</h2>
      <p>
        We only use cookies that are strictly necessary to keep you signed in. We do not use
        analytics, advertising or tracking cookies.
      </p>

      <h2>Who processes your data for us</h2>
      <ul>
        <li>
          <strong>Supabase</strong> — database, authentication, file storage and service emails.
          Region: Ireland.
        </li>
        <li>
          <strong>Vercel</strong> — website hosting. Region: Ireland.
        </li>
      </ul>
      <p>
        They process data only on our instructions under data processing agreements. We do not share
        your data with anyone else, except when required by law.
      </p>

      <h2>International transfers</h2>
      <p>
        Your data is stored in Ireland. When data is transferred out of the EU/EEA or the UK, we
        rely on the European Commission&apos;s Standard Contractual Clauses and/or the EU–US Data
        Privacy Framework used by our providers.
      </p>

      <h2>How long we keep data</h2>
      <ul>
        <li>Account, profile and content — while your account exists.</li>
        <li>
          After you delete your account — removed immediately. We do not keep database backups.
        </li>
        <li>
          Messages you sent stay visible to the people you talked to, but are no longer linked to
          you.
        </li>
        <li>Technical logs — up to 7 days.</li>
      </ul>

      <h2>Your rights</h2>
      <p>Depending on where you live, you can:</p>
      <ul>
        <li>access your data and download a copy (Settings → Privacy);</li>
        <li>correct your data (Settings);</li>
        <li>delete your account and data (Settings → Privacy);</li>
        <li>object to suggestions based on your activity (Settings);</li>
        <li>restrict processing in certain cases;</li>
        <li>withdraw consent where processing is based on consent.</li>
      </ul>
      <p>
        For anything you cannot do in Settings, email{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We reply within 30 days and will
        never treat you differently for using your rights. If you are in the EU/EEA or the UK, you
        can also complain to your local data protection authority.
      </p>

      <h2>Children</h2>
      <p>
        {SITE_NAME} is not intended for anyone under 16. We do not knowingly collect data from
        children under 16. If you believe a child has created an account, contact us and we will
        delete it.
      </p>

      <h2>Security</h2>
      <p>
        Data is encrypted in transit (HTTPS), passwords are hashed, and access to data is restricted
        by database-level security rules. No system is perfectly secure, so please use a unique
        password.
      </p>

      <h2>Content and copyright</h2>
      <p>
        To report content that infringes your rights or breaks the rules, see{' '}
        <Link href="/report-content">Reporting content</Link>.
      </p>

      <h2>For users in the United States</h2>
      <p>
        We do not sell or share personal information as defined by the CCPA/CPRA and similar state
        laws, and we do not use sensitive personal information. Because we do not track you across
        websites, we treat Global Privacy Control and Do Not Track signals as already honored.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We will post any changes on this page and update the effective date. For significant
        changes, we will notify you by email or in the app.
      </p>
    </LegalPage>
  );
}
