import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FFDE59",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campuscollab-rx9f.onrender.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "CampusCollab — Find Teammates · Build Projects · Win Hackathons",
    template: "%s | CampusCollab"
  },
  description:
    "The premier campus collaboration network. Match with student developers, designers, and researchers based on verified skills, portfolio proofs, and availability.",
  keywords: [
    "campus collaboration",
    "student projects",
    "hackathon team finder",
    "student portfolio",
    "AI team matching",
    "college developers"
  ],
  authors: [{ name: "CampusCollab Community", url: baseUrl }],
  creator: "CampusCollab",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "CampusCollab — Find Teammates · Build Projects · Win Hackathons",
    description: "Match with student developers, designers, and researchers based on verified skills, portfolio proofs, and availability.",
    siteName: "CampusCollab",
    images: [
      {
        url: "/design-reference.png",
        width: 1200,
        height: 630,
        alt: "CampusCollab Platform Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusCollab — Campus Talent & Project Hub",
    description: "Discover student talent, build real projects, and find hackathon teammates.",
    images: ["/design-reference.png"]
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F5F1E6] text-[#17231D] selection:bg-[#A3C9AB] selection:text-[#0F3D2E]">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
