import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "../i18n/context";
import { DisclosureBanner } from "../components/DisclosureBanner";
import { Navbar } from "../components/Navbar";

export const metadata: Metadata = {
  title: "ClaimReady — Check your EPFO PF claim before it gets rejected",
  description:
    "1 in 5 EPFO claims is rejected for a small, fixable mismatch. ClaimReady runs a pre-flight check on your PF claim, decodes rejections, and gives you the exact fix. Independent hackathon prototype.",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-white text-[#0a0a0a] selection:bg-[#006cd2]/15 selection:text-[#0053a3]">
        <LanguageProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-[#006cd2] focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
          >
            Skip to content
          </a>
          {/* One shared sticky wrapper instead of each child hardcoding its
              own top offset — the banner can wrap to two lines (long text,
              narrow viewport, 200% zoom) without the Navbar overlapping it. */}
          <div className="sticky top-0 z-50">
            <DisclosureBanner />
            <Navbar />
          </div>
          <main id="main-content" className="flex-1 w-full">{children}</main>
          <footer className="border-t border-black/10 bg-white py-5 text-center text-[11px] text-neutral-500">
            <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="font-medium text-neutral-600">
                ClaimReady · Build What Moves India 2026
              </p>
              <p>
                100% synthetic &amp; mocked · no real UAN / Aadhaar / PAN / bank data · not affiliated with EPFO
              </p>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
