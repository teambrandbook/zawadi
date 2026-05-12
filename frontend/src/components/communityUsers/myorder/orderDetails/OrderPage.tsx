"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ProductDetails, { ProductDetailsCard } from "./ProductDetails";
import PackSelector from "./PackSelector";
import QuantitySelector from "./QuantitySelector";
import DeliveryInformation from "./DeliveryInformation";
import OrderSummary from "./OrderSummary";
import NeedHelpCard from "./NeedHelpCard";
import { DeliveryForm, PackOption } from "./types";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";

type ApiVariant = {
  id: number;
  variant_name: string;
  price: string | number;
  stock: number;
};

type ApiProduct = {
  id: number;
  product_name: string;
  short_description: string;
  base_price: string | number;
  stock_quantity: number;
  image?: string | null;
  variants: ApiVariant[];
};

type PaginatedResponse<T> = {
  results: T[];
};

type CartItem = {
  id: number;
  product_name: string;
  image?: string | null;
  variant_name?: string | null;
  quantity: number;
  unit_price: string | number;
  line_total: string | number;
  currency: string;
};

type CartSummary = {
  item_count: number;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
};

type CartResponse = {
  items: CartItem[];
  summary: CartSummary;
};

const initialForm: DeliveryForm = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  postalCode: "",
  address: "",
  instructions: "",
};

type MeResponse = {
  full_name: string;
  email: string;
  phone: string;
};

function toNumber(value: string | number): number {
  const amount = Number(value);
  return Number.isNaN(amount) ? 0 : amount;
}

function toImageUrl(imagePath?: string | null): string {
  if (!imagePath) return "/product/p-1.webp";
  return getImageUrl(imagePath);
}

function toPacks(product: ApiProduct | null): PackOption[] {
  if (!product) return [];

  if (product.variants?.length) {
    return product.variants.map((variant) => ({
      id: String(variant.id),
      name: variant.variant_name,
      price: toNumber(variant.price),
      unitNote: `${variant.stock} in stock`,
    }));
  }

  return [
    {
      id: `product-${product.id}-default`,
      name: "Standard Pack",
      price: toNumber(product.base_price),
      unitNote: `${product.stock_quantity} in stock`,
    },
  ];
}

function toCurrency(value: string | number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(value));
}

