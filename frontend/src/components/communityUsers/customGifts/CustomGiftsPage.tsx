import Image from "next/image";
import { Check, Crown, Package, Search } from "lucide-react";

export type GiftProduct = {
  id: string;
  name: string;
  description: string;
  image: string;
  size: string;
  price: string;
  selected?: boolean;
  quantity?: number;
};

type Props = {
  products: GiftProduct[];
};

const giftBoxSizes = [
  {
    id: "small",
    name: "0.5 KG Gift Box",
    description: "Perfect for sharing the wellness starter gift",
    capacity: "500g",
    selected: true,
  },
  {
    id: "large",
    name: "1 KG Gift Box",
    description: "Ideal for comprehensive wellness journey gifts",
    capacity: "1000g",
    selected: false,
  },
];

export default function CustomGiftsPage({ products }: Props) {
  return (
    <main className="min-h-screen bg-[#F7F7F7] px-4 py-6 lg:px-8">
      <div className="max-w-[620px] space-y-5">
        <header className="rounded-lg border border-[#E8E8E8] bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#06402B]">Customize Your Gift Box</h1>
              <p className="mt-1 text-xs text-[#6B7280]">
                Create a personalized wellness gift box by choosing the box size and filling it with your preferred ZEWADI products.
              </p>
            </div>
            <span className="inline-flex h-7 w-fit items-center gap-1.5 rounded-md bg-[#A88751] px-3 text-[11px] font-semibold text-white">
              <Crown className="h-3.5 w-3.5" />
              Member Exclusive
            </span>
          </div>
        </header>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-4">
          <h2 className="text-sm font-bold text-[#06402B]">Choose Your Gift Box Size</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {giftBoxSizes.map((box) => (
              <article
                key={box.id}
                className={`rounded-md border p-4 ${
                  box.selected ? "border-[#A88751] bg-[#FBF8F1]" : "border-[#DADDE1] bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${
                      box.selected ? "bg-[#A88751] text-white" : "bg-[#E5E7EB] text-[#6B7280]"
                    }`}
                  >
                    <Package className="h-4 w-4" />
                  </span>
                  <span
                    className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                      box.selected ? "border-[#A88751] bg-[#A88751] text-white" : "border-[#D1D5DB] text-transparent"
                    }`}
                  >
                    <Check className="h-2.5 w-2.5" />
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#111827]">{box.name}</h3>
                <p className="mt-1 min-h-8 text-xs leading-4 text-[#6B7280]">{box.description}</p>
                <p className="mt-4 text-[11px] font-medium text-[#6B7280]">Capacity: {box.capacity}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-4">
          <h2 className="text-sm font-bold text-[#06402B]">Box Capacity</h2>
          <div className="mt-4 flex items-center justify-between text-[11px] text-[#6B7280]">
            <span>Used: 300g</span>
            <span>Remaining: 700g</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[#E5E7EB]">
            <div className="h-2 w-[30%] rounded-full bg-[#A88751]" />
          </div>
          <p className="mt-4 text-[11px] text-[#6B7280]">You can still add 700g to your gift box</p>
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-4">
          <h2 className="text-sm font-bold text-[#06402B]">Select Products</h2>
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search product"
              className="h-9 w-full rounded-full border border-[#E5E7EB] bg-[#F3F4F6] pl-9 pr-3 text-xs outline-none focus:border-[#06402B]"
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className={`rounded-md border bg-white p-3 ${product.selected ? "border-[#A88751]" : "border-[#E5E7EB]"}`}
              >
                <div className="relative h-24 overflow-hidden rounded-md bg-[#F3F4F6]">
                  <Image src={product.image} alt={product.name} fill sizes="160px" className="object-cover" />
                </div>
                <h3 className="mt-3 text-xs font-bold text-[#06402B]">{product.name}</h3>
                <p className="mt-1 min-h-8 text-[11px] leading-4 text-[#6B7280]">{product.description}</p>
                <div className="mt-2 flex items-center gap-2 text-[10px]">
                  <span className="rounded bg-[#F3F4F6] px-2 py-1 text-[#6B7280]">{product.size}</span>
                  <span className="rounded bg-[#E8F2ED] px-2 py-1 text-[#06402B]">{product.price}</span>
                </div>
                {product.selected ? (
                  <div className="mt-3 flex h-8 items-center justify-between rounded-md border border-[#A88751] bg-[#E9DFCC] px-3 text-[11px] font-semibold text-[#06402B]">
                    <span>-</span>
                    <span>Added ({product.quantity ?? 1})</span>
                    <span>+</span>
                  </div>
                ) : (
                  <button className="mt-3 h-8 w-full rounded-md bg-[#06402B] text-[11px] font-semibold text-white hover:bg-[#053020]">
                    Add to Box
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-4">
          <h2 className="text-sm font-bold text-[#06402B]">Personal Message</h2>
          <textarea
            placeholder="Write a heartfelt message for your gift recipient..."
            className="mt-3 h-20 w-full resize-none rounded-md border border-[#E5E7EB] p-3 text-xs outline-none focus:border-[#06402B]"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {["Wellness wishes", "Happy Birthday", "Thank you"].map((tag) => (
              <span key={tag} className="rounded-full bg-[#E9DFCC] px-3 py-1 text-[10px] font-medium text-[#A88751]">
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-4">
          <h2 className="text-sm font-bold text-[#06402B]">Recipient Details</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-[11px] font-semibold text-[#06402B]">
              Recipient Name
              <input
                type="text"
                placeholder="Enter recipient name"
                className="mt-1 h-9 w-full rounded-md border border-[#E5E7EB] px-3 text-xs font-normal text-[#111827] outline-none focus:border-[#06402B]"
              />
            </label>
            <label className="text-[11px] font-semibold text-[#06402B]">
              Phone Number
              <input
                type="tel"
                placeholder="Enter phone number"
                className="mt-1 h-9 w-full rounded-md border border-[#E5E7EB] px-3 text-xs font-normal text-[#111827] outline-none focus:border-[#06402B]"
              />
            </label>
          </div>
          <label className="mt-3 block text-[11px] font-semibold text-[#06402B]">
            Delivery Address
            <input
              type="text"
              placeholder="Enter complete delivery address"
              className="mt-1 h-11 w-full rounded-md border border-[#E5E7EB] px-3 text-xs font-normal text-[#111827] outline-none focus:border-[#06402B]"
            />
          </label>
          <label className="mt-3 block max-w-[280px] text-[11px] font-semibold text-[#06402B]">
            Occasion
            <select className="mt-1 h-10 w-full rounded-md border border-[#E5E7EB] bg-[#F3F4F6] px-3 text-xs font-normal text-[#6B7280] outline-none focus:border-[#06402B]">
              <option>Birthday</option>
              <option>Thank You</option>
              <option>Wellness Gift</option>
            </select>
          </label>
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <button className="h-10 rounded-md bg-[#06402B] text-xs font-semibold text-white hover:bg-[#053020]">
            Continue to Checkout
          </button>
          <button className="h-10 rounded-md bg-[#A88751] text-xs font-semibold text-white hover:bg-[#8E7346]">
            Save Gift Box
          </button>
        </div>
      </div>
    </main>
  );
}
