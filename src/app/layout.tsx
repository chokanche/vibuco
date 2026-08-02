import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getRequestContext } from "@/platform/telemetry/request-context";

export const metadata: Metadata = {
  title: {
    default: "Vibuco",
    template: "%s | Vibuco",
  },
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const requestContext = await getRequestContext();

  return (
    <html lang="en" data-request-id={requestContext.requestId}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <style>{`
          .skip-link {
            left: 1rem;
            position: fixed;
            top: 1rem;
            transform: translateY(-200%);
            z-index: 1000;
          }
          .skip-link:focus {
            transform: translateY(0);
          }
        `}</style>
      </body>
    </html>
  );
}
