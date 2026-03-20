import "./globals.css";

export const metadata = {
  title: "zenist-life",
  description: "呼吸を調え、自分を愛おしむ。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
