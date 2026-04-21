import OrderPlacedPage, { type OrderPlacedData } from "@/components/communityUsers/myorder/orderPlaced/OrderPlacedPage";

const orderPlacedData: OrderPlacedData = {
  heading: "Track Your Order",
  subheading: "Stay updated with your ZEWADI Buckwheat delivery and order progress.",
  orderId: "#ZW-2024-0156",
  summary: {
    image: "/product/product-1.webp",
    name: "Organic Buckwheat Grains",
    subtitle: "Premium Quality • 1kg Pack",
    quantity: "2 packs",
    orderDate: "Mar 15, 2024",
    payment: "Paid",
    expected: "Mar 20, 2024",
  },
  address: {
    name: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    lines: ["1234 Wellness Avenue", "Apartment 5B", "Healthy Heights, CA 90210"],
    note: "Delivery Note: Leave at front door if no answer",
  },
  details: [
    { label: "Buckwheat Grains (2x)", value: "$48.00" },
    { label: "Shipping", value: "$5.99" },
    { label: "Wellness Member Discount", value: "-$5.00", valueClass: "text-[#16A34A]" },
    { label: "Total Paid", value: "$48.99", valueClass: "text-[#0A4833] font-semibold" },
  ],
  paymentMethod: "•••• 4242 (Visa)",
  timeline: [
    {
      title: "Order Placed",
      description: "Your order has been successfully placed",
      date: "Mar 15, 2024 at 10:30 AM",
      status: "completed",
      icon: "check",
    },
    {
      title: "Order Confirmed",
      description: "Payment verified and order confirmed",
      date: "Mar 15, 2024 at 11:15 AM",
      status: "completed",
      icon: "check",
    },
    {
      title: "Processing",
      description: "Your wellness essentials are being prepared",
      date: "Mar 16, 2024 at 9:00 AM",
      status: "completed",
      icon: "check",
    },
    {
      title: "Packed",
      description: "Order securely packed and ready for shipment",
      date: "Mar 16, 2024 at 2:30 PM",
      status: "completed",
      icon: "check",
    },
    {
      title: "In Transit",
      description: "Your package is on the way to you",
      date: "Mar 17, 2024 at 8:00 AM",
      status: "current",
      icon: "truck",
    },
    {
      title: "Out for Delivery",
      description: "Package will be delivered today",
      date: "",
      status: "upcoming",
      icon: "truck",
    },
    {
      title: "Delivered",
      description: "Package successfully delivered",
      date: "",
      status: "upcoming",
      icon: "home",
    },
  ],
  liveStatus: {
    title: "Package in transit",
    description:
      "Your ZEWADI wellness essentials are currently traveling to your location via our trusted delivery partner.",
    courier: "Express Wellness Delivery",
    trackingId: "EWD789456123",
    lastUpdate: "2 hours ago",
    expectedWindow: "Today 2-6 PM",
  },
  support: [
    { label: "Contact Support", icon: "support" },
    { label: "Report Issue", icon: "issue" },
    { label: "Download Invoice", icon: "invoice" },
    { label: "Reorder", icon: "reorder", href: "/communityDashBorde/myorders/order-buckwheat" },
  ],
  promo: {
    title: "Your wellness essentials are on the way!",
    description: "While you wait, explore healthy recipes and nutrition tips from our wellness community.",
    ctaLabel: "Browse Recipes →",
    ctaHref: "/recipe/buckwheat-soup",
  },
};

export default function OrderPlacedRoute() {
  return <OrderPlacedPage order={orderPlacedData} />;
}
