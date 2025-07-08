import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { ToastProvider } from '@/components/Toast';
import { ApiProvider } from '@/components/ApiProvider';
import Footer from '@/components/Footer';
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
  title: "EzyBookmark | AI-Powered Bookmark Management",
  description: "Discover, bookmark, and organize AI tools effortlessly with intelligent categorization. From development to creativity - find and manage the perfect tools for every task with EzyBookmark.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: "#374151",
          colorNeutral: "#374151"
        },
        elements: {
          modalContent: "bg-white",
          modalBackdrop: "bg-black bg-opacity-50",
          card: "bg-white",
          formButtonPrimary: "bg-gray-800 hover:bg-gray-700",
          footerActionLink: "text-gray-800 hover:text-gray-600"
        }
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ToastProvider>
            <ApiProvider>
              <div className="min-h-screen flex flex-col">
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </ApiProvider>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
