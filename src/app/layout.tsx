import type { Metadata, Viewport } from "next";
import { Rajdhani } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700']
});

export const viewport: Viewport = {
  themeColor: "#f54029",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "The Utility Company: Pioneering Industrial Automation as a Service (I3AS)",
  description: "Empowering individuals and communities through advanced I3AS solutions.",
  manifest: "/manifest.json",
  icons: {
    icon: "/Medallions/Small/TUC%20(Small).png",
    apple: [
      { url: "/Medallions/Small/TUC%20(Small).png" },
      { url: "/Medallions/Small/TUC%20(Small).png", sizes: "180x180" }
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TUC",
  },
  openGraph: {
    title: "The Utility Company: Pioneering Industrial Automation as a Service (I3AS)",
    description:
      "The Utility Company is at the forefront of leveraging industrial automation with a Web3 architecture. Through its subsidiaries, The Utility Company provides a range of automated solutions from renewable energy and biomedical research to smart contract auditing. Each subsidiary operates with the mission of fostering self-reliance and enabling a sustainable, automated future.",
    type: "website",
    url: "https://www.theutilitycompany.co",
    images: [
      {
        url: "https://storage.googleapis.com/tgl_cdn/images/tucbanner.png",
        width: 1200,
        height: 630,
        alt: "The Utility Company Banner",
      },
    ],
    locale: "en_US",
    siteName: "The Utility Company",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Utility Company: Leading the Industrial Automation Revolution",
    description:
      "Discover the future of industrial automation through The Utility Company's diverse offerings, including renewable energy, biomedical advancements, and smart contract auditing. With Web3-driven solutions, The Utility Company empowers individuals and communities to create more than they consume.",
    images: [
      {
        url: "https://storage.googleapis.com/tgl_cdn/images/tucbanner.png",
        alt: "The Utility Company Banner",
      },
    ],
  },
  other: {
    "instapp:content": "website",
    "instapp:like": "true",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={rajdhani.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}
