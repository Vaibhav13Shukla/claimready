import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../i18n/context";
import { DisclosureBanner } from "../components/DisclosureBanner";
import { Navbar } from "../components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500", "600"],
  variable: "--font-serif-accent",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://claimready.example.com";
const TITLE = "ClaimReady: EPFO PF Claim Intelligence and Rejection Prevention";
const DESCRIPTION =
  "1 in 5 EPFO claims is rejected for a small, fixable mismatch. ClaimReady runs pre-flight checks, decodes rejection remarks, and provides deterministic resolution packets.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · ClaimReady" },
  description: DESCRIPTION,
  manifest: "/manifest.json",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "ClaimReady",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${sourceSerif.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-white text-[#1b1d20] selection:bg-[#5196fe]/20 selection:text-[#1b1d20]">
        <LanguageProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-[#5196fe] focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold rounded-[9999px]"
          >
            Skip to content
          </a>

          {/* Sticky Header Wrapper */}
          <div className="sticky top-0 z-50">
            <DisclosureBanner />
            <Navbar />
          </div>

          <main id="main-content" className="flex-1 w-full">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-[#e1dfd8] bg-[#f2f1ec] py-8 text-[13px] text-[#6e6e6e]">
            <div className="max-w-[1200px] mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[#1b1d20]">ClaimReady</span>
                <span className="text-[#e1dfd8]">•</span>
                <span>Build What Moves India 2026</span>
              </div>
              <p className="text-center sm:text-right text-[12px] text-[#797876]">
                100% synthetic and mocked. No real citizen PII accepted. Independent prototype not affiliated with EPFO.
              </p>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
