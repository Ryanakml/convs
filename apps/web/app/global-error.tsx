"use client";

import NextError from "next/error";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html>
      <body>
        {/* Global error boundary - NextError is the default Next.js error page component */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
