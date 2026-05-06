"use client";

export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center">
          <div>
            <h1 className="text-2xl font-semibold text-[#0A4833]">Something went wrong</h1>
            <p className="mt-2 text-sm text-[#4B5563]">Please refresh the page or try again later.</p>
          </div>
        </main>
      </body>
    </html>
  );
}
