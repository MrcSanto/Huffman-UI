import { Geist_Mono } from "next/font/google";
import "./globals.css";

import { EdgeStoreProvider } from "@/lib/edgestore";


const geist_mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ['400', '500', '700'],
  display: 'swap'
});

export const metadata = {
  title: "Huffman Tree Simulator",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className={`${geist_mono.variable} antialiased`}>
        <EdgeStoreProvider>{children}</EdgeStoreProvider>
      </body>
    </html>
  );
}


