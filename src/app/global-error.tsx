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
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Global Application Error
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                A critical error occurred. Our team has been notified.
              </p>
              {error.message && (
                <div className="mt-4 p-4 bg-red-50 rounded-md">
                  <p className="text-sm text-red-800">
                    {error.message}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-5">
              <button
                onClick={reset}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset Application
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}