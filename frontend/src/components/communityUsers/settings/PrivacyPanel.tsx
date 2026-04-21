import {
  Check,
  Download,
  Eye,
  FileText,
  Globe,
  Heart,
  Lock,
  MessageCircle,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  Utensils,
} from "lucide-react";
import type { AccountPrivacyControl, PrivacyChoice, PrivacyToggleItem } from "./settingsTypes";

type Props = {
  profileChoices: PrivacyChoice[];
  selectedProfileVisibility: string;
  blogVisibility: PrivacyToggleItem[];
  recipeVisibility: PrivacyToggleItem[];
  communityInteraction: PrivacyToggleItem[];
  dataConsent: PrivacyToggleItem[];
  accountControls: AccountPrivacyControl[];
  onSelectProfileVisibility: (id: string) => void;
  onToggleBlogVisibility: (id: string) => void;
  onToggleRecipeVisibility: (id: string) => void;
  onToggleCommunityInteraction: (id: string) => void;
  onToggleDataConsent: (id: string) => void;
  onDownloadData: () => void;
  onRestoreDefaults: () => void;
  onSave: () => void;
};

export default function PrivacyPanel({
  profileChoices,
  selectedProfileVisibility,
  blogVisibility,
  recipeVisibility,
  communityInteraction,
  dataConsent,
  accountControls,
  onSelectProfileVisibility,
  onToggleBlogVisibility,
  onToggleRecipeVisibility,
  onToggleCommunityInteraction,
  onToggleDataConsent,
  onDownloadData,
  onRestoreDefaults,
  onSave,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
          <h2 className="inline-flex items-center gap-2 text-lg font-bold text-[#06402B]">
            <UserRound className="h-4 w-4 text-[#06402B]" />
            Profile Visibility
          </h2>
          <div className="mt-4 space-y-3">
            {profileChoices.map((choice) => {
              const selected = selectedProfileVisibility === choice.id;
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => onSelectProfileVisibility(choice.id)}
                  className={`flex w-full items-center justify-between gap-4 rounded-md border p-4 text-left ${
                    selected ? "border-[#A88751] bg-[#F4F1EA]" : "border-[#E5E7EB] bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {choice.id === "public" && <Globe className="mt-0.5 h-4 w-4 text-[#A88751]" />}
                    {choice.id === "community" && <Users className="mt-0.5 h-4 w-4 text-[#9CA3AF]" />}
                    {choice.id === "private" && <Lock className="mt-0.5 h-4 w-4 text-[#9CA3AF]" />}
                    <div>
                      <p className="text-sm font-semibold text-[#06402B]">{choice.title}</p>
                      <p className="mt-1 text-xs text-[#6B7280]">{choice.description}</p>
                    </div>
                  </div>
                  <span className={`h-4 w-4 rounded-full border ${selected ? "border-[#3B82F6] bg-[#3B82F6]" : "border-[#9CA3AF] bg-white"}`} />
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-md bg-[#E9DFCC] p-4 text-sm text-[#6B7280]">
            Your current profile is visible to <span className="font-semibold text-[#06402B]">everyone</span>
          </div>
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
          <h2 className="inline-flex items-center gap-2 text-lg font-bold text-[#06402B]">
            <FileText className="h-4 w-4 text-[#06402B]" />
            Blog Visibility
          </h2>
          <div className="mt-4 space-y-3">
            {blogVisibility.map((item) => (
              <label key={item.id} className="flex items-center justify-between gap-4 rounded-md bg-[#E9DFCC] p-4">
                <span className="inline-flex items-center gap-3 text-sm font-semibold text-[#06402B]">
                  <Eye className="h-4 w-4" />
                  {item.title}
                </span>
                <input type="checkbox" checked={item.enabled} onChange={() => onToggleBlogVisibility(item.id)} className="h-4 w-4 accent-[#3B82F6]" />
              </label>
            ))}
          </div>
          <p className="mt-5 text-sm text-[#6B7280]">
            You have <span className="font-semibold text-[#06402B]">12 public blogs</span> and <span className="font-semibold text-[#06402B]">3 drafts</span>
          </p>
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
          <h2 className="inline-flex items-center gap-2 text-lg font-bold text-[#06402B]">
            <Utensils className="h-4 w-4 text-[#06402B]" />
            Recipe Visibility
          </h2>
          <div className="mt-4 space-y-3">
            {recipeVisibility.map((item) => (
              <label key={item.id} className="flex items-center justify-between gap-4 rounded-md bg-[#E9DFCC] p-4">
                <span className="inline-flex items-center gap-3 text-sm font-semibold text-[#06402B]">
                  <Eye className="h-4 w-4" />
                  {item.title}
                </span>
                <input type="checkbox" checked={item.enabled} onChange={() => onToggleRecipeVisibility(item.id)} className="h-4 w-4 accent-[#3B82F6]" />
              </label>
            ))}
          </div>
          <p className="mt-5 text-sm text-[#6B7280]">
            You have <span className="font-semibold text-[#06402B]">8 approved recipes</span>
          </p>
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
          <h2 className="inline-flex items-center gap-2 text-lg font-bold text-[#06402B]">
            <MessageCircle className="h-4 w-4 text-[#06402B]" />
            Community Interaction
          </h2>
          <div className="mt-4 space-y-3">
            {communityInteraction.map((item) => (
              <label key={item.id} className="flex items-center justify-between gap-4 rounded-md bg-[#E9DFCC] p-4">
                <span className="inline-flex items-center gap-3 text-sm font-semibold text-[#06402B]">
                  <Heart className="h-4 w-4" />
                  {item.title}
                </span>
                <input type="checkbox" checked={item.enabled} onChange={() => onToggleCommunityInteraction(item.id)} className="h-4 w-4 accent-[#3B82F6]" />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
          <h2 className="inline-flex items-center gap-2 text-lg font-bold text-[#06402B]">
            <ShieldCheck className="h-4 w-4 text-[#06402B]" />
            Data &amp; Consent
          </h2>
          <div className="mt-4 space-y-3">
            {dataConsent.map((item) => (
              <label key={item.id} className="flex items-center justify-between gap-4 rounded-md bg-[#E9DFCC] p-4">
                <span className="inline-flex items-center gap-3 text-sm font-semibold text-[#06402B]">
                  <ShieldCheck className="h-4 w-4" />
                  {item.title}
                </span>
                <input type="checkbox" checked={item.enabled} onChange={() => onToggleDataConsent(item.id)} className="h-4 w-4 accent-[#3B82F6]" />
              </label>
            ))}
          </div>
          <div className="mt-3 rounded-md bg-[#E9DFCC] p-4">
            <p className="text-sm font-semibold text-[#06402B]">Wellness Data Privacy</p>
            <p className="mt-2 text-xs leading-5 text-[#6B7280]">
              Your health and wellness data is encrypted and never shared without your explicit consent.
            </p>
          </div>
          <button
            type="button"
            onClick={onDownloadData}
            className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#E8F0EA] text-sm font-semibold text-[#06402B] hover:bg-[#DDE8E0]"
          >
            <Download className="h-4 w-4" />
            Download Personal Data
          </button>
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
          <h2 className="inline-flex items-center gap-2 text-lg font-bold text-[#06402B]">
            <Users className="h-4 w-4 text-[#06402B]" />
            Account Privacy Controls
          </h2>
          <div className="mt-4 space-y-3">
            {accountControls.map((item) => (
              <article key={item.id} className="rounded-md bg-[#E9DFCC] p-4">
                <p className="inline-flex items-center gap-3 text-sm font-semibold text-[#06402B]">
                  {item.id === "search" && <Search className="h-4 w-4" />}
                  {item.id === "email" && <FileText className="h-4 w-4" />}
                  {item.id === "phone" && <Lock className="h-4 w-4" />}
                  {item.title}
                </p>
                <p className="mt-2 text-xs text-[#6B7280]">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="flex flex-wrap justify-end gap-4">
        <button
          type="button"
          onClick={onRestoreDefaults}
          className="h-11 min-w-48 rounded-md border border-[#DFDFDF] bg-white px-6 text-sm font-semibold text-[#06402B] hover:bg-[#F9FAFB]"
        >
          Restore Defaults
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-11 min-w-56 items-center justify-center gap-2 rounded-md bg-[#06402B] px-6 text-sm font-semibold text-white hover:bg-[#053020]"
        >
          <Check className="h-4 w-4" />
          Save Privacy Settings
        </button>
      </div>
    </div>
  );
}
