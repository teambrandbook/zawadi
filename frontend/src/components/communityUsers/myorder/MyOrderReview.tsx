"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Leaf, MessageSquareText, ShieldCheck, Star, Trash2, UploadCloud } from "lucide-react";
import { myorders } from "../../../../lib/datafile";

type Props = {
  orderDataId: string;
};

type DraftPayload = {
  rating: number;
  title: string;
  comment: string;
  favoritePart: string;
  wellnessExperience: string;
  recommend: "yes" | "no" | null;
  selectedTags: string[];
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

const quickFeedbackTags = [
  "Great Taste",
  "Easy to Use",
  "Healthy Choice",
  "Good Packaging",
  "Worth Buying",
  "High Quality",
  "Wellness Friendly",
  "Good for Recipes",
];

const writingTips = [
  "Mention how you used the product in your wellness routine",
  "Share any recipes or cooking methods you tried",
  "Describe any health benefits you experienced",
];

const recentReviews = [
  '"Perfect for my morning porridge routine. Great quality and taste!"',
  '"Excellent for gluten-free baking. My energy levels improved significantly."',
];

function readDraftPayload(draftKey: string): DraftPayload | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(draftKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as DraftPayload;
  } catch {
    return null;
  }
}

export default function MyOrderReview({ orderDataId }: Props) {
  const router = useRouter();
  const draftKey = `myorder-review-${orderDataId}`;
  const initialDraft = readDraftPayload(draftKey);

  const [rating, setRating] = useState(initialDraft?.rating ?? 0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [title, setTitle] = useState(initialDraft?.title ?? "");
  const [comment, setComment] = useState(initialDraft?.comment ?? "");
  const [favoritePart, setFavoritePart] = useState(initialDraft?.favoritePart ?? "");
  const [wellnessExperience, setWellnessExperience] = useState(initialDraft?.wellnessExperience ?? "");
  const [recommend, setRecommend] = useState<"yes" | "no" | null>(initialDraft?.recommend ?? null);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialDraft?.selectedTags ?? []);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [statusMessage, setStatusMessage] = useState(
    initialDraft ? "Draft loaded." : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const order = useMemo(() => {
    return myorders.find((item) => item.id === orderDataId) ?? null;
  }, [orderDataId]);

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
    setFavoritePart("");
    setWellnessExperience("");
    setRecommend(null);
    setSelectedTags([]);
    uploadedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setUploadedImages([]);
    setStatusMessage("Form cleared.");
  }

  function saveDraft() {
    const payload: DraftPayload = {
      rating,
      title,
      comment,
      favoritePart,
      wellnessExperience,
      recommend,
      selectedTags,
    };
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

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
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
    <section className="mx-auto max-w-[1120px] px-4 py-8 lg:px-6">
      <div className="mb-5">
        {/* <button
          onClick={() => router.push("/communityDashBorde/myorders")}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0A4833] hover:text-[#083B2A]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Orders
        </button> */}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="space-y-6">
          <article className="rounded-xl border border-[#DFDFDF] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <h1 className="text-2xl font-bold text-[#0A4833]">Write Your Review</h1>
            <p className="mt-1 text-sm text-[#7B6A4C]">
              Share your honest experience with ZEWADI Buckwheat and help the community make informed choices.
            </p>

            <div className="mt-6 flex flex-col gap-4 rounded-xl border border-[#EEE8DB] bg-[#FFFEFC] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-[#EBE1CF]">
                  <Image src={order.image} alt={order.title} fill className="object-cover" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#0A4833]">Premium Organic Buckwheat</h2>
                  <p className="text-sm text-[#7B6A4C]">1kg Pack • Whole Grain</p>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Order ID: {order.orderId}
                    <br />
                    Delivered: {order.orderDate}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#E9F8EE] px-3 py-1 text-[#166534]">
                  <ShieldCheck className="h-4 w-4" />
                  Verified Purchase
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF7F1] px-3 py-1 text-[#0A4833]">
                  <Leaf className="h-4 w-4" />
                  Deliver
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#F0ECE2] pt-6">
              <h3 className="text-base font-semibold text-[#0A4833]">Overall Rating</h3>
              <div className="mt-3 flex flex-wrap items-center gap-3">
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
                        className="rounded-md p-0.5"
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`h-6 w-6 ${active ? "fill-[#B48745] text-[#B48745]" : "text-[#D1D5DB]"}`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-base font-medium text-[#0A4833]">
                  {visibleRating > 0 ? ratingLabels[visibleRating] : "Tap to rate"}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#7B6A4C]">
                {Object.entries(ratingLabels).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(Number(value))}
                    className={rating === Number(value) ? "font-semibold text-[#0A4833]" : ""}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-[#F0ECE2] pt-6">
              <h3 className="text-base font-semibold text-[#0A4833]">Your Review</h3>
              <div className="mt-4 space-y-5">
                <div>
                  <label htmlFor="review-title" className="mb-2 block text-xs font-medium text-[#7B6A4C]">
                    Review Title
                  </label>
                  <input
                    id="review-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Give your review a helpful title"
                    className="h-11 w-full rounded-lg border border-[#DFDFDF] bg-white px-3 text-sm text-[#0A4833] outline-none focus:border-[#0A4833]"
                  />
                </div>

                <div>
                  <label htmlFor="review-comment" className="mb-2 block text-xs font-medium text-[#7B6A4C]">
                    Detailed Feedback
                  </label>
                  <textarea
                    id="review-comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={4}
                    placeholder="Tell us about your experience with this product..."
                    className="w-full rounded-lg border border-[#DFDFDF] bg-white p-3 text-sm text-[#0A4833] outline-none focus:border-[#0A4833]"
                  />
                </div>

                <div>
                  <label htmlFor="favorite-part" className="mb-2 block text-xs font-medium text-[#7B6A4C]">
                    What did you like most?
                  </label>
                  <textarea
                    id="favorite-part"
                    value={favoritePart}
                    onChange={(event) => setFavoritePart(event.target.value)}
                    rows={3}
                    placeholder="Share the highlights of your experience..."
                    className="w-full rounded-lg border border-[#DFDFDF] bg-white p-3 text-sm text-[#0A4833] outline-none focus:border-[#0A4833]"
                  />
                </div>

                <div>
                  <label htmlFor="wellness-experience" className="mb-2 block text-xs font-medium text-[#7B6A4C]">
                    Health &amp; Wellness Experience
                  </label>
                  <textarea
                    id="wellness-experience"
                    value={wellnessExperience}
                    onChange={(event) => setWellnessExperience(event.target.value)}
                    rows={3}
                    placeholder="How did this product support your wellness journey?"
                    className="w-full rounded-lg border border-[#DFDFDF] bg-white p-3 text-sm text-[#0A4833] outline-none focus:border-[#0A4833]"
                  />
                </div>

                <div className="rounded-lg bg-[#EFE5D4] px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#0A4833]">Would you recommend this product?</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRecommend((prev) => (prev === "yes" ? "no" : "yes"))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        recommend === "yes" ? "bg-[#0A4833]" : "bg-[#B8B8B8]"
                      }`}
                      aria-pressed={recommend === "yes"}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          recommend === "yes" ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#F0ECE2] pt-6">
              <h3 className="text-base font-semibold text-[#0A4833]">Quick Feedback</h3>
              <p className="mt-1 text-xs text-[#7B6A4C]">Select tags that describe your experience</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {quickFeedbackTags.map((tag) => {
                  const active = selectedTags.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? "border-[#B48745] bg-[#F2E7D5] text-[#A26C1D]"
                          : "border-[#DFDFDF] bg-white text-[#7B6A4C] hover:bg-[#F8F4EC]"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 border-t border-[#F0ECE2] pt-6">
              <h3 className="text-base font-semibold text-[#0A4833]">Add Photos (Optional)</h3>
              <label className="mt-4 flex min-h-[132px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#DFDFDF] bg-white px-6 text-center hover:bg-[#FCFBF8]">
                <UploadCloud className="h-7 w-7 text-[#A1A1AA]" />
                <p className="mt-3 text-sm text-[#4B5563]">Drag and drop photos here, or click to browse</p>
                <p className="mt-1 text-xs text-[#9CA3AF]">Share photos of the product, packaging, or recipes you made</p>
                <span className="sr-only">Upload product photos</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={onFileChange} />
              </label>

              {uploadedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative overflow-hidden rounded-lg border border-[#DFDFDF]">
                      <div className="relative h-24 w-full">
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

            <div className="mt-8 flex flex-wrap gap-3 border-t border-[#F0ECE2] pt-6">
              <button
                type="button"
                onClick={submitReview}
                disabled={isSubmitting}
                className="inline-flex h-11 min-w-[160px] items-center justify-center gap-2 rounded-lg bg-[#0A4833] px-5 text-sm font-medium text-white hover:bg-[#083B2A] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <MessageSquareText className="h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={saveDraft}
                className="h-11 rounded-lg border border-[#DFDFDF] bg-white px-5 text-sm font-medium text-[#0A4833] hover:bg-[#FAFAFA]"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="h-11 rounded-lg border border-[#DFDFDF] bg-white px-5 text-sm font-medium text-[#374151] hover:bg-[#FAFAFA]"
              >
                Preview
              </button>
            </div>

            {statusMessage && <p className="mt-4 text-sm text-[#7B6A4C]">{statusMessage}</p>}
          </article>
        </div>

        <aside className="space-y-5">
          <section className="rounded-xl border border-[#DFDFDF] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="text-base font-semibold text-[#0A4833]">Community Guidelines</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#7B6A4C]">
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#B48745]" />
                Keep your feedback honest, respectful, and experience-based
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#B48745]" />
                Your review helps other community members choose better wellness products
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#B48745]" />
                Focus on product quality, taste, and health benefits
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-[#DFDFDF] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="text-base font-semibold text-[#0A4833]">Writing Tips</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#7B6A4C]">
              {writingTips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#B48745]" />
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-[#DFDFDF] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="text-base font-semibold text-[#0A4833]">Recent Community Reviews</h2>
            <div className="mt-4 space-y-4">
              {recentReviews.map((review) => (
                <article key={review} className="rounded-lg border border-[#F0ECE2] bg-[#FFFEFC] p-3">
                  <div className="mb-2 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-3.5 w-3.5 fill-[#B48745] text-[#B48745]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#7B6A4C]">{review}</p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
