import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PAKMED OS",
  description: "Next-Generation Medical Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
