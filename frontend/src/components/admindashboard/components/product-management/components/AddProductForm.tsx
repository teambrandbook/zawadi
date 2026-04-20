import { ImageIcon, Info, Leaf, Package, Tags } from "lucide-react";
import { ReactNode } from "react";

type FieldProps = {
  label: string;
  placeholder: string;
};

function TextField({ label, placeholder }: FieldProps) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-[#344054]">{label}</span>
      <input
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#667085] outline-none"
      />
    </label>
  );
}

function SelectField({ label, placeholder }: FieldProps) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-[#344054]">{label}</span>
      <select className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#667085] outline-none">
        <option>{placeholder}</option>
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

export default function AddProductForm() {
  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle icon={<Info className="h-4 w-4" />} title="Basic Information" />
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label="Product Name *" placeholder="Enter product name" />
          <TextField label="Product Subtitle" placeholder="Short tagline or subtitle" />
          <TextField label="SKU / Product Code *" placeholder="BWT-001" />
          <SelectField label="Category *" placeholder="Select category" />
          <TextField label="Brand Name" placeholder="ZEWADI" />
          <SelectField label="Product Status" placeholder="Draft" />
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
              placeholder="Brief product overview (50 characters)"
              className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#667085] outline-none"
            />
          </label>
          <label className="space-y-1">
            <span className="block text-[11px] font-medium text-[#344054]">Full Description</span>
            <textarea
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
          <TextField label="Base Price *" placeholder="0.00" />
          <TextField label="Sale Price" placeholder="0.00" />
          <SelectField label="Currency" placeholder="USD ($)" />
        </div>

        <div className="mt-4 rounded-md border border-[#EAECF0]">
          <div className="flex items-center justify-between border-b border-[#EAECF0] px-3 py-2">
            <p className="text-[11px] font-semibold text-[#344054]">Product Variants</p>
            <button type="button" className="rounded-md bg-[#A1844F] px-3 py-1.5 text-[11px] font-medium text-white">
              + Add Variant
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 p-2">
            <input placeholder="Variant name" className="h-8 rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-2 text-[11px] text-[#667085] outline-none" />
            <input placeholder="SKU" className="h-8 rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-2 text-[11px] text-[#667085] outline-none" />
            <input placeholder="Price" className="h-8 rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-2 text-[11px] text-[#667085] outline-none" />
            <input placeholder="Stock" className="h-8 rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-2 text-[11px] text-[#667085] outline-none" />
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<Package className="h-4 w-4" />} title="Inventory Management" />
        <div className="grid gap-3 sm:grid-cols-3">
          <TextField label="Stock Quantity *" placeholder="0" />
          <TextField label="Low Stock Alert" placeholder="5" />
          <SelectField label="Stock Status" placeholder="In Stock" />
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
