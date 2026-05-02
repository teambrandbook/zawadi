"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProductDetails, { ProductDetailsCard } from "./ProductDetails";
import PackSelector from "./PackSelector";
import QuantitySelector from "./QuantitySelector";
import DeliveryInformation from "./DeliveryInformation";
import PaymentMethodSection from "./PaymentMethod";
import OrderSummary from "./OrderSummary";
import NeedHelpCard from "./NeedHelpCard";
import { DeliveryForm, PackOption, PaymentMethod } from "./types";
import api from "@/services/api";

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
  if (!imagePath) return "/product/product-1.webp";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  return `${apiOrigin}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
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

export default function OrderPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedPackId, setSelectedPackId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [deliveryForm, setDeliveryForm] = useState<DeliveryForm>(initialForm);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

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

  const subtotal = useMemo(() => {
    if (!selectedPack) return 0;
    return selectedPack.price * quantity;
  }, [selectedPack, quantity]);
  const deliveryCharge = subtotal >= 50 ? 0 : 5;
  const totalAmount = subtotal + deliveryCharge;

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const response = await api.get<ApiProduct[]>("/products/");
        if (!isMounted) return;

        setProducts(response.data);
        if (response.data.length) {
          setSelectedProductId(String(response.data[0].id));
        }
      } catch {
        if (isMounted) setStatusMessage("Unable to load products.");
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

    void loadProducts();
    void loadMe();
    return () => {
      isMounted = false;
    };
  }, []);

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

  function onDeliveryChange<K extends keyof DeliveryForm>(field: K, value: DeliveryForm[K]) {
    setDeliveryForm((prev) => ({ ...prev, [field]: value }));
  }

  async function placeOrder() {
    if (!selectedProduct || !selectedPack) {
      setStatusMessage("Please select a product and pack.");
      return;
    }

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
      setStatusMessage("Please complete all required delivery fields.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Placing order...");
    try {
      const payload = {
        product_name: selectedProduct.product_name,
        pack_name: selectedPack.name,
        pack_price: selectedPack.price.toFixed(2),
        quantity,
        subtotal: subtotal.toFixed(2),
        delivery_charge: deliveryCharge.toFixed(2),
        total_amount: totalAmount.toFixed(2),
        full_name: deliveryForm.fullName.trim(),
        phone: deliveryForm.phone.trim(),
        email: deliveryForm.email.trim(),
        city: deliveryForm.city.trim(),
        postal_code: deliveryForm.postalCode.trim(),
        address: deliveryForm.address.trim(),
        instructions: deliveryForm.instructions.trim(),
        payment_method: paymentMethod,
      };
      const response = await api.post<{ order_id?: string }>("/orders/create/", payload);
      const createdOrderId = response.data?.order_id;
      const target = createdOrderId
        ? `/communityDashBorde/myorders/order-placed?orderId=${encodeURIComponent(createdOrderId)}`
        : "/communityDashBorde/myorders/order-placed";
      router.push(target);
    } catch (error: unknown) {
      const detail =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { detail?: unknown } } }).response?.data?.detail === "string"
          ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : "Failed to place order.";
      setStatusMessage(detail);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1120px] space-y-5">
        <div className="rounded-xl bg-white p-4 lg:p-5">
          <h1 className="text-2xl font-bold text-[#0A4833]">Place Order</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Select your product, choose pack, and complete delivery details.</p>
        </div>

        {isLoadingProducts ? (
          <div className="rounded-lg border border-[#DFDFDF] bg-white px-4 py-3 text-sm text-[#6B7280]">
            Loading products...
          </div>
        ) : null}

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

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
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
            <DeliveryInformation form={deliveryForm} onChange={onDeliveryChange} />
            <PaymentMethodSection selectedMethod={paymentMethod} onChangeMethod={setPaymentMethod} />
          </div>

          <div className="space-y-4">
            {selectedPack ? (
              <OrderSummary
                productName={selectedProduct?.product_name || "ZEWADI Product"}
                productImage={toImageUrl(selectedProduct?.image)}
                selectedPack={selectedPack}
                quantity={quantity}
                deliveryCharge={deliveryCharge}
                isSubmitting={isSubmitting}
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
