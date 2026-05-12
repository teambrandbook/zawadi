export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

if (!API_BASE_URL && typeof window !== "undefined") {
  console.error(
    "[Zawadi] NEXT_PUBLIC_API_URL is not set. API calls will fail. " +
    "Add NEXT_PUBLIC_API_URL to your .env.local file."
  );
}
