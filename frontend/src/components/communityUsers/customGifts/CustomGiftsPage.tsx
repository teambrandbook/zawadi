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
    <main className="flex-1 p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="rounded-lg border border-[#E8E8E8] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#06402B]">Customize Your Gift Box</h1>
              <p className="mt-1 text-sm text-gray-500">
                Create a personalized wellness gift box by choosing the box size and filling it with your preferred ZEWADI products.
              </p>
            </div>
            <span className="inline-flex h-8 items-center gap-2 rounded-md bg-[#A88751] px-4 text-xs font-semibold text-white shadow-sm">
              <Crown className="h-4 w-4" />
              Member Exclusive
            </span>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Selections */}
          <div className="flex-1 space-y-6">
            <section className="rounded-lg border border-[#DFDFDF] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#06402B] mb-4">Choose Your Gift Box Size</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {giftBoxSizes.map((box) => (
                  <article
                    key={box.id}
                    className={`rounded-lg border-2 p-5 transition-all cursor-pointer ${
                      box.selected ? "border-[#A88751] bg-[#FBF8F1]" : "border-[#DADDE1] bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                          box.selected ? "bg-[#A88751] text-white" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Package className="h-6 w-6" />
                      </span>
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          box.selected ? "border-[#A88751] bg-[#A88751] text-white" : "border-gray-300 text-transparent"
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                    </div>
                    <h3 className="mt-5 text-base font-bold text-gray-900">{box.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{box.description}</p>
                    <p className="mt-5 text-xs font-semibold text-[#A88751]">Capacity: {box.capacity}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#DFDFDF] bg-white p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-bold text-[#06402B]">Select Products</h2>
                <div className="relative w-full sm:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search product..."
                    className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-[#06402B] focus:ring-1 focus:ring-[#06402B] transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className={`rounded-xl border bg-white p-4 transition-all hover:shadow-md ${
                      product.selected ? "border-[#A88751] ring-1 ring-[#A88751]" : "border-gray-200"
                    }`}
                  >
                    <div className="relative h-40 overflow-hidden rounded-lg bg-gray-50 mb-4">
                      <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">{product.name}</h3>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="rounded-md bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600">{product.size}</span>
                      <span className="rounded-md bg-green-50 px-2 py-1 text-[10px] font-bold text-[#06402B]">{product.price}</span>
                    </div>
                    {product.selected ? (
                      <div className="mt-4 flex h-9 items-center justify-between rounded-lg border border-[#A88751] bg-[#FBF8F1] px-3">
                        <button className="text-[#A88751] hover:bg-[#A88751] hover:text-white rounded w-6 h-6 flex items-center justify-center transition-colors font-bold">-</button>
                        <span className="text-sm font-bold text-[#06402B]">Added ({product.quantity ?? 1})</span>
                        <button className="text-[#A88751] hover:bg-[#A88751] hover:text-white rounded w-6 h-6 flex items-center justify-center transition-colors font-bold">+</button>
                      </div>
                    ) : (
                      <button className="mt-4 h-9 w-full rounded-lg bg-[#06402B] text-sm font-semibold text-white hover:bg-[#053020] transition-colors shadow-sm">
                        Add to Box
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Checkout Info */}
          <div className="lg:w-96 space-y-6">
            <section className="rounded-lg border border-[#DFDFDF] bg-white p-6 shadow-sm sticky top-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-[#06402B] mb-4">Box Capacity</h2>
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                    <span>Used: 300g</span>
                    <span>Remaining: 700g</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full w-[30%] rounded-full bg-[#A88751]" />
                  </div>
                  <p className="mt-2 text-xs text-gray-400 italic">You can still add 700g to your gift box</p>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-base font-bold text-[#06402B] mb-4">Personal Message</h2>
                  <textarea
                    placeholder="Write a heartfelt message..."
                    className="h-28 w-full resize-none rounded-lg border border-gray-200 p-4 text-sm outline-none focus:border-[#06402B] focus:ring-1 focus:ring-[#06402B] transition-all bg-gray-50"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Wellness wishes", "Happy Birthday", "Thank you"].map((tag) => (
                      <button key={tag} className="rounded-full bg-[#FBF8F1] border border-[#E9DFCC] px-3 py-1 text-[10px] font-bold text-[#A88751] hover:bg-[#E9DFCC] transition-colors">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-base font-bold text-[#06402B] mb-4">Recipient Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">Recipient Name</label>
                      <input
                        type="text"
                        placeholder="Name"
                        className="h-10 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-[#06402B] bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="Phone"
                        className="h-10 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-[#06402B] bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">Delivery Address</label>
                      <textarea
                        placeholder="Address"
                        className="h-20 w-full resize-none rounded-lg border border-gray-200 p-4 text-sm outline-none focus:border-[#06402B] bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">Occasion</label>
                      <select className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-[#06402B]">
                        <option>Birthday</option>
                        <option>Thank You</option>
                        <option>Wellness Gift</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t font-semibold">
                  <button className="h-12 w-full rounded-lg bg-[#06402B] text-sm text-white hover:bg-[#053020] transition-all shadow-md active:scale-95">
                    Continue to Checkout
                  </button>
                  <button className="h-12 w-full rounded-lg border border-[#A88751] text-sm text-[#A88751] hover:bg-[#FBF8F1] transition-all font-bold">
                    Save Gift Box
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
