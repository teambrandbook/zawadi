# Group 5 — Frontend Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all hardcoded localhost fallbacks from component files, centralise the API base URL in a single config file, fix image URL handling with a reusable utility, add production hostname to Next.js image config, and ensure global error boundaries are properly wired.

**Architecture:** A new `frontend/src/lib/config.ts` exports `API_BASE_URL`. A `getImageUrl()` utility in `utils.ts` replaces the fragile localhost rewrite in Navbar. All 20+ files with `|| "http://localhost:8000/api"` are updated to import from config. The existing `global-error.tsx` is audited and a reusable `ErrorBoundary` component is added around key data sections.

**Tech Stack:** Next.js 16, TypeScript, React, Tailwind CSS

---

## File Map

| Action | File |
|--------|------|
| Create | `frontend/src/lib/config.ts` |
| Modify | `frontend/src/lib/utils.ts` |
| Modify | `frontend/src/services/api.js` |
| Modify | 20+ component files (listed in Task 3) |
| Create | `frontend/src/components/shared/ErrorBoundary.tsx` |
| Modify | `frontend/src/app/global-error.tsx` |
| Modify | `frontend/next.config.ts` |

---

### Task 1: Create central API config

**Files:**
- Create: `frontend/src/lib/config.ts`

- [ ] **Step 1: Create config.ts**

Create `frontend/src/lib/config.ts`:

```ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

if (!API_BASE_URL && typeof window !== "undefined") {
  console.error(
    "[Zawadi] NEXT_PUBLIC_API_URL is not set. API calls will fail. " +
    "Add NEXT_PUBLIC_API_URL to your .env.local file."
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/lib/config.ts
git commit -m "feat: add central API_BASE_URL config to src/lib/config.ts"
```

---

### Task 2: Add getImageUrl utility

**Files:**
- Modify: `frontend/src/lib/utils.ts`

- [ ] **Step 1: Add getImageUrl to utils.ts**

Open `frontend/src/lib/utils.ts`. The file currently only has `cn()`. Add `getImageUrl` at the bottom:

```ts
import { API_BASE_URL } from "./config";

/**
 * Returns an absolute URL for a backend media path.
 * Handles null/undefined, already-absolute URLs, and relative paths.
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = API_BASE_URL.replace(/\/api$/, ""); // strip /api suffix if present
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/lib/utils.ts
git commit -m "feat: add getImageUrl utility to centralise backend media URL handling"
```

---

### Task 3: Remove hardcoded localhost fallbacks from all component files

The `api.js` file already uses `process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"`. That fallback is intentional in `api.js` only — the build-time guard added in Group 1 ensures the env var is set during builds. The fallback in individual component files (outside api.js) is the problem — these bypass the central axios instance and directly construct URLs.

- [ ] **Step 1: Find all files with the hardcoded fallback**

```bash
grep -r 'localhost:8000' frontend/src/ --include="*.tsx" --include="*.ts" --include="*.js" -l
```

List every file returned. For each file, check if it is doing `process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000..."`.

- [ ] **Step 2: Replace fallbacks with API_BASE_URL import**

For each file found in Step 1 that is NOT `frontend/src/services/api.js`:

Replace any pattern like:
```ts
const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
// or
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
```

With:
```ts
import { API_BASE_URL as apiBase } from "@/lib/config";
```

And remove the variable declaration entirely (just use `apiBase` from the import directly, or rename the import to match the existing variable name so no other lines need changing).

If the file uses the base URL to construct an image src (e.g., `${apiBase}/media/...`), replace with `getImageUrl()` from `@/lib/utils`:
```ts
import { getImageUrl } from "@/lib/utils";
// ...
<img src={getImageUrl(user.photo)} alt="profile" />
```

- [ ] **Step 3: Fix the Navbar image URL rewrite (the fragile localhost rewrite)**

Open the community Navbar file (identified in Group 3 Task 5 Step 1). Find the block at lines 87–92 that rewrites localhost image URLs:

```ts
// Current fragile code — find the exact lines, they look like:
const imageUrl = photo?.startsWith("http://localhost")
  ? photo.replace("http://localhost:8000", apiOrigin)
  : photo;
```

