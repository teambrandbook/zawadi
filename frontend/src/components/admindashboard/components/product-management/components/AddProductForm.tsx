import {
  Boxes,
  DollarSign,
  ImageIcon,
  Info,
  Leaf,
  PencilLine,
  Plus,
  UploadCloud,
} from "lucide-react";
import { ReactNode } from "react";

export type ProductVariantFormData = {
  variant_value: string;
  variant_unit: string;
  cost: string;
  price: string;
  stock: string;
};

export type ProductFormData = {
  product_name: string;
  product_subtitle: string;
  product_code: string;
  category: string;
  product_status: string;
  image: File | null;
  alternative_images: (File | null)[];
  alternative_image_urls: string[];
  short_description: string;
  full_description: string;
  key_ingredients: string;
  health_benefits: string;
  base_price: string;
  sale_price: string;
  cost_price: string;
  mrp_price: string;
  selling_price: string;
  currency: string;
  stock_quantity: string;
  low_stock_alert: string;
  stock_status: string;
  unit_quantity: string;
  product_unit: string;
  alternative_unit_enabled: boolean;
  allow_out_of_stock: boolean;
  enable_low_stock_alerts: boolean;
  variants: ProductVariantFormData[];
};

type Props = {
  formData: ProductFormData;
  onChange: (data: ProductFormData) => void;
};

const fieldClass =
  "h-12 w-full rounded-[8px] border border-[#DFDFDF] bg-[#F9FAFB] px-4 text-[16px] tracking-[-0.5px] text-[#111827] outline-none transition placeholder:text-black/50 focus:border-[#0A4833]";

const labelClass = "block text-[16px] font-medium leading-5 tracking-[-0.5px] text-[#0A4833]";

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
    <label className="space-y-2">
      <span className={labelClass}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className={fieldClass}
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
    <label className="space-y-2">
      <span className={labelClass}>{label}</span>
      <select value={value} onChange={(e) => onValueChange(e.target.value)} className={fieldClass}>
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
    <label className="space-y-2">
      <span className={labelClass}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-[8px] border border-[#DFDFDF] bg-[#F9FAFB] px-4 py-3 text-[16px] tracking-[-0.5px] text-[#111827] outline-none transition placeholder:text-black/50 focus:border-[#0A4833]"
      />
    </label>
  );
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-2 text-[18px] font-semibold leading-[22px] tracking-[-0.5px] text-[#0A4833]">
      <span className="flex h-5 w-5 items-center justify-center text-[#0A4833]">{icon}</span>
      <span>{title}</span>
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[12px] border border-[#DFDFDF] bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)] ${className}`}>
      {children}
    </section>
  );
}

const CATEGORY_OPTIONS = [
  { label: "Multi Grains", value: "multi_grains" },
  { label: "Small Grains", value: "small_grains" },
  { label: "Pulses", value: "pulses" },
  { label: "Nuts", value: "nuts" },
  { label: "Seeds", value: "seeds" },
  { label: "Rices", value: "rices" },
  { label: "Oils", value: "oils" },
  { label: "Spices", value: "spices" },
  { label: "Spreads & Butters", value: "spreads_butters" },
];

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
];

