import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Careers Page Builder",
  description: "Build branded careers pages with jobs browsing",
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="container" id="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
