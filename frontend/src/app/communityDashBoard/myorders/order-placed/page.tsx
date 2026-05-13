import { Suspense } from "react";
import OrderPlacedPage from "@/components/communityUsers/myorder/orderPlaced/OrderPlacedPage";

export default function OrderPlacedRoute() {
  return (
    <Suspense fallback={<OrderPlacedFallback />}>
      <OrderPlacedPage />
    </Suspense>
  );
}

function OrderPlacedFallback() {
  return (
    <section className="min-h-screen bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1136px] rounded-2xl border border-[#DFDFDF] bg-white p-8 text-sm text-[#4B5563] shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
        Loading order confirmation...
      </div>
    </section>
  );
}
