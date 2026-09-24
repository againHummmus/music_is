import './globals.css';
import { golos } from './fonts';
import NextTopLoader from 'nextjs-toploader';
import Footer from '@/widgets/footer/Footer';
import ClientInit from './ClientInit';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
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
