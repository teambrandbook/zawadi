import { ImageIcon, Info, Leaf, Package, Tags } from "lucide-react";
import { ReactNode } from "react";

type FormData = {
  name: string;
  subtitle: string;
  sku: string;
  category: string;
  status: string;
  description: string;
  full_description: string;
  price: string;
  stock_quantity: string;
};

type Props = {
  formData: FormData;
  onChange: (data: FormData) => void;
};

function TextField({
  label,
  placeholder,
  value,
  onValueChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (v: string) => void;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-[#344054]">{label}</span>
      <input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#667085] outline-none"
      />
    </label>
  );
}

function SelectField({
  label,
  placeholder,
  value,
  options,
  onValueChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onValueChange: (v: string) => void;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-[#344054]">{label}</span>
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#667085] outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-[12px] font-semibold text-[#0A4833]">
      <span className="text-[#0A4833]">{icon}</span>
      <span>{title}</span>
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <section className="rounded-lg border border-[#E4E7EC] bg-white p-4">{children}</section>;
}

export default function AddProductForm({ formData, onChange }: Props) {
  function set(field: keyof FormData) {
    return (v: string) => onChange({ ...formData, [field]: v });
  }

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle icon={<Info className="h-4 w-4" />} title="Basic Information" />
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label="Product Name *" placeholder="Enter product name" value={formData.name} onValueChange={set("name")} />
          <TextField label="Product Subtitle" placeholder="Short tagline or subtitle" value={formData.subtitle} onValueChange={set("subtitle")} />
          <TextField label="SKU / Product Code *" placeholder="BWT-001" value={formData.sku} onValueChange={set("sku")} />
          <SelectField
            label="Category *"
            placeholder="Select category"
            value={formData.category}
            options={["Flour", "Grains", "Pasta", "Snacks", "Noodles", "Tea"]}
            onValueChange={set("category")}
          />
          <TextField label="Brand Name" placeholder="ZEWADI" value="" onValueChange={() => {}} />
          <SelectField
            label="Product Status"
            placeholder="Draft"
            value={formData.status}
            options={["Draft", "Active"]}
            onValueChange={set("status")}
          />
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<ImageIcon className="h-4 w-4" />} title="Product Images" />
        <div className="rounded-md border border-dashed border-[#D0D5DD] bg-[#F9FAFB] p-7 text-center">
          <ImageIcon className="mx-auto h-5 w-5 text-[#98A2B3]" />
          <p className="mt-2 text-[12px] text-[#344054]">Drag and drop images here, or click to browse</p>
          <p className="text-[11px] text-[#98A2B3]">Recommended size: 600x600px, Supports JPG, PNG formats</p>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<Package className="h-4 w-4" />} title="Product Description" />
        <div className="space-y-3">
          <label className="space-y-1">
            <span className="block text-[11px] font-medium text-[#344054]">Short Description *</span>
            <input
              value={formData.description}
              onChange={(e) => set("description")(e.target.value)}
              placeholder="Brief product overview (50 characters)"
              className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#667085] outline-none"
            />
          </label>
          <label className="space-y-1">
            <span className="block text-[11px] font-medium text-[#344054]">Full Description</span>
            <textarea
              value={formData.full_description}
              onChange={(e) => set("full_description")(e.target.value)}
              placeholder="Detailed product description"
              className="h-28 w-full resize-none rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 py-2 text-[12px] text-[#667085] outline-none"
            />
          </label>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<Leaf className="h-4 w-4" />} title="Nutritional & Wellness Information" />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="block text-[11px] font-medium text-[#344054]">Key Ingredients</span>
            <textarea placeholder="List main ingredients" className="h-20 w-full resize-none rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 py-2 text-[12px] text-[#667085] outline-none" />
          </label>
          <label className="space-y-1">
            <span className="block text-[11px] font-medium text-[#344054]">Health Benefits</span>
            <textarea placeholder="Describe health benefits" className="h-20 w-full resize-none rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 py-2 text-[12px] text-[#667085] outline-none" />
          </label>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<Tags className="h-4 w-4" />} title="Pricing & Variants" />
        <div className="grid gap-3 sm:grid-cols-3">
          <TextField label="Base Price *" placeholder="0.00" value={formData.price} onValueChange={set("price")} />
          <TextField label="Sale Price" placeholder="0.00" value="" onValueChange={() => {}} />
          <SelectField label="Currency" placeholder="USD ($)" value="" options={["USD ($)", "KES"]} onValueChange={() => {}} />
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<Package className="h-4 w-4" />} title="Inventory Management" />
        <div className="grid gap-3 sm:grid-cols-3">
          <TextField label="Stock Quantity *" placeholder="0" value={formData.stock_quantity} onValueChange={set("stock_quantity")} />
          <TextField label="Low Stock Alert" placeholder="5" value="" onValueChange={() => {}} />
          <SelectField label="Stock Status" placeholder="In Stock" value="" options={["In Stock", "Out of Stock"]} onValueChange={() => {}} />
        </div>

        <div className="mt-3 space-y-2 text-[11px] text-[#475467]">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#D0D5DD]" />
            Allow orders when out of stock
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#D0D5DD]" />
            Enable low stock alerts
          </label>
        </div>
      </Card>
    </div>
  );
}
