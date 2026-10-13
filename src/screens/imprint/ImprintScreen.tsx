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

      <h2>Music credits</h2>
      <p>
        The demo music on {SITE_NAME} consists of public-domain (CC0) recordings by Musopen and
        other performers, published on{' '}
        <a href="https://commons.wikimedia.org/wiki/Category:Musopen">Wikimedia Commons</a>.
        Composer portraits and album covers are public-domain images from Wikimedia Commons.
      </p>
    </LegalPage>
  );
}
