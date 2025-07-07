import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-mainBlack text-mainWhite py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
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
                    <Link href="/privacy" className="max-main:w-full max-main:text-center hover:text-gray-400 transition-colors duration-200">
                        Privacy policy
                    </Link>
                    <div className="text-center md:text-right text-xs text-gray-400 max-w-sm">
                        For all complaints, please contact: py0710@yandex.ru
                    </div>
                    <div className="text-center md:text-right text-xs text-gray-400 max-w-sm">
                        The service may contain information not intended for persons under 18 years of age.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;