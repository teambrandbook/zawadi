import MyOrderReview from "@/components/communityUsers/myorder/MyOrderReview";

type PageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function MyOrderReviewPage({ params }: PageProps) {
  const { orderId } = await params;
  const decodedOrderDataId = decodeURIComponent(orderId);
  return <MyOrderReview orderDataId={decodedOrderDataId} />;
}
