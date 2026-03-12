'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <h2 className="mb-4 text-2xl font-bold">A critical error occurred.</h2>
        <p className="mb-8 text-neutral-600 dark:text-neutral-400">
          We apologize for the inconvenience. Our team has been notified.
        </p>
        <button
          onClick={() => reset()}
          className="rounded-md bg-rose-600 px-4 py-2 font-medium text-white transition-colors hover:bg-rose-700"
        >
          Recover Application
        </button>
      </body>
    </html>
  );
}
