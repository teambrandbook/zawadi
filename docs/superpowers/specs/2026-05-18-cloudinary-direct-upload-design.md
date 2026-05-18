# Cloudinary Direct Upload — Design Spec

**Date:** 2026-05-18  
**Status:** Approved  
**Branch target:** main  

---

## Problem

The zawadi project currently stores all uploaded images on the local Django filesystem (`MEDIA_ROOT`). This breaks on Dokploy/VPS deployments where containers have no persistent disk. As the platform scales to many concurrent users, routing file bytes through the Django server also creates a memory and bandwidth bottleneck.

---

## Solution

Replace local file storage with **Cloudinary direct upload**. The browser uploads images straight to Cloudinary's CDN — the Django server only issues signed upload tokens and stores the resulting URL string. The server never handles file bytes.

---

## Scope

### In scope
- 5 image upload points: User profile photo, Product image, Blog cover, Recipe cover, Event cover
- New backend signing endpoint
- Reusable frontend upload hook
- Model field change: `ImageField` → `URLField` for all 5 fields
- Serializer updates to accept URL strings instead of file uploads
- Cloudinary account setup guidance (already documented above)

### Out of scope
- Migration of existing local images (fresh start; old local files are discarded)
- Static files (`STATIC_ROOT`) — unaffected
- Video or non-image file uploads
- Cloudinary image transformations beyond auto-quality/auto-format

---

## Architecture

```
User Browser
    │
    ├─[1]─ User selects image file in UI component
    │
    ├─[2]─ GET /api/account/upload-signature/?type=product_image
    │           Django validates: is authenticated + has permission for this type
    │           Returns: { signature, timestamp, api_key, cloud_name, folder }
    │
    ├─[3]─ POST https://api.cloudinary.com/v1_1/{cloud_name}/image/upload
    │           Payload: { file, signature, timestamp, api_key, folder, upload_preset }
    │           Cloudinary validates signature, stores image, returns secure_url
    │
    └─[4]─ Existing API call (POST/PATCH) with secure_url as the image field value
               Django stores the URL string in the URLField
```

The Django server handles **[2]** and **[4]** only — small JSON payloads. Cloudinary handles **[3]** — the heavy file transfer.

---

## Backend

### New endpoint: `GET /api/account/upload-signature/`

**Location:** `accounts` app — new view + URL  
**Auth:** Required (`IsAuthenticated`)  
**Query param:** `?type=` — one of: `product_image`, `blog_cover`, `recipe_cover`, `event_cover`, `profile_photo`

**Permission matrix:**

| Upload type     | Admin | Internal Staff | Consultant | Community User |
|----------------|-------|----------------|------------|----------------|
| `product_image` | ✓     | ✓              | ✗          | ✗              |
| `blog_cover`    | ✓     | ✓              | ✗          | ✓              |
| `event_cover`   | ✓     | ✓              | ✗          | ✗              |
| `recipe_cover`  | ✓     | ✓              | ✗          | ✗              |
| `profile_photo` | ✓     | ✓              | ✓          | ✓              |

**Response (200):**
```json
{
  "signature": "abc123...",
  "timestamp": 1716000000,
  "api_key": "123456789012345",
  "cloud_name": "your-cloud-name",
  "folder": "zawadi/products"
}
```

**Error responses:**
- `401` — not authenticated
- `403` — role not permitted for this upload type
- `400` — missing or invalid `?type=` param

**Signing logic:**
```python
import cloudinary
import time
import hashlib

timestamp = int(time.time())
folder = FOLDER_MAP[upload_type]
params_to_sign = f"folder={folder}&timestamp={timestamp}"
signature = hashlib.sha1(
    (params_to_sign + settings.CLOUDINARY_API_SECRET).encode()
).hexdigest()
```

### Model changes

All 5 `ImageField` → `URLField(blank=True, null=True)`. No `upload_to` needed.

| App | Model | Field | Change |
|-----|-------|-------|--------|
| `accounts` | `User` | `photo` | `ImageField` → `URLField` |
| `product` | `Product` | `image` | `ImageField` → `URLField` |
| `blog` | `Blog` | `cover_image` | `ImageField` → `URLField` |
| `recipes` | `Recipe` | `cover_image` | `ImageField` → `URLField` |
| `events` | `Event` | `cover_image` | `ImageField` → `URLField` |

Each change requires a new migration per app.

### Serializer changes

