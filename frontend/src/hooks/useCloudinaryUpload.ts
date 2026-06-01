"use client";
import { useState } from "react";
import api from "@/services/api";

export type UploadType =
  | "product_image"
  | "blog_cover"
  | "recipe_cover"
  | "event_cover"
  | "profile_photo";

interface SignatureResponse {
  signature: string;
  timestamp: number;
  api_key: string;
  cloud_name: string;
  folder: string;
  allowed_formats: string;
}

export function useCloudinaryUpload(uploadType: UploadType) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => setError(null);

  const upload = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);

    try {
      let data: SignatureResponse;
      try {
        const signatureResponse = await api.get<SignatureResponse>(
          `/account/upload-signature/?type=${uploadType}`
        );
        data = signatureResponse.data;
      } catch (signatureError: unknown) {
        throw signatureError;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", data.signature);
      formData.append("timestamp", String(data.timestamp));
      formData.append("api_key", data.api_key);
      formData.append("folder", data.folder);
      formData.append("allowed_formats", data.allowed_formats);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${data.cloud_name}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody?.error?.message || "Cloudinary upload failed");
      }

      const result = await response.json();
      return result.secure_url as string;
    } catch (err: unknown) {
      const axiosStatus = (err as { response?: { status?: number } })?.response
        ?.status;
      const originalMessage = err instanceof Error ? err.message : "";
      const message =
        axiosStatus === 403
          ? "You don't have permission to upload this image type"
          : axiosStatus === 401
          ? "Please log in to upload images"
          : axiosStatus === 503
          ? "Cloudinary is not configured on this server"
          : originalMessage || "Upload failed, please try again";
      setError(message);
      throw new Error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error, reset };
}
