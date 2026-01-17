import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Professional Proforma Generator",
  description: "Generate high-quality PDF invoices instantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100 min-h-screen flex items-center justify-center p-4`}
      >
        {/* - bg-slate-100: Soft grey background makes the white form stand out.
            - flex items-center justify-center: Centers your form perfectly in the screen.
            - min-h-screen: Ensures the background covers the full page height.
        */}
        <div className="w-full max-w-5xl">
          {children}
        </div>
      </body>
    </html>
  );
}