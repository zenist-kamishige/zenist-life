import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "zenist-life",
  description: "なにかをしたい。でも、それがわからない。そもそも、なにができるかもわからない。",
  openGraph: {
    title: "zenist-life",
    description: "なにかをしたい。でも、それがわからない。そもそも、なにができるかもわからない。",
    url: "https://zenist-life.net",
    siteName: "zenist-life",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="ja">
      <body>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}