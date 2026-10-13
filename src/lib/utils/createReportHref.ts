import { CONTACT_EMAIL } from '@/lib/siteConfig';

export function createReportHref(subject: string, contentUrl: string) {
  const body = `Content: ${contentUrl}\n\nWhat is wrong with it:\n`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