- Remove `validate_image_upload` from all 5 serializers — Cloudinary's upload preset enforces format and size limits
- Change image fields from `ImageField(validators=[...])` → `URLField(required=False, allow_blank=True, allow_null=True)`
- Remove `request.build_absolute_uri()` calls for image URLs — Cloudinary URLs are already absolute (`https://res.cloudinary.com/...`)

### Settings additions

```python
# settings.py
CLOUDINARY_CLOUD_NAME = env("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = env("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = env("CLOUDINARY_API_SECRET")
CLOUDINARY_UPLOAD_PRESET = env("CLOUDINARY_UPLOAD_PRESET", default="zawadi_uploads")
```

### URL registration

```python
# accounts/urls.py
path("upload-signature/", UploadSignatureView.as_view(), name="upload-signature"),
```

Final route: `/api/account/upload-signature/`

### Dependencies

Add to `requirements.txt`:
```
cloudinary>=1.36.0
```

Only used for signature generation — not as a storage backend.

---

## Frontend

### New hook: `src/hooks/useCloudinaryUpload.ts`

Single reusable hook used by all 5 upload components.

**Interface:**
```ts
type UploadType =
  | "product_image"
  | "blog_cover"
  | "recipe_cover"
  | "event_cover"
  | "profile_photo";

function useCloudinaryUpload(uploadType: UploadType): {
  upload: (file: File) => Promise<string>;  // resolves to secure_url
  isUploading: boolean;
  error: string | null;
  reset: () => void;
}
```

**Hook flow:**
1. Call `GET /api/account/upload-signature/?type={uploadType}` — get signature params
2. Build `FormData` with `{ file, signature, timestamp, api_key, folder, upload_preset }`
3. POST to `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`
4. Return `response.secure_url`

**Error handling:**
- Backend 401/403 → surface as "You don't have permission to upload this image type"
- Cloudinary error → surface as "Upload failed, please try again"
- Network error → surface as "Connection error, please check your internet"

### Environment variables (frontend)

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=zawadi_uploads
```

### Components to update

All 5 components keep their **existing UI** (drag-drop, preview, file input). Only the submit/upload logic changes.

| Component | Upload type | Change |
|-----------|------------|--------|
| `AddProductForm.tsx` | `product_image` | Replace `fd.append("image", file)` with `useCloudinaryUpload("product_image")`, pass URL to API |
| `BlogCoverImage.tsx` | `blog_cover` | Replace file state with hook, expose URL to parent form |
| Recipe upload component | `recipe_cover` | Same pattern |
| Event upload component | `event_cover` | Same pattern |
| Profile/Register photo | `profile_photo` | Same pattern |

**Pattern for each component:**
```tsx
const { upload, isUploading, error } = useCloudinaryUpload("product_image");

const handleFileSelect = async (file: File) => {
  const url = await upload(file);    // uploads to Cloudinary
  setImageUrl(url);                  // store URL in form state
  setPreview(url);                   // use Cloudinary URL for preview (replaces URL.createObjectURL)
};

// On form submit: send imageUrl string to your existing Django API
```

---

## Cloudinary Configuration

### Account setup
- Product: **Programmable Media**
- Free tier: 25GB storage + 25GB bandwidth/month

### Upload preset: `zawadi_uploads`
| Setting | Value |
|--------|-------|
| Signing mode | Unsigned (backend adds signature) |
| Folder | `zawadi` |
| Allowed formats | `jpg, jpeg, png, webp, gif` |
| Max file size | `5242880` (5MB) |
| Quality | `auto` |
| Fetch format | `auto` (serves WebP where supported) |

### Folder structure (auto-created on first upload)
```
zawadi/
├── products/
├── blogs/
├── events/
├── recipes/
└── profiles/
```

---

## Migration Plan

1. Create Cloudinary account + upload preset (manual step)
2. Add env vars to `.env` and `.env.local`
3. Backend: add `cloudinary` dependency → signing endpoint → model migrations → serializer updates
4. Frontend: implement `useCloudinaryUpload` hook → update 5 components
5. Deploy to Dokploy with new env vars set
6. Verify each upload type works end-to-end in production

Existing local images in `media/` are discarded — no migration needed.

---

## What Does NOT Change

- All existing API routes and payloads (only the image field value changes from a file to a URL string)
- Frontend UI components (drag-drop, previews, buttons)
- Auth/JWT system
- Static files
- All non-image functionality
