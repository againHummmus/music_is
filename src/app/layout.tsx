import '@/styles/globals.css';
import { golos } from '@/styles/fonts';
import NextTopLoader from 'nextjs-toploader';
import { Footer } from '@/components/layout/Footer';
import { ClientInit } from '@/components/layout/ClientInit';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${golos.variable} w-full min-w-[300px] overflow-y-scroll`}
      >
        <ClientInit />
        <NextTopLoader
          color="#FF8C3A"
          initialPosition={0.5}
          showSpinner={false}
          zIndex={10000}
          speed={500}
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