function toList<T>(data: T[] | PaginatedResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedProductId = searchParams.get("productId");
  const requestedQuantity = searchParams.get("quantity");
  const isCartCheckout = searchParams.get("cart") === "1";
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedPackId, setSelectedPackId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [deliveryForm, setDeliveryForm] = useState<DeliveryForm>(initialForm);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCart, setIsLoadingCart] = useState(isCartCheckout);

  const selectedProduct = useMemo(
    () => products.find((item) => String(item.id) === selectedProductId) ?? null,
    [products, selectedProductId]
  );
  const packs = useMemo(() => toPacks(selectedProduct), [selectedProduct]);
  const selectedPack = useMemo(
    () => packs.find((pack) => pack.id === selectedPackId) ?? packs[0] ?? null,
    [packs, selectedPackId]
  );
  const maxQuantity = useMemo(() => {
    if (!selectedProduct || !selectedPack) return 1;
    const variantStock = selectedProduct.variants?.find((item) => String(item.id) === selectedPack.id)?.stock;
    const baseStock = selectedProduct.stock_quantity;
    const stock = typeof variantStock === "number" ? variantStock : baseStock;
    return Math.max(1, stock);
  }, [selectedPack, selectedProduct]);

  const singleSubtotal = useMemo(() => {
    if (!selectedPack) return 0;
    return selectedPack.price * quantity;
  }, [selectedPack, quantity]);
  const deliveryCharge = singleSubtotal >= 50 ? 0 : 5;
  const totalAmount = singleSubtotal + deliveryCharge;

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      if (isCartCheckout) {
        setIsLoadingProducts(false);
        return;
      }
      try {
        const response = await api.get<ApiProduct[] | PaginatedResponse<ApiProduct>>("/products/");
        if (!isMounted) return;

        const productList = toList(response.data);
        setProducts(productList);
        if (productList.length) {
          const requestedProduct = productList.find((product) => String(product.id) === requestedProductId);
          setSelectedProductId(String((requestedProduct ?? productList[0]).id));
        }
      } catch {
        if (isMounted) showStatus("Unable to load products.");
      } finally {
        if (isMounted) setIsLoadingProducts(false);
      }
    }

    async function loadMe() {
      try {
        const response = await api.get<MeResponse>("/account/me/");
        if (!isMounted) return;
        setDeliveryForm((prev) => ({
          ...prev,
          fullName: response.data.full_name || prev.fullName,
          email: response.data.email || prev.email,
          phone: response.data.phone || prev.phone,
        }));
      } catch {
        // no-op
      }
    }

    async function loadCart() {
      if (!isCartCheckout) return;
      try {
        const response = await api.get<CartResponse>("/orders/cart/");
        if (!isMounted) return;
        setCartItems(response.data.items);
        setCartSummary(response.data.summary);
      } catch {
        if (isMounted) showStatus("Unable to load cart checkout.");
      } finally {
        if (isMounted) setIsLoadingCart(false);
      }
    }

    void loadProducts();
    void loadCart();
    void loadMe();
    return () => {
      isMounted = false;
    };
  }, [isCartCheckout, requestedProductId]);

  useEffect(() => {
    if (!packs.length) {
      setSelectedPackId("");
      return;
    }
    setSelectedPackId(packs[0].id);
  }, [selectedProductId, packs]);

  useEffect(() => {
    setQuantity((prev) => Math.min(prev, maxQuantity));
  }, [maxQuantity]);

  useEffect(() => {
    const parsedQuantity = Number(requestedQuantity);
    if (Number.isInteger(parsedQuantity) && parsedQuantity > 0) {
      setQuantity(Math.min(parsedQuantity, maxQuantity));
    }
  }, [maxQuantity, requestedQuantity]);

  function onDeliveryChange<K extends keyof DeliveryForm>(field: K, value: DeliveryForm[K]) {
    setDeliveryForm((prev) => ({ ...prev, [field]: value }));
  }

  function showStatus(message: string) {
    setStatusMessage(message);
    toast.error(message);
  }

  async function placeOrder() {
    const requiredFields: Array<keyof DeliveryForm> = [
      "fullName",
      "phone",
      "email",
      "city",
      "postalCode",
      "address",
    ];
    const missing = requiredFields.find((field) => !deliveryForm[field].trim());
    if (missing) {
      showStatus("Please complete all required delivery fields.");
      return;
    }

    if (isCartCheckout) {
      if (!cartItems.length) {
        showStatus("Your cart is empty.");
        return;
      }

      const payload = {
        mode: "cart" as const,
        delivery: {
          full_name: deliveryForm.fullName.trim(),
          phone: deliveryForm.phone.trim(),
          email: deliveryForm.email.trim(),
          city: deliveryForm.city.trim(),
          postal_code: deliveryForm.postalCode.trim(),
          address: deliveryForm.address.trim(),
          instructions: deliveryForm.instructions.trim(),
        },
      };
      setIsSubmitting(true);
      sessionStorage.setItem("zewadi_checkout", JSON.stringify(payload));
      router.push("/communityDashBoard/payment-method");
      return;
    }

    if (!selectedProduct || !selectedPack) {
      showStatus("Please select a product and pack.");
      return;
    }
    const selectedVariant = selectedProduct.variants?.find(
      (variant) => String(variant.id) === selectedPack.id
    );

    const payload = {
      mode: "single" as const,
      item: {
        productId: selectedProduct.id,
        variantId: selectedVariant?.id ?? null,
        productName: selectedProduct.product_name,
        productImage: toImageUrl(selectedProduct.image),
        packName: selectedPack.name,
        quantity,
        subtotal: singleSubtotal.toFixed(2),
        deliveryCharge: deliveryCharge.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
      },
      order: {
        product_id: selectedProduct.id,
        variant_id: selectedVariant?.id ?? null,
        product_name: selectedProduct.product_name,
        pack_name: selectedPack.name,
        pack_price: selectedPack.price.toFixed(2),
        quantity,
        subtotal: singleSubtotal.toFixed(2),
        delivery_charge: deliveryCharge.toFixed(2),
        total_amount: totalAmount.toFixed(2),
        full_name: deliveryForm.fullName.trim(),
        phone: deliveryForm.phone.trim(),
        email: deliveryForm.email.trim(),
        city: deliveryForm.city.trim(),
        postal_code: deliveryForm.postalCode.trim(),
        address: deliveryForm.address.trim(),
        instructions: deliveryForm.instructions.trim(),
        payment_method: "cod",
      },
    };
    setIsSubmitting(true);
    sessionStorage.setItem("zewadi_checkout", JSON.stringify(payload));
    router.push("/communityDashBoard/payment-method");
  }

  return (
    <section className="w-full bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1120px] space-y-5">
        <div className="rounded-xl bg-white p-4 lg:p-5">
          <h1 className="text-2xl font-bold text-[#0A4833]">
            {isCartCheckout ? "Checkout" : "Place Order"}
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            {isCartCheckout
              ? "Review your cart items and complete delivery details."
              : "Select your product, choose pack, and complete delivery details."}
          </p>
        </div>

        {isLoadingProducts || isLoadingCart ? (
          <div className="rounded-lg border border-[#DFDFDF] bg-white px-4 py-3 text-sm text-[#6B7280]">
            {isCartCheckout ? "Loading cart..." : "Loading products..."}
          </div>
        ) : null}

        {!isCartCheckout ? (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
            <label className="mb-1 block text-xs text-[#0A4833]">Product</label>
            <select
              value={selectedProductId}
              onChange={(event) => setSelectedProductId(event.target.value)}
              className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F4F6] px-3 text-sm text-[#0A4833] outline-none focus:border-[#0A4833]"
            >
              {products.map((product) => (
                <option key={product.id} value={String(product.id)}>
                  {product.product_name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            {isCartCheckout ? (
              <CartCheckoutItems items={cartItems} currency={cartItems[0]?.currency ?? "USD"} />
            ) : (
              <>
                {selectedProduct ? (
                  <ProductDetailsCard
                    productName={selectedProduct.product_name}
                    productDescription={selectedProduct.short_description}
                    productImage={toImageUrl(selectedProduct.image)}
                  />
                ) : (
                  <ProductDetails />
                )}
                {packs.length > 0 ? (
                  <PackSelector packs={packs} selectedPackId={selectedPackId} onSelectPack={setSelectedPackId} />
                ) : (
                  <div className="rounded-lg border border-[#DFDFDF] bg-white px-4 py-3 text-sm text-[#6B7280]">
                    No packs available for this product right now.
                  </div>
                )}
                <QuantitySelector quantity={quantity} max={maxQuantity} onQuantityChange={setQuantity} />
              </>
            )}
            <DeliveryInformation form={deliveryForm} onChange={onDeliveryChange} />
          </div>

          <div className="space-y-4">
            {isCartCheckout && cartSummary ? (
              <CartCheckoutSummary
                items={cartItems}
                summary={cartSummary}
                currency={cartItems[0]?.currency ?? "USD"}
                isSubmitting={isSubmitting}
                onPlaceOrder={placeOrder}
              />
            ) : selectedPack ? (
              <OrderSummary
                productName={selectedProduct?.product_name || "ZEWADI Product"}
                productImage={toImageUrl(selectedProduct?.image)}
                selectedPack={selectedPack}
                quantity={quantity}
                deliveryCharge={deliveryCharge}
                isSubmitting={isSubmitting}
                actionLabel="Continue to Payment"
                submittingLabel="Opening Payment..."
                onPlaceOrder={placeOrder}
              />
            ) : null}
            <NeedHelpCard />
          </div>
        </div>

        {statusMessage && (
          <div className="rounded-lg border border-[#DFDFDF] bg-[#F8F9FA] px-4 py-3 text-sm text-[#6B7280]">
            {statusMessage}
          </div>
        )}
      </div>
    </section>
  );
}

function CartCheckoutItems({ items, currency }: { items: CartItem[]; currency: string }) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-[#DFDFDF] bg-white p-5 text-sm text-[#6B7280]">
        Your cart is empty. Add products before checkout.
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
      <h2 className="text-lg font-semibold text-[#0A4833]">Cart Items</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 rounded-lg bg-[#F8F3E9] p-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#EBE1CF]">
              <Image
                src={toImageUrl(item.image)}
                alt={item.product_name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#0A4833]">{item.product_name}</p>
              <p className="text-xs text-[#6B7280]">
                {item.variant_name || "Standard Pack"} x {item.quantity}
              </p>
            </div>
            <p className="text-sm font-semibold text-[#9F8151]">
              {toCurrency(item.line_total, item.currency || currency)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CartCheckoutSummary({
  items,
  summary,
  currency,
  isSubmitting,
  onPlaceOrder,
}: {
  items: CartItem[];
  summary: CartSummary;
  currency: string;
  isSubmitting: boolean;
  onPlaceOrder: () => void;
}) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h3 className="text-xl font-semibold text-[#0A4833]">Order Summary</h3>

      <div className="mt-4 rounded-lg bg-[#F8F3E9] p-3">
        <div className="space-y-2 text-sm text-[#374151]">
          <div className="flex items-center justify-between">
            <span>Subtotal ({summary.item_count} items)</span>
            <span>{toCurrency(summary.subtotal, currency)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Delivery Charge</span>
            <span>{toNumber(summary.shipping) === 0 ? "FREE" : toCurrency(summary.shipping, currency)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax</span>
            <span>{toCurrency(summary.tax, currency)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-[#DDD2BE] pt-2 text-base font-semibold text-[#0A4833]">
            <span>Total</span>
            <span>{toCurrency(summary.total, currency)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={isSubmitting || items.length === 0}
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0A4833] text-sm font-semibold text-white hover:bg-[#083B2A] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Opening Payment..." : "Continue to Payment"}
      </button>

      <button
        type="button"
        onClick={() => window.location.assign("/communityDashBoard/cart")}
        className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-lg border border-[#DFDFDF] bg-white text-sm font-medium text-[#4B5563]"
      >
        Back to Cart
      </button>
    </section>
  );
}
