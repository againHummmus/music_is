import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
          <Link
            href="/privacy"
            className="transition-colors duration-200 hover:text-gray-400 max-main:w-full max-main:text-center"
          >
            Privacy policy
          </Link>
          <div className="max-w-sm text-center text-xs text-gray-400 max-main:w-full max-main:text-center md:text-right">
            For all complaints, please contact: py0710@yandex.ru
          </div>
          <div className="max-w-sm text-center text-xs text-gray-400 md:text-right">
            The service may contain information not intended for persons under
            18 years of age.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
