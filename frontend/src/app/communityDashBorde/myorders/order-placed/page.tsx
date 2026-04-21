import OrderPlacedPage, { type OrderPlacedData } from "@/components/communityUsers/myorder/orderPlaced/OrderPlacedPage";
import { HelpCircle, MapPin, MessageCircle } from "lucide-react";

const orderPlacedData: OrderPlacedData = {
  confirmation: {
    orderId: "#ZW-2024-001234",
    orderDate: "Mar 28, 2024",
    time: "2:45 PM",
    paymentStatus: "Paid",
    estimatedDelivery: "March 31, 2024",
    deliveryAddress: ["123 Wellness Street", "Health District, HD 12345"],
    contact: "+1 (555) 123-4567",
  },
  products: [
    {
      id: "premium-buckwheat",
      name: "Premium Organic Buckwheat",
      pack: "1kg Pack - Gluten-Free",
      quantity: 2,
      price: "$24.99",
      priceNote: "each",
      image: "/product/product-1.webp",
    },
  ],
  totals: [
    { label: "Subtotal", value: "$49.98" },
    { label: "Shipping", value: "$5.99" },
    { label: "Total Paid", value: "$55.97" },
  ],
  progress: [
    { label: "Confirmed", completed: true },
    { label: "Processing", completed: true, active: true },
    { label: "Packed", completed: false },
    { label: "Shipped", completed: false },
    { label: "Delivered", completed: false },
  ],
  paymentDetails: [
    { label: "Payment Method", value: "**** 4567" },
    { label: "Transaction ID", value: "TXN123456789" },
    { label: "Amount Paid", value: "$55.97", strong: true },
  ],
  helpItems: [
    { label: "Contact Support", Icon: MessageCircle },
    { label: "Order FAQ", Icon: HelpCircle },
    { label: "Delivery Info", Icon: MapPin },
  ],
  notice:
    "You will receive updates about your order in Notifications and My Orders. A confirmation email has been sent to your registered email address.",
};

export default function OrderPlacedRoute() {
  return <OrderPlacedPage order={orderPlacedData} />;
}
