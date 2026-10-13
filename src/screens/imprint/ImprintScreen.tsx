import { LegalPage } from '@/components/ui/LegalPage';
import { CONTACT_EMAIL, OPERATOR_NAME, SITE_NAME } from '@/lib/siteConfig';

export function ImprintScreen() {
  return (
    <LegalPage title="Imprint">
      <p>{SITE_NAME} is a private, non-commercial project.</p>

      <h2>Responsible for the content</h2>
      <p>{OPERATOR_NAME}</p>

      <h2>Contact</h2>
      <p>
        Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </LegalPage>
  );
}
