import { ImageIcon, Info, Leaf, Package, Tags } from "lucide-react";
import { ReactNode } from "react";

export type ProductFormData = {
  product_name: string;
  product_subtitle: string;
  product_code: string;
  category: string;
  product_status: string;
  short_description: string;
  full_description: string;
  key_ingredients: string;
  health_benefits: string;
  base_price: string;
  sale_price: string;
  currency: string;
  stock_quantity: string;
  low_stock_alert: string;
  stock_status: string;
};

type Props = {
  formData: ProductFormData;
  onChange: (data: ProductFormData) => void;
};

function TextField({
  label,
  placeholder,
  value,
  type = "text",
  onValueChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  type?: string;
  onValueChange: (v: string) => void;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-[#344054]">{label}</span>
      <input
        type={type}
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
  options: { label: string; value: string }[];
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
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextareaField({
  label,
  placeholder,
  value,
  rows = 4,
  onValueChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  rows?: number;
  onValueChange: (v: string) => void;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-[#344054]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 py-2 text-[12px] text-[#667085] outline-none"
      />
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

const CATEGORY_OPTIONS = [
  { label: "Food", value: "food" },
  { label: "Seed", value: "seed" },
  { label: "Supplement", value: "supplement" },
  { label: "Other", value: "other" },
];

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const CURRENCY_OPTIONS = [
  { label: "USD ($)", value: "USD" },
  { label: "INR (₹)", value: "INR" },
  { label: "AED (د.إ)", value: "AED" },
];

const STOCK_STATUS_OPTIONS = [
  { label: "In Stock", value: "in_stock" },
  { label: "Low Stock", value: "low_stock" },
  { label: "Out of Stock", value: "out_of_stock" },
];

export default function AddProductForm({ formData, onChange }: Props) {
  function set(field: keyof ProductFormData) {
    return (v: string) => onChange({ ...formData, [field]: v });
  }

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <Card>
        <SectionTitle icon={<Info className="h-4 w-4" />} title="Basic Information" />
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label="Product Name *" placeholder="Enter product name" value={formData.product_name} onValueChange={set("product_name")} />
          <TextField label="Product Subtitle" placeholder="Short tagline or subtitle" value={formData.product_subtitle} onValueChange={set("product_subtitle")} />
          <TextField label="SKU / Product Code *" placeholder="BWT-001" value={formData.product_code} onValueChange={set("product_code")} />
          <SelectField
            label="Category *"
            placeholder="Select category"
            value={formData.category}
            options={CATEGORY_OPTIONS}
            onValueChange={set("category")}
          />
          <div className="space-y-1">
            <span className="block text-[11px] font-medium text-[#344054]">Brand Name</span>
            <div className="flex h-10 w-full items-center rounded-md border border-[#E4E7EC] bg-[#F3F4F6] px-3 text-[12px] text-[#9CA3AF]">
              Zewadi
            </div>
          </div>
          <SelectField
            label="Product Status"
            placeholder="Select status"
            value={formData.product_status}
            options={STATUS_OPTIONS}
            onValueChange={set("product_status")}
          />
        </div>
      </Card>

      {/* Product Images — placeholder, no upload yet */}
      <Card>
        <SectionTitle icon={<ImageIcon className="h-4 w-4" />} title="Product Images" />
        <div className="rounded-md border border-dashed border-[#D0D5DD] bg-[#F9FAFB] p-7 text-center">
          <ImageIcon className="mx-auto h-5 w-5 text-[#98A2B3]" />
          <p className="mt-2 text-[12px] text-[#344054]">Drag and drop images here, or click to browse</p>
          <p className="text-[11px] text-[#98A2B3]">Recommended size: 600×600px · JPG, PNG</p>
        </div>
      </Card>

      {/* Description */}
      <Card>
        <SectionTitle icon={<Package className="h-4 w-4" />} title="Product Description" />
        <div className="space-y-3">
          <TextField
            label="Short Description *"
            placeholder="Brief product overview (max 150 characters)"
            value={formData.short_description}
            onValueChange={set("short_description")}
          />
          <TextareaField
            label="Full Description"
            placeholder="Detailed product description"
            value={formData.full_description}
            rows={5}
            onValueChange={set("full_description")}
          />
        </div>
      </Card>

      {/* Nutritional & Wellness */}
      <Card>
        <SectionTitle icon={<Leaf className="h-4 w-4" />} title="Nutritional & Wellness Information" />
        <div className="grid gap-3 sm:grid-cols-2">
          <TextareaField
            label="Key Ingredients"
            placeholder="List main ingredients"
            value={formData.key_ingredients}
            rows={3}
            onValueChange={set("key_ingredients")}
          />
          <TextareaField
            label="Health Benefits"
            placeholder="Describe health benefits"
            value={formData.health_benefits}
            rows={3}
            onValueChange={set("health_benefits")}
          />
        </div>
      </Card>

      {/* Pricing */}
      <Card>
        <SectionTitle icon={<Tags className="h-4 w-4" />} title="Pricing & Variants" />
        <div className="grid gap-3 sm:grid-cols-3">
          <TextField label="Base Price *" placeholder="0.00" type="number" value={formData.base_price} onValueChange={set("base_price")} />
          <TextField label="Sale Price" placeholder="0.00" type="number" value={formData.sale_price} onValueChange={set("sale_price")} />
          <SelectField
            label="Currency"
            placeholder="Select currency"
            value={formData.currency}
            options={CURRENCY_OPTIONS}
            onValueChange={set("currency")}
          />
        </div>
      </Card>

      {/* Inventory */}
      <Card>
        <SectionTitle icon={<Package className="h-4 w-4" />} title="Inventory Management" />
        <div className="grid gap-3 sm:grid-cols-3">
          <TextField label="Stock Quantity" placeholder="0" type="number" value={formData.stock_quantity} onValueChange={set("stock_quantity")} />
          <TextField label="Low Stock Alert" placeholder="5" type="number" value={formData.low_stock_alert} onValueChange={set("low_stock_alert")} />
          <SelectField
            label="Stock Status"
            placeholder="Select status"
            value={formData.stock_status}
            options={STOCK_STATUS_OPTIONS}
            onValueChange={set("stock_status")}
          />
        </div>
      </Card>
    </div>
  );
}