const UNIT_OPTIONS = [
  { label: "Kg", value: "kg" },
  { label: "Gram", value: "g" },
  { label: "Packet", value: "packet" },
  { label: "Box", value: "box" },
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
    return (value: string | boolean) => onChange({ ...formData, [field]: value });
  }

  function setAlternativeImage(index: number, file: File | null) {
    const nextImages = Array.from({ length: 4 }, (_, imageIndex) => formData.alternative_images?.[imageIndex] ?? null);
    nextImages[index] = file;
    onChange({ ...formData, alternative_images: nextImages });
  }

  function setVariant(index: number, field: keyof ProductVariantFormData) {
    return (value: string) => {
      const variants = formData.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant
      );
      onChange({ ...formData, variants });
    };
  }

  function addVariant() {
    onChange({
      ...formData,
      variants: [
        ...formData.variants,
        { variant_value: "", variant_unit: "", cost: "", price: "", stock: "" },
      ],
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle icon={<Info className="h-[18px] w-[18px]" />} title="Basic Information" />
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <TextField label="Product Name *" placeholder="Enter product name" value={formData.product_name} onValueChange={set("product_name")} />
          <SelectField
            label="Product Status"
            placeholder="Short tagline or subtitle"
            value={formData.product_status}
            options={STATUS_OPTIONS}
            onValueChange={set("product_status")}
          />
          <TextField label="Product Code *" placeholder="BWH-001" value={formData.product_code} onValueChange={set("product_code")} />
          <SelectField label="Category *" placeholder="Select category" value={formData.category} options={CATEGORY_OPTIONS} onValueChange={set("category")} />
          <label className="space-y-2">
            <span className={labelClass}>Brand Name</span>
            <div className="flex h-12 w-full items-center rounded-[8px] border border-[#DFDFDF] bg-[#F9FAFB] px-4 text-[16px] tracking-[-0.5px] text-black/50">
              ZEWADI
            </div>
          </label>
          <div className="grid grid-cols-[minmax(0,1fr)_32px] items-end gap-3">
            <SelectField label="Product Unit" placeholder="Choose Unit" value={formData.product_unit} options={UNIT_OPTIONS} onValueChange={set("product_unit")} />
            <button type="button" aria-label="Add unit" className="mb-0.5 grid h-10 w-8 place-items-center text-[#0A4833]">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <TextField label="Unit Quantity" placeholder="Type Quantity" value={formData.unit_quantity} onValueChange={set("unit_quantity")} />
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<ImageIcon className="h-[18px] w-[18px]" />} title="Product Images" />
        <label className="block cursor-pointer rounded-[8px] border border-dashed border-[#D7DCE2] bg-[#F9FAFB] px-5 py-10 text-center">
          <UploadCloud className="mx-auto h-8 w-8 text-[#9F8151]" />
          <span className="mt-2 block text-[14px] font-semibold tracking-[-0.5px] text-[#0A4833]">
            {formData.image ? formData.image.name : "Drag and drop images here, or click to browse"}
          </span>
          <span className="block text-[12px] tracking-[-0.5px] text-[#6B7280]">Recommended size: 800x800px. Supports JPG, PNG formats.</span>
          <input type="file" accept="image/*" onChange={(event) => onChange({ ...formData, image: event.target.files?.[0] ?? null })} className="sr-only" />
        </label>

        <div className="mt-6">
          <SectionTitle icon={<ImageIcon className="h-[18px] w-[18px]" />} title="Alternative Images" />
          {formData.alternative_image_urls?.length ? (
            <p className="-mt-3 mb-3 text-[12px] tracking-[-0.4px] text-[#6B7280]">
              Selecting new alternative images will replace the saved gallery.
            </p>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => {
              const file = formData.alternative_images?.[index] ?? null;
              const existingImageUrl = formData.alternative_image_urls?.[index] ?? null;

              return (
                <label
                  key={index}
                  className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-[#D7DCE2] bg-[#F9FAFB] px-3 py-4 text-center transition hover:border-[#0A4833]/50"
                >
                  {existingImageUrl && !file ? (
                    <span className="relative block h-10 w-10 overflow-hidden rounded-[6px] bg-white">
                      <img src={existingImageUrl} alt={`Existing alternative image ${index + 1}`} className="h-full w-full object-cover" />
                    </span>
                  ) : (
                    <UploadCloud className="h-8 w-8 text-[#9F8151]" />
                  )}
                  <span className="mt-2 line-clamp-2 max-w-full text-[11px] font-semibold leading-4 tracking-[-0.4px] text-[#0A4833]">
                    {file
                      ? file.name
                      : existingImageUrl
                        ? `Existing image ${index + 1}`
                        : "Drag and drop images here, or click to browse"}
                  </span>
                  <span className="mt-1 text-[9px] leading-3 tracking-[-0.3px] text-[#6B7280]">
                    Recommended size: 800x800px. Supports JPG, PNG formats.
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setAlternativeImage(index, event.target.files?.[0] ?? null)}
                    className="sr-only"
                  />
                </label>
              );
            })}
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<PencilLine className="h-[18px] w-[18px]" />} title="Product Description" />
        <div className="space-y-4">
          <TextareaField label="Short Description *" placeholder="Brief product overview (150 characters)" value={formData.short_description} rows={3} onValueChange={set("short_description")} />
          <TextareaField label="Full Description" placeholder="Detailed product description" value={formData.full_description} rows={6} onValueChange={set("full_description")} />
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<Leaf className="h-[18px] w-[18px]" />} title="Nutritional & Wellness Information" />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextareaField label="Key Ingredients" placeholder="List main ingredients" value={formData.key_ingredients} rows={3} onValueChange={set("key_ingredients")} />
          <TextareaField label="Health Benefits" placeholder="Describe health benefits" value={formData.health_benefits} rows={3} onValueChange={set("health_benefits")} />
        </div>
      </Card>

      <label className="flex max-w-2xl items-center gap-3 rounded-[8px] border border-[#DFDFDF] bg-[#F9FAFB] px-4 py-3 text-[14px] font-medium tracking-[-0.5px] text-[#374151]">
        <input
          type="checkbox"
          checked={false}
          disabled
          className="h-[13px] w-[13px]"
        />
        <span>Variants are paused for this v1 flow. Create each pack or size as a separate product/SKU.</span>
      </label>

      {false ? (
        <Card>
          <h3 className="mb-6 text-[18px] font-semibold leading-[22px] tracking-[-0.5px] text-[#0A4833]">Alternative Unit</h3>
          <div className="rounded-[8px] border border-[#DFDFDF] p-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h4 className="text-[16px] font-medium tracking-[-0.5px] text-[#0A4833]">Product Variants</h4>
              <button type="button" onClick={addVariant} className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#9F8151] px-4 text-[14px] font-medium tracking-[-0.5px] text-white">
                <Plus className="h-4 w-4" />
                Add Variant
              </button>
            </div>
            <div className="space-y-3">
              {formData.variants.map((variant, index) => (
                <div key={index} className="grid gap-3 sm:grid-cols-4">
                  <input value={variant.variant_value} onChange={(event) => setVariant(index, "variant_value")(event.target.value)} className={fieldClass} placeholder="Variant Value" />
                  <select value={variant.variant_unit} onChange={(event) => setVariant(index, "variant_unit")(event.target.value)} className={fieldClass}>
                    <option value="">Choose Unit</option>
                    {UNIT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input value={variant.cost} onChange={(event) => setVariant(index, "cost")(event.target.value)} className={fieldClass} placeholder="Cost" />
                  <input value={variant.price} onChange={(event) => setVariant(index, "price")(event.target.value)} className={fieldClass} placeholder="MRP" />
                  <input value={variant.stock} onChange={(event) => setVariant(index, "stock")(event.target.value)} className={`${fieldClass} sm:col-span-2`} placeholder="Stock Quantity" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : null}

      <Card>
        <SectionTitle icon={<DollarSign className="h-[18px] w-[18px]" />} title="Pricing" />
        <div className="grid gap-6 sm:grid-cols-3">
          <TextField label="Cost Price *" placeholder="0.00" type="number" value={formData.cost_price} onValueChange={set("cost_price")} />
          <TextField label="MRP *" placeholder="0.00" type="number" value={formData.mrp_price} onValueChange={set("mrp_price")} />
          <TextField label="Selling Price *" placeholder="0.00" type="number" value={formData.selling_price} onValueChange={set("selling_price")} />
          <SelectField label="Currency" placeholder="Select currency" value={formData.currency} options={CURRENCY_OPTIONS} onValueChange={set("currency")} />
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<Boxes className="h-[18px] w-[18px]" />} title="Inventory Management" />
        <div className="grid gap-6 sm:grid-cols-3">
          <TextField label="Stock Quantity *" placeholder="0" type="number" value={formData.stock_quantity} onValueChange={set("stock_quantity")} />
          <TextField label="Low Stock Alert" placeholder="5" type="number" value={formData.low_stock_alert} onValueChange={set("low_stock_alert")} />
          <SelectField label="Stock Status" placeholder="Select status" value={formData.stock_status} options={STOCK_STATUS_OPTIONS} onValueChange={set("stock_status")} />
        </div>
        <div className="mt-6 space-y-3">
          <label className="flex items-center gap-3 text-[16px] tracking-[-0.5px] text-[#0A4833]">
            <input type="checkbox" checked={formData.allow_out_of_stock} onChange={(e) => set("allow_out_of_stock")(e.target.checked)} className="h-[13px] w-[13px] accent-[#0A4833]" />
            Allow orders when out of stock
          </label>
          <label className="flex items-center gap-3 text-[16px] tracking-[-0.5px] text-[#0A4833]">
            <input type="checkbox" checked={formData.enable_low_stock_alerts} onChange={(e) => set("enable_low_stock_alerts")(e.target.checked)} className="h-[13px] w-[13px] accent-[#0A4833]" />
            Enable low stock alerts
          </label>
        </div>
      </Card>
    </div>
  );
}
