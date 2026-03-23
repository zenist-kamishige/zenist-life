import "./globals.css";

export const metadata = {
  title: "zenist-life",
  description: "なにかをしたい。でも、それがわからない。そもそも、なにができるかもわからない。",
  openGraph: {
    title: "zenist-life",
    description: "なにかをしたい。でも、それがわからない。そもそも、なにができるかもわからない。",
    url: "https://zenist-life.vercel.app",
    siteName: "zenist-life",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}