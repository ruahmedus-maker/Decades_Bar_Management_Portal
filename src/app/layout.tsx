import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // This should be imported

const inter = Inter({ 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Decades Bar Training Portal",
  description: "Training & Procedures Portal for Decades Bar Staff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}