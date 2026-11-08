import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const description =
  'Product engineer and designer-developer building interfaces that prioritize intelligibility, utility, and delight.';

export const metadata: Metadata = {
  title: 'Stephanie Tuerk',
  description,
  openGraph: {
    title: 'Stephanie Tuerk',
    description,
    type: 'website',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1VV870ZN32"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-1VV870ZN32');`}
        </Script>
      </body>
    </html>
  );
}
