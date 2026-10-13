import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CONTACT_EMAIL } from '@/lib/siteConfig';

const legalLinks = [
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms of service' },
  { href: '/report-content', label: 'Report content' },
  { href: '/imprint', label: 'Imprint' },
];

export const Footer = () => {
  
  return (
    <footer className="bg-mainBlack px-4 py-8 text-mainWhite sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/images/logoLight.png"
              alt="logo"
              className="h-50 object-contain"
              width={150}
              height={80}
            />
          </Link>
        </div>

        <div className="flex flex-col items-end space-y-2 text-sm">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 max-main:w-full md:justify-end">
            {legalLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors duration-200 hover:text-gray-400"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="max-w-sm text-center text-xs text-gray-400 max-main:w-full max-main:text-center md:text-right">
            For all complaints, please contact: {CONTACT_EMAIL}
          </div>
        </div>
      </div>
    </footer>
  );
};
