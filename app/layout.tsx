import type { Metadata } from "next";
import { Montserrat, Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "TruthFluencer - Your best health claims analyzer",
  description: "Never be lost again, wondering if you should believe everything you read about healthcare. Now you can analyze claims and determine what's relevant from trusted sources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${quicksand.className} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
