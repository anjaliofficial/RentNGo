import "./globals.css";

import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "RentNGo",
  description: "Secure Equipment Rental Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        <Toaster position="top-right" />
      </body>
    </html>
  );
}