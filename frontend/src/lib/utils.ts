import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_BASE_URL } from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder.png";
  const base = API_BASE_URL.replace(/\/api$/, ""); // strip /api suffix if present
  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const imageUrl = new URL(path);
      const apiUrl = new URL(base);
      if (imageUrl.pathname.startsWith("/media/") && imageUrl.origin !== apiUrl.origin) {
        return `${apiUrl.origin}${imageUrl.pathname}${imageUrl.search}`;
      }
    } catch {
      return path;
    }
    return path;
  }
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
