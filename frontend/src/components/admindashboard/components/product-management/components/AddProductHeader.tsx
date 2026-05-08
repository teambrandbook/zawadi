type Props = {
  onBackToProducts?: () => void;
  title?: string;
};

export default function AddProductHeader({ onBackToProducts, title = "Add Product" }: Props) {
  return (
    <header className="space-y-1">
      <h1 className="text-[20px] font-semibold text-[#0A4833]">{title}</h1>
      <p className="text-[12px] text-[#98A2B3]">
        {onBackToProducts ? (
          <button type="button" onClick={onBackToProducts} className="text-[#667085] hover:text-[#0A4833]">
            Products
          </button>
        ) : (
          <span>Products</span>
        )}
        <span className="px-1 text-[#B8C1CC]">{">"}</span> {title}
      </p>
    </header>
  );
}
