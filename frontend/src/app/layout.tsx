import type { Metadata } from "next";
import { Inter, Hanken_Grotesk, Geist } from "next/font/google";
import "../../styles/globals.css"; // correct path to globals.css
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const hankenGrotesk = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-headline" });
const geist = Geist({ subsets: ["latin"], variable: "--font-label" });

export const metadata: Metadata = {
  title: "RentNGo | Secure Community Equipment Sharing",
  description: "Peer-to-peer equipment rental built on engineered trust.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${hankenGrotesk.variable} ${geist.variable}`}>
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
