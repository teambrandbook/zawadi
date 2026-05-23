type Props = {
  title?: string;
};

export default function AddProductHeader({ title = "Add Product" }: Props) {
  return (
    <header className="space-y-1">
      <h1 className="text-[24px] font-semibold leading-7 text-[#0A4833]">{title}</h1>
    </header>
  );
}
