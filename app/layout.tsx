import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "N.ext — NUS Opportunity Feed",
  description: "You won't miss another opportunity at NUS. N.ext aggregates Canvas deadlines, TalentConnect internships, scholarships, and more into one smart notification feed.",
  openGraph: {
    title: "N.ext — NUS Opportunity Feed",
    description: "You won't miss another opportunity at NUS.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
