import type { Metadata } from "next";
import { Rubik, Oswald, Lato } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-kaspa-header",
  display: 'swap',
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-kaspa-subheader",
  display: 'swap',
});

const lato = Lato({
  subsets: ["latin"],
  weight: ['300', '400', '700', '900'],
  variable: "--font-kaspa-body",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "kas.coffee - Enterprise Kaspa Donations",
  description: "Professional-grade Kaspa cryptocurrency donation infrastructure for enterprises, creators, and organizations",
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${rubik.variable} ${oswald.variable} ${lato.variable} font-kaspa-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
