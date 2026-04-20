type Props = {
  onBackToProducts?: () => void;
};

export default function AddProductHeader({ onBackToProducts }: Props) {
  return (
    <header className="space-y-1">
      <h1 className="text-[20px] font-semibold text-[#0A4833]">Add Product</h1>
      <p className="text-[12px] text-[#98A2B3]">
        {onBackToProducts ? (
          <button type="button" onClick={onBackToProducts} className="text-[#667085] hover:text-[#0A4833]">
            Products
          </button>
        ) : (
          <span>Products</span>
        )}
        <span className="px-1 text-[#B8C1CC]">{">"}</span> Add Product
      </p>
    </header>
  );
}
