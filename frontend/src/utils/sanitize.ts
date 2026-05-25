import DOMPurify from "isomorphic-dompurify";

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["br", "em", "strong", "span", "wbr"],
    ALLOWED_ATTR: ["class"],
  });
}
