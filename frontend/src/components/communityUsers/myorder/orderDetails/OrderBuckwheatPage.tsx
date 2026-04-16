"use client";

import { useMemo, useState } from "react";
import ProductDetails from "./ProductDetails";
import PackSelector from "./PackSelector";
import QuantitySelector from "./QuantitySelector";
import DeliveryInformation from "./DeliveryInformation";
import PaymentMethodSection from "./PaymentMethod";
import OrderSummary from "./OrderSummary";
import NeedHelpCard from "./NeedHelpCard";
import { DeliveryForm, PackOption, PaymentMethod } from "./types";

const packOptions: PackOption[] = [
  { id: "pack-500g", name: "500g Pack", price: 249, unitNote: "Perfect for trying" },
  { id: "pack-1kg", name: "1kg Pack", price: 449, unitNote: "Best Value", badge: "POPULAR" },
  { id: "pack-family", name: "Family Pack", price: 799, unitNote: "2.5kg Save 20%" },
];

const initialForm: DeliveryForm = {
  fullName: "",
  phone: "+91 00000 00000",
  email: "",
  city: "",
  postalCode: "",
  address: "",
  instructions: "",
};

export default function OrderBuckwheatPage() {
  const [selectedPackId, setSelectedPackId] = useState(packOptions[1].id);
  const [quantity, setQuantity] = useState(1);
  const [deliveryForm, setDeliveryForm] = useState<DeliveryForm>(initialForm);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [statusMessage, setStatusMessage] = useState("");

  const selectedPack = useMemo(
    () => packOptions.find((pack) => pack.id === selectedPackId) ?? packOptions[0],
    [selectedPackId]
  );

  function onDeliveryChange<K extends keyof DeliveryForm>(field: K, value: DeliveryForm[K]) {
    setDeliveryForm((prev) => ({ ...prev, [field]: value }));
  }

  function placeOrder() {
    if (!deliveryForm.fullName.trim() || !deliveryForm.address.trim()) {
      setStatusMessage("Please enter name and delivery address before placing the order.");
      return;
    }
    setStatusMessage(`Order placed with ${paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"} successfully.`);
  }

  return (
    <section className="w-full bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1120px] space-y-5">
        

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            <ProductDetails />
            <PackSelector packs={packOptions} selectedPackId={selectedPackId} onSelectPack={setSelectedPackId} />
            <QuantitySelector quantity={quantity} max={6} onQuantityChange={setQuantity} />
            <DeliveryInformation form={deliveryForm} onChange={onDeliveryChange} />
            <PaymentMethodSection selectedMethod={paymentMethod} onChangeMethod={setPaymentMethod} />
          </div>

          <div className="space-y-4">
            <OrderSummary selectedPack={selectedPack} quantity={quantity} onPlaceOrder={placeOrder} />
            <NeedHelpCard />
          </div>
        </div>

        {statusMessage && (
          <div className="rounded-lg border border-[#D8C9AE] bg-[#F8F3E9] px-4 py-3 text-sm text-[#0A4833]">
            {statusMessage}
          </div>
        )}
      </div>
    </section>
  );
}
