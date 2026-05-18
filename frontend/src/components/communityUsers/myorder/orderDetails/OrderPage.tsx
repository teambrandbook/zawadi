"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react"; // Added for the icon
import ProductDetails, { ProductDetailsCard } from "./ProductDetails";
import QuantitySelector from "./QuantitySelector";
import DeliveryInformation from "./DeliveryInformation";
import OrderSummary from "./OrderSummary";
import NeedHelpCard from "./NeedHelpCard";
import { DeliveryForm, PackOption } from "./types";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";
// Note: Ensure you have a 'setCartCount' action in your redux store or remove the dispatch if not using Redux
// import { useDispatch } from "react-redux";
// import { setCartCount } from "@/store/cartSlice";

type ApiVariant = {
  id: number;
  variant_value: string;
  variant_unit: string;
  cost?: string | number | null;
  price: string | number;
  stock: number;
};

type ApiProduct = {
  id: number;
  product_name: string;
  short_description: string;
  base_price: string | number;
  sale_price?: string | number | null;
  cost_price?: string | number;
  mrp_price?: string | number;
  selling_price?: string | number;
  product_unit?: string;
  unit_quantity?: string | number;
  stock_quantity: number;
  stock_status?: string;
  image?: string | null;
  alternative_images?: string[];
  variants?: ApiVariant[];
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
  stock_quantity?: number;
  stock_status?: string;
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

  const productUnit = [product.unit_quantity, product.product_unit].filter(Boolean).join(" ");
  const packs: PackOption[] = [
    {
      id: `product-${product.id}-default`,
      name: productUnit || "Standard Pack",
      price: toNumber(product.selling_price ?? product.sale_price ?? product.base_price),
      unitNote:
        product.mrp_price && toNumber(product.mrp_price) > toNumber(product.selling_price ?? product.sale_price ?? product.base_price)
          ? `MRP ${toCurrency(product.mrp_price)}`
          : "Single SKU",
    },
  ];

  return packs;
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

function isProductOutOfStock(product: ApiProduct): boolean {
  return product.stock_status === "out_of_stock" || toNumber(product.stock_quantity) <= 0;
}

function isCartItemOutOfStock(item: CartItem): boolean {
  const stock = toNumber(item.stock_quantity ?? 0);
  return item.stock_status === "out_of_stock" || stock <= 0 || item.quantity > stock;
}

export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const dispatch = useDispatch(); // Uncomment if using Redux
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

  // State for Add to Cart busy status
  const [busyProductId, setBusyProductId] = useState<number | null>(null);

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
    if (!selectedProduct || !selectedPack) return 0;
    if (isProductOutOfStock(selectedProduct)) return 0;
    return Math.max(0, toNumber(selectedProduct.stock_quantity));
  }, [selectedPack, selectedProduct]);
  const hasOutOfStockCartItem = useMemo(
    () => cartItems.some(isCartItemOutOfStock),
    [cartItems]
  );

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
    setQuantity((prev) => (maxQuantity < 1 ? 0 : Math.min(Math.max(prev, 1), maxQuantity)));
  }, [maxQuantity]);

  useEffect(() => {
    const parsedQuantity = Number(requestedQuantity);
    if (Number.isInteger(parsedQuantity) && parsedQuantity > 0) {
      setQuantity(maxQuantity < 1 ? 0 : Math.min(parsedQuantity, maxQuantity));
    }
  }, [maxQuantity, requestedQuantity]);

  function onDeliveryChange<K extends keyof DeliveryForm>(field: K, value: DeliveryForm[K]) {
    setDeliveryForm((prev) => ({ ...prev, [field]: value }));
  }

  function showStatus(message: string) {
    setStatusMessage(message);
    toast.error(message);
  }

  // Add to Cart Function
  async function addToCart() {
    if (!selectedProduct) return;
    if (maxQuantity < 1) return;

    setBusyProductId(selectedProduct.id);
    setStatusMessage("");
    try {
      const payload: { product_id: number; quantity: number } = {
        product_id: selectedProduct.id,
        quantity: quantity,
      };

      const response = await api.post("/orders/cart/items/", payload);
      const itemCount = response.data?.summary?.item_count;

      // if (typeof itemCount === "number") {
      //   dispatch(setCartCount(itemCount));
      // }

      toast.success("Added to cart!");
    } catch (error: any) {
      const detail = error?.response?.data?.detail;
      toast.error(detail || "Unable to add this product to your cart.");
      setStatusMessage("Unable to add this product to your cart.");
    } finally {
      setBusyProductId(null);
    }
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
      if (hasOutOfStockCartItem) {
        showStatus("Remove out of stock products before checkout.");
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
    if (maxQuantity < 1) {
      showStatus("This product is out of stock.");
      return;
    }
    const payload = {
      mode: "single" as const,
      item: {
        productId: selectedProduct.id,
        variantId: null,
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
        variant_id: null,
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
                    alternativeImages={(selectedProduct.alternative_images ?? []).map(toImageUrl)}
                  />
                ) : (
                  <ProductDetails />
                )}
                <QuantitySelector quantity={quantity} max={maxQuantity} onQuantityChange={setQuantity} />
              </>
            )}

            <div className="space-y-4">
              <DeliveryInformation form={deliveryForm} onChange={onDeliveryChange} />

              {/* BUTTON ALIGNED TO THE RIGHT */}
              {/* BUTTON ALIGNED TO THE RIGHT WITH INCREASED WIDTH */}
              {!isCartCheckout && selectedProduct && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addToCart}
                    disabled={maxQuantity === 0 || busyProductId === selectedProduct.id}
                    /* Changed to w-full for 100% width, or use w-80 for a fixed large width */
                    className="flex w-full md:w-80 items-center justify-center gap-2 rounded-lg bg-[#A88751] h-12 px-6 text-sm font-bold text-white transition hover:bg-[#E6C200] disabled:cursor-not-allowed disabled:bg-gray-300 shadow-sm"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {busyProductId === selectedProduct.id ? "Adding..." : "Add to Cart First"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {isCartCheckout && cartSummary ? (
              <CartCheckoutSummary
                items={cartItems}
                summary={cartSummary}
                currency={cartItems[0]?.currency ?? "USD"}
                isSubmitting={isSubmitting}
                hasOutOfStockItem={hasOutOfStockCartItem}
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
                isDisabled={maxQuantity < 1}
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
  hasOutOfStockItem,
  onPlaceOrder,
}: {
  items: CartItem[];
  summary: CartSummary;
  currency: string;
  isSubmitting: boolean;
  hasOutOfStockItem: boolean;
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
        disabled={isSubmitting || items.length === 0 || hasOutOfStockItem}
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
