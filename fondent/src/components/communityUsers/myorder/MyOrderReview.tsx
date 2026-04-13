"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ImagePlus, Star, Trash2 } from "lucide-react";
import { myorders } from "../../../../lib/datafile";

type Props = {
  orderDataId: string;
};

type DraftPayload = {
  rating: number;
  title: string;
  comment: string;
  recommend: "yes" | "no" | null;
};

type UploadedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

export default function MyOrderReview({ orderDataId }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [recommend, setRecommend] = useState<"yes" | "no" | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const order = useMemo(() => {
    return myorders.find((item) => item.id === orderDataId) ?? null;
  }, [orderDataId]);

  const draftKey = `myorder-review-${orderDataId}`;

  useEffect(() => {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as DraftPayload;
      setRating(parsed.rating ?? 0);
      setTitle(parsed.title ?? "");
      setComment(parsed.comment ?? "");
      setRecommend(parsed.recommend ?? null);
      setStatusMessage("Draft loaded.");
    } catch {
      setStatusMessage("Could not load draft.");
    }
  }, [draftKey]);

  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, [uploadedImages]);

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const nextImages = Array.from(files).map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setUploadedImages((prev) => [...prev, ...nextImages].slice(0, 4));
    setStatusMessage("Images added.");
    event.target.value = "";
  }

  function removeImage(imageId: string) {
    setUploadedImages((prev) => {
      const imageToDelete = prev.find((item) => item.id === imageId);
      if (imageToDelete) URL.revokeObjectURL(imageToDelete.previewUrl);
      return prev.filter((item) => item.id !== imageId);
    });
    setStatusMessage("Image removed.");
  }

  function resetForm() {
    setRating(0);
    setHoveredStar(0);
    setTitle("");
    setComment("");
    setRecommend(null);
    uploadedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setUploadedImages([]);
    setStatusMessage("Form cleared.");
  }

  function saveDraft() {
    const payload: DraftPayload = { rating, title, comment, recommend };
    localStorage.setItem(draftKey, JSON.stringify(payload));
    setStatusMessage("Draft saved.");
  }

  async function submitReview() {
    if (rating === 0) {
      setStatusMessage("Please select a star rating.");
      return;
    }

    if (comment.trim().length < 10) {
      setStatusMessage("Please enter at least 10 characters in your review.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Submitting review...");

    await new Promise((resolve) => setTimeout(resolve, 600));

    localStorage.removeItem(draftKey);
    setIsSubmitting(false);
    setStatusMessage("Review submitted successfully.");
  }

  if (!order) {
    return (
      <section className="mx-auto max-w-[900px] px-4 py-10">
        <div className="rounded-xl border border-[#DFDFDF] bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-[#0A4833]">Order not found</h1>
          <p className="mt-2 text-sm text-[#7B6A4C]">
            We could not find a matching order for ID: {orderDataId}
          </p>
          <button
            onClick={() => router.push("/communityDashBorde/myorders")}
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#0A4833] px-4 text-sm font-medium text-white hover:bg-[#083B2A]"
          >
            Back to My Orders
          </button>
        </div>
      </section>
    );
  }

  const visibleRating = hoveredStar || rating;

  return (
    <section className="mx-auto max-w-[980px] px-4 py-8 lg:px-6">
      <div className="mb-5">
        <button
          onClick={() => router.push("/communityDashBorde/myorders")}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0A4833] hover:text-[#083B2A]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Orders
        </button>
      </div>

      <div className="space-y-5">
        <article className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-[#EBE1CF]">
              <Image src={order.image} alt={order.title} fill className="object-cover" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-[#0A4833]">{order.title}</h2>
              <p className="text-sm text-[#7B6A4C]">Order ID: {order.orderId}</p>
              <p className="text-sm text-[#7B6A4C]">
                Purchased: {order.orderDate} | Amount: {order.totalAmount}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-6">
          <h3 className="text-xl font-semibold text-[#0A4833]">Write a Review</h3>
          <p className="mt-1 text-sm text-[#7B6A4C]">
            Share your experience. Your feedback helps other buyers.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <p className="mb-2 text-sm font-medium text-[#0A4833]">Your rating</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => {
                  const star = i + 1;
                  const active = star <= visibleRating;

                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setRating(star)}
                      className="rounded-md p-1"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={`h-7 w-7 ${
                          active ? "fill-[#F59E0B] text-[#F59E0B]" : "text-[#D1D5DB]"
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-2 text-sm text-[#7B6A4C]">
                  {visibleRating > 0 ? ratingLabels[visibleRating] : "Tap to rate"}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="review-title" className="mb-2 block text-sm font-medium text-[#0A4833]">
                Review title
              </label>
              <input
                id="review-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Summarize your experience"
                className="h-11 w-full rounded-lg border border-[#DFDFDF] bg-white px-3 text-sm text-[#0A4833] outline-none focus:border-[#0A4833]"
              />
            </div>

            <div>
              <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-[#0A4833]">
                Your review
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={5}
                placeholder="Tell others what you liked, quality, packaging, and delivery..."
                className="w-full rounded-lg border border-[#DFDFDF] bg-white p-3 text-sm text-[#0A4833] outline-none focus:border-[#0A4833]"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-[#0A4833]">Would you recommend this product?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRecommend("yes")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    recommend === "yes"
                      ? "bg-[#0A4833] text-white"
                      : "bg-[#EBE1CF] text-[#0A4833] hover:bg-[#E3D7C2]"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setRecommend("no")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    recommend === "no"
                      ? "bg-[#0A4833] text-white"
                      : "bg-[#EBE1CF] text-[#0A4833] hover:bg-[#E3D7C2]"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-[#0A4833]">Add photos (optional)</p>
              <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#DFDFDF] bg-[#EBE1CF] px-4 text-sm font-medium text-[#0A4833] hover:bg-[#E3D7C2]">
                <ImagePlus className="h-4 w-4" />
                Upload Images
                <input type="file" accept="image/*" multiple className="hidden" onChange={onFileChange} />
              </label>

              {uploadedImages.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative overflow-hidden rounded-lg border border-[#DFDFDF]">
                      <div className="relative h-20 w-full">
                        <Image src={image.previewUrl} alt={image.file.name} fill className="object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#9B1C1C] hover:bg-white"
                        aria-label={`Remove ${image.file.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="h-10 rounded-lg border border-[#DFDFDF] bg-white px-4 text-sm font-medium text-[#0A4833] hover:bg-[#FAFAFA]"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={saveDraft}
              className="h-10 rounded-lg border border-[#DFDFDF] bg-[#EBE1CF] px-4 text-sm font-medium text-[#0A4833] hover:bg-[#E3D7C2]"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={submitReview}
              disabled={isSubmitting}
              className="h-10 rounded-lg bg-[#0A4833] px-4 text-sm font-medium text-white hover:bg-[#083B2A] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>

          {statusMessage && <p className="mt-3 text-sm text-[#7B6A4C]">{statusMessage}</p>}
        </article>
      </div>
    </section>
  );
}
