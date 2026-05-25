"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";
import ProductBulkActions from "./components/ProductBulkActions";
import ProductFilters from "./components/ProductFilters";
import ProductsHeader from "./components/ProductsHeader";
import ProductStatsGrid from "./components/ProductStatsGrid";
import ProductsTable, { ProductRow, ProductVariant } from "./components/ProductsTable";

type ProductDetail = {
  id: string;
  name: string;
  subtitle: string;
  sku: string;
  category: string;
  status: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  keyIngredients: string;
  healthBenefits: string;
  basePrice: number;
  mrpPrice: number;
  sellingPrice: number;
  discountPercent: number;
  currency: string;
  stockQuantity: number;
  lowStockAlert: number;
  stockStatus: string;
  variantNames: string[];
  variants: ProductVariant[];
};

function toProductImageUrl(imagePath?: string | null) {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=120&h=120&fit=crop";
  }
  return getImageUrl(imagePath);
}

// Updated to map complex variants for the table component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiProduct(item: Record<string, any>, index: number): ProductRow {
  return {
    id: String(item.id ?? `p-${index}`),
    name: String(item.product_name ?? item.name ?? "Unnamed Product"),
    subtitle: String(item.short_description ?? item.description ?? item.product_subtitle ?? item.subtitle ?? ""),
    sku: String(item.sku ?? item.product_code ?? `SKU-${index}`),
    category: String(item.category ?? "—"),
    variants: [],
    price: parseFloat(item.selling_price ?? item.sale_price ?? item.price ?? item.base_price ?? 0),
    stockUnits: parseInt(item.stock_quantity ?? item.stock ?? 0, 10),
    stockStatus: String(item.stock_status ?? ""),
    lowStockAlert: parseInt(item.low_stock_alert ?? 0, 10),
    status: String(item.product_status ?? item.status ?? "").toLowerCase() === "active" ? "Active" : "Draft",
    sales: parseInt(item.sales ?? item.total_sales ?? 0, 10),
    featured: Boolean(item.featured ?? item.is_featured ?? false),
    image: toProductImageUrl(item.image ?? item.cover_image),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiProductDetail(item: Record<string, any>): ProductDetail {
  return {
    id: String(item.id ?? ""),
    name: String(item.product_name ?? item.name ?? "Unnamed Product"),
    subtitle: String(item.product_subtitle ?? ""),
    sku: String(item.product_code ?? item.sku ?? ""),
    category: String(item.category ?? "—"),
    status: String(item.product_status ?? item.status ?? "draft"),
    image: toProductImageUrl(item.image ?? item.cover_image),
    shortDescription: String(item.short_description ?? item.description ?? ""),
    fullDescription: String(item.full_description ?? ""),
    keyIngredients: String(item.key_ingredients ?? ""),
    healthBenefits: String(item.health_benefits ?? ""),
    basePrice: parseFloat(item.cost_price ?? item.base_price ?? item.price ?? 0),
    mrpPrice: parseFloat(item.mrp_price ?? item.sale_price ?? item.base_price ?? 0),
    sellingPrice: parseFloat(item.selling_price ?? item.sale_price ?? item.base_price ?? 0),
    discountPercent: parseFloat(item.discount_percent ?? 0),
    currency: String(item.currency ?? "USD"),
    stockQuantity: parseInt(item.stock_quantity ?? item.stock ?? 0, 10),
    lowStockAlert: parseInt(item.low_stock_alert ?? 0, 10),
    stockStatus: String(item.stock_status ?? "in_stock"),
    variantNames: Array.isArray(item.variants)
      ? item.variants
          .map((variant: { variant_name?: string; variant_value?: string }) => 
            String(variant.variant_value ?? variant.variant_name ?? "").trim()
          )
          .filter(Boolean)
      : [],
    variants: Array.isArray(item.variants)
      ? item.variants.map((variant: Record<string, unknown>) => ({
          variant_value: String(variant.variant_value ?? variant.variant_name ?? ""),
          variant_unit: String(variant.variant_unit ?? ""),
          cost: parseFloat(String(variant.cost ?? 0)),
          price: parseFloat(String(variant.price ?? 0)),
          stock: parseInt(String(variant.stock ?? 0), 10),
        }))
      : [],
  };
}

function toCsv(rows: ProductRow[]) {
  const header = ["Name", "SKU", "Category", "Pack Policy", "Selling Price", "Stock", "Status", "Sales", "Featured"];
  const body = rows.map((p) => {
    const variantString = "Separate SKU";
      
    return [
      p.name, 
      p.sku, 
      p.category, 
      variantString, 
      p.price, 
      p.stockUnits, 
      p.status, 
      p.sales, 
      p.featured ? "Yes" : "No"
    ];
  });
  return [header, ...body].map((line) => line.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n");
}

function downloadCsv(fileName: string, rows: ProductRow[]) {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <p className="text-sm text-[#374151]">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-[#D1D5DB] px-4 py-2 text-sm text-[#374151] hover:bg-[#F3F4F6]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-[#DC2626] px-4 py-2 text-sm font-medium text-white hover:bg-[#B91C1C]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductDetailsDialog({
  product,
  isLoading,
  onClose,
}: {
  product: ProductDetail | null;
  isLoading: boolean;
  onClose: () => void;
}) {
  const detailRows = product
    ? [
        { label: "Product Name", value: product.name },
        { label: "Subtitle", value: product.subtitle || "—" },
        { label: "SKU", value: product.sku || "—" },
        { label: "Category", value: product.category || "—" },
        { label: "Status", value: product.status || "—" },
        { label: "Cost Price", value: `${product.currency} ${product.basePrice.toFixed(2)}` },
        { label: "MRP", value: `${product.currency} ${product.mrpPrice.toFixed(2)}` },
        { label: "Selling Price", value: `${product.currency} ${product.sellingPrice.toFixed(2)}` },
        { label: "Discount", value: product.discountPercent > 0 ? `${product.discountPercent.toFixed(0)}%` : "—" },
        { label: "Stock Quantity", value: String(product.stockQuantity) },
        { label: "Low Stock Alert", value: String(product.lowStockAlert) },
        { label: "Stock Status", value: product.stockStatus || "—" },
        { label: "Short Description", value: product.shortDescription || "—" },
        { label: "Full Description", value: product.fullDescription || "—" },
        { label: "Key Ingredients", value: product.keyIngredients || "—" },
        { label: "Health Benefits", value: product.healthBenefits || "—" },
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#0A4833]">Product Details</h2>
            <p className="mt-1 text-sm text-[#6B7280]">Full product information</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-[#D1D5DB] px-3 py-1.5 text-sm text-[#374151]">
            Close
          </button>
        </div>

        {isLoading ? (
          <div className="mt-6 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-sm text-[#6B7280]">
            Loading product details...
          </div>
        ) : product ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
              <img src={product.image} alt={product.name} className="h-[220px] w-full object-cover" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {detailRows.map((row) => (
                <div key={row.label} className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-3 sm:col-span-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">{row.label}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-[#0A4833]">{row.value}</p>
                </div>
              ))}
              <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-3 sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Pack/SKU Policy</p>
                {false ? (
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                      <thead className="bg-[#F3F4F6] text-xs uppercase text-[#6B7280]">
                        <tr>
                          <th className="border border-[#E5E7EB] px-3 py-2">Variant</th>
                          <th className="border border-[#E5E7EB] px-3 py-2">Unit</th>
                          <th className="border border-[#E5E7EB] px-3 py-2">Cost</th>
                          <th className="border border-[#E5E7EB] px-3 py-2">MRP</th>
                          <th className="border border-[#E5E7EB] px-3 py-2">Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product!.variants.map((variant, index) => (
                          <tr key={`${variant.variant_value}-${variant.variant_unit}-${index}`} className="text-[#0A4833]">
                            <td className="border border-[#E5E7EB] px-3 py-2">{variant.variant_value || "—"}</td>
                            <td className="border border-[#E5E7EB] px-3 py-2">{variant.variant_unit || "—"}</td>
                            <td className="border border-[#E5E7EB] px-3 py-2">{product!.currency} {variant.cost.toFixed(2)}</td>
                            <td className="border border-[#E5E7EB] px-3 py-2">{product!.currency} {variant.price.toFixed(2)}</td>
                            <td className="border border-[#E5E7EB] px-3 py-2">{variant.stock} units</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-[#0A4833]">
                    Create each pack or size as a separate product with its own SKU, stock, and pricing.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
            Failed to load product details.
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [productStatus, setProductStatus] = useState("All Status");
  const [stockStatus, setStockStatus] = useState("All Stock");
  const [sortBy, setSortBy] = useState("Newest First");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<ProductDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await api.get("/products/");
      const raw: any[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.results)
        ? res.data.results
        : [];
      setProducts(raw.map(mapApiProduct));
    } catch {
      setFetchError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let rows = products.filter((p) => {
      const bySearch = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const byStatus = productStatus === "All Status" || p.status === productStatus;
      const byStock =
        stockStatus === "All Stock" ||
        (stockStatus === "In Stock" && (p.stockStatus ? p.stockStatus === "in_stock" : p.stockUnits > (p.lowStockAlert ?? 20))) ||
        (stockStatus === "Low Stock" && (p.stockStatus ? p.stockStatus === "low_stock" : p.stockUnits > 0 && p.stockUnits <= (p.lowStockAlert ?? 20))) ||
        (stockStatus === "Out of Stock" && p.stockUnits === 0);
      return bySearch && byStatus && byStock;
    });

    if (sortBy === "Price Low to High") rows = [...rows].sort((a, b) => a.price - b.price);
    if (sortBy === "Price High to Low") rows = [...rows].sort((a, b) => b.price - a.price);

    return rows;
  }, [products, query, productStatus, stockStatus, sortBy]);

  const perPage = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleSelectAllPage() {
    const ids = pageRows.map((r) => r.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
      return;
    }
    setSelectedIds((prev) => [...new Set([...prev, ...ids])]);
  }

  function selectedRows() {
    return products.filter((p) => selectedIds.includes(p.id));
  }

  async function changeVisibility() {
    if (selectedIds.length === 0) {
      toast.warning("Select at least one product.");
      return;
    }
    const toActive = products
      .filter((p) => selectedIds.includes(p.id))
      .map((p) => ({ id: p.id, newStatus: p.status === "Active" ? "inactive" : "active" }));

    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: p.status === "Active" ? "Draft" : "Active" } : p))
    );

    try {
      await Promise.all(
        toActive.map(({ id, newStatus }) => api.patch(`/products/${id}/`, { product_status: newStatus }))
      );
      toast.success("Product visibility updated.");
    } catch {
      toast.error("Failed to update visibility. Changes may not be saved.");
      fetchProducts();
    }
  }

  async function markFeatured() {
    if (selectedIds.length === 0) {
      toast.warning("Select at least one product.");
      return;
    }
    setProducts((prev) => prev.map((p) => (selectedIds.includes(p.id) ? { ...p, featured: true } : p)));
    try {
      await Promise.all(selectedIds.map((id) => api.patch(`/products/${id}/`, { is_featured: true })));
      toast.success("Products marked as featured.");
    } catch {
      toast.error("Failed to mark as featured. Changes may not be saved.");
      fetchProducts();
    }
  }

  async function archiveSelected() {
    try {
      await Promise.all(selectedIds.map((id) => api.delete(`/products/${id}/`)));
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
      setShowArchiveConfirm(false);
      toast.success("Selected products deleted.");
    } catch {
      setShowArchiveConfirm(false);
      toast.error("Failed to delete selected products. Please try again.");
    }
  }

  async function deleteSingleProduct() {
    if (!deleteTargetId) return;

    try {
      await api.delete(`/products/${deleteTargetId}/`);
      setProducts((prev) => prev.filter((product) => product.id !== deleteTargetId));
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetId));
      setDeleteTargetId(null);
      toast.success("Product deleted.");
    } catch {
      toast.error("Failed to delete product. Please try again.");
    }
  }

  async function toggleFeaturedRow(id: string) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const newFeatured = !product.featured;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: newFeatured } : p)));
    try {
      await api.patch(`/products/${id}/`, { is_featured: newFeatured });
    } catch {
      toast.error("Failed to update featured status.");
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !newFeatured } : p)));
    }
  }

  function applyQuickFilter(value: string) {
    if (value === "Low Stock") setStockStatus("Low Stock");
    if (value === "Best Selling") setSortBy("Price High to Low");
    if (value === "Recently Added") setSortBy("Newest First");
    setPage(1);
  }

  async function handleViewRow(id: string) {
    setIsDetailLoading(true);
    setSelectedProductDetail(null);
    try {
      const response = await api.get(`/products/${id}/`);
      setSelectedProductDetail(mapApiProductDetail(response.data));
    } catch {
      toast.error("Failed to load product details.");
    } finally {
      setIsDetailLoading(false);
    }
  }

  function handleEditRow(id: string) {
    router.push(`/admindashboard/products/add?id=${encodeURIComponent(id)}`);
  }

  function handleDeleteRow(id: string) {
    setDeleteTargetId(id);
  }

  return (
    <section className="w-full bg-white p-4 lg:p-6">
      {deleteTargetId ? (
        <ConfirmDialog
          message="Are you sure you want to delete this product? This cannot be undone."
          onConfirm={deleteSingleProduct}
          onCancel={() => setDeleteTargetId(null)}
        />
      ) : null}

      {(isDetailLoading || selectedProductDetail) ? (
        <ProductDetailsDialog
          product={selectedProductDetail}
          isLoading={isDetailLoading}
          onClose={() => {
            if (!isDetailLoading) setSelectedProductDetail(null);
          }}
        />
      ) : null}

      {showArchiveConfirm && (
        <ConfirmDialog
          message={`Are you sure you want to delete ${selectedIds.length} selected product(s)? This cannot be undone.`}
          onConfirm={archiveSelected}
          onCancel={() => setShowArchiveConfirm(false)}
        />
      )}

      <div className="mx-auto max-w-[1180px] space-y-4">
        <ProductsHeader
          onExport={() => downloadCsv("products.csv", filtered)}
          onAdd={() => router.push("/admindashboard/products/add")}
        />

        <ProductStatsGrid rows={products} />

        {isLoading && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 text-sm text-[#4B5563]">
            Loading products...
          </div>
        )}
        {fetchError && (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
            {fetchError}
          </div>
        )}
        {!isLoading && !fetchError && products.length === 0 && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-8 text-center text-sm text-[#6B7280]">
            No products found. Click &quot;Add Product&quot; to create the first one.
          </div>
        )}

        <ProductFilters
          search={query}
          productStatus={productStatus}
          stockStatus={stockStatus}
          sortBy={sortBy}
          onChange={(key, value) => {
            if (key === "search") setQuery(value);
            if (key === "productStatus") setProductStatus(value);
            if (key === "stockStatus") setStockStatus(value);
            if (key === "sortBy") setSortBy(value);
            setPage(1);
          }}
          onClear={() => {
            setQuery("");
            setProductStatus("All Status");
            setStockStatus("All Stock");
            setSortBy("Newest First");
            setPage(1);
          }}
        />

        <ProductBulkActions
          selectedCount={selectedIds.length}
          totalCount={filtered.length}
          onExportSelected={() => {
            const rows = selectedRows();
            if (rows.length === 0) {
              toast.warning("Select at least one product.");
              return;
            }
            downloadCsv("products-selected.csv", rows);
          }}
          onArchive={() => {
            if (selectedIds.length === 0) {
              toast.warning("Select at least one product.");
              return;
            }
            setShowArchiveConfirm(true);
          }}
        />

        <ProductsTable
          rows={pageRows}
          page={safePage}
          totalPages={totalPages}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAllPage={toggleSelectAllPage}
          onPageChange={setPage}
          onViewRow={handleViewRow}
          onEditRow={handleEditRow}
          onDeleteRow={handleDeleteRow}
        />
      </div>
    </section>
  );
}
