"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import ProductBulkActions from "./components/ProductBulkActions";
import ProductFilters from "./components/ProductFilters";
import ProductsHeader from "./components/ProductsHeader";
import ProductStatsGrid from "./components/ProductStatsGrid";
import ProductsTable, { ProductRow } from "./components/ProductsTable";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiProduct(item: Record<string, any>, index: number): ProductRow {
  return {
    id: String(item.id ?? `p-${index}`),
    name: String(item.name ?? "Unnamed Product"),
    subtitle: String(item.description ?? item.subtitle ?? ""),
    sku: String(item.sku ?? item.product_code ?? `SKU-${index}`),
    category: String(item.category ?? "—"),
    variant: String(item.variant ?? item.variants ?? "—"),
    price: parseFloat(item.price ?? item.base_price ?? 0),
    stockUnits: parseInt(item.stock_quantity ?? item.stock ?? 0, 10),
    status: item.status === "active" || item.status === "Active" ? "Active" : "Draft",
    sales: parseInt(item.sales ?? item.total_sales ?? 0, 10),
    featured: Boolean(item.featured ?? item.is_featured ?? false),
    image: String(item.image ?? item.cover_image ?? "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=120&h=120&fit=crop"),
  };
}

function toCsv(rows: ProductRow[]) {
  const header = ["Name", "SKU", "Category", "Variant", "Price", "Stock", "Status", "Sales", "Featured"];
  const body = rows.map((p) => [p.name, p.sku, p.category, p.variant, p.price, p.stockUnits, p.status, p.sales, p.featured ? "Yes" : "No"]);
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

  const fetchProducts = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await api.get("/products/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw: Record<string, any>[] = Array.isArray(res.data)
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
        (stockStatus === "In Stock" && p.stockUnits > 20) ||
        (stockStatus === "Low Stock" && p.stockUnits > 0 && p.stockUnits <= 20) ||
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

  function changeVisibility() {
    if (selectedIds.length === 0) return window.alert("Select at least one product.");
    setProducts((prev) => prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: p.status === "Active" ? "Draft" : "Active" } : p)));
  }

  function markFeatured() {
    if (selectedIds.length === 0) return window.alert("Select at least one product.");
    setProducts((prev) => prev.map((p) => (selectedIds.includes(p.id) ? { ...p, featured: true } : p)));
  }

  async function archiveSelected() {
    if (selectedIds.length === 0) return window.alert("Select at least one product.");
    try {
      await Promise.all(selectedIds.map((id) => api.delete(`/products/${id}/`)));
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    } catch {
      window.alert("Failed to delete selected products. Please try again.");
    }
  }

  function toggleFeaturedRow(id: string) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)));
  }

  function applyQuickFilter(value: string) {
    if (value === "Low Stock") setStockStatus("Low Stock");
    if (value === "Best Selling") setSortBy("Price High to Low");
    if (value === "Recently Added") setSortBy("Newest First");
    setPage(1);
  }

  return (
    <section className="w-full bg-white p-4 lg:p-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <ProductsHeader
          query={query}
          onQueryChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          onFilter={() => setProductStatus((s) => (s === "All Status" ? "Active" : "All Status"))}
          onExport={() => downloadCsv("products.csv", filtered)}
          onAdd={() => router.push("/admindashboard/products/add")}
        />

        <ProductStatsGrid />

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
          onQuickFilter={applyQuickFilter}
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
          onSelectAllCurrent={toggleSelectAllPage}
          onChangeVisibility={changeVisibility}
          onMarkFeatured={markFeatured}
          onExportSelected={() => {
            const rows = selectedRows();
            if (rows.length === 0) return window.alert("Select at least one product.");
            downloadCsv("products-selected.csv", rows);
          }}
          onArchive={archiveSelected}
        />

        <ProductsTable
          rows={pageRows}
          page={safePage}
          totalPages={totalPages}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAllPage={toggleSelectAllPage}
          onPageChange={setPage}
          onToggleFeaturedRow={toggleFeaturedRow}
        />
      </div>
    </section>
  );
}