Replace with:
```ts
import { getImageUrl } from "@/lib/utils";
// ...
const imageUrl = getImageUrl(photo);
```

- [ ] **Step 4: Verify no localhost:8000 strings remain in component files**

```bash
grep -r 'localhost:8000' frontend/src/ --include="*.tsx" --include="*.ts" -l | grep -v "api.js"
```

Expected: no output (no files found).

- [ ] **Step 5: Run lint and build**

```bash
cd frontend
npm run lint
npm run build
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/
git commit -m "fix: remove hardcoded localhost fallbacks from component files, use central API_BASE_URL"
```

---

### Task 4: Add error boundaries

**Files:**
- Create: `frontend/src/components/shared/ErrorBoundary.tsx`
- Modify: `frontend/src/app/global-error.tsx`

- [ ] **Step 1: Create a reusable ErrorBoundary component**

Create `frontend/src/components/shared/ErrorBoundary.tsx`:

```tsx
"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 text-sm">Something went wrong.</p>
            <button
              className="mt-3 text-sm text-green-800 hover:underline"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

- [ ] **Step 2: Audit global-error.tsx**

Read the current `frontend/src/app/global-error.tsx`. It should look like:

```tsx
"use client";

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
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Something went wrong</h2>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  );
}
```

If it exists but is empty or missing the `reset` button, replace with the above content. If the file has this structure already, no change needed.

- [ ] **Step 3: Wrap order list with ErrorBoundary**

Find the order list page or component. Search:
```bash
grep -r "OrderList\|orderplaced\|order.*list" frontend/src/ --include="*.tsx" -l | head -5
```

In that component's JSX, wrap the order list section:
```tsx
import ErrorBoundary from "@/components/shared/ErrorBoundary";

// In JSX:
<ErrorBoundary>
  {/* existing order list JSX */}
</ErrorBoundary>
```

- [ ] **Step 4: Wrap notification panel with ErrorBoundary**

In the community Navbar (or wherever NotificationDropdown is rendered), wrap:
```tsx
import ErrorBoundary from "@/components/shared/ErrorBoundary";

// In JSX, around the bell button and dropdown:
<ErrorBoundary fallback={null}>
  {/* bell button + NotificationDropdown */}
</ErrorBoundary>
```

- [ ] **Step 5: Run lint**

```bash
cd frontend
npm run lint
```

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/shared/ErrorBoundary.tsx frontend/src/app/global-error.tsx frontend/src/
git commit -m "feat: add reusable ErrorBoundary, wrap order list and notification panel"
```

---

### Task 5: Add production hostname to Next.js image config

The `next.config.ts` already has `https://**` as a pattern. This covers all HTTPS production domains. However, if the staging API is on HTTP (not HTTPS), images won't load. This task ensures the staging API hostname is covered.

**Files:**
- Modify: `frontend/next.config.ts`

- [ ] **Step 1: Add staging API hostname to remotePatterns if needed**

If the staging API will use HTTP (not HTTPS), add the staging hostname explicitly. Open `frontend/next.config.ts` and update `images.remotePatterns`:

```ts
images: {
  remotePatterns: [
    { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
    { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
    // Add your staging API hostname here if it uses HTTP:
    // { protocol: "http", hostname: "your-staging-ip", port: "8000", pathname: "/media/**" },
    { protocol: "https", hostname: "**", pathname: "/media/**" },
  ],
},
```

If staging uses HTTPS, the existing `https://**` already covers it — no change needed.

- [ ] **Step 2: Commit if changed**

```bash
git add frontend/next.config.ts
git commit -m "config: update Next.js image remotePatterns for staging/production hostname"
```

---

## Final Verification

```bash
cd frontend

# Build must succeed
NEXT_PUBLIC_API_URL=http://localhost:8000/api npm run build

# No localhost strings in component files
grep -r 'localhost:8000' src/ --include="*.tsx" --include="*.ts" -l | grep -v api.js

# No TypeScript errors
npx tsc --noEmit

# Lint passes
npm run lint
```

All four commands should complete without errors or output.
