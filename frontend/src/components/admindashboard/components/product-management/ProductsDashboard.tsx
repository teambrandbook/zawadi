"use client";

import { useMemo, useState } from "react";
import ProductBulkActions from "./components/ProductBulkActions";
import ProductFilters from "./components/ProductFilters";
import ProductsHeader from "./components/ProductsHeader";
import ProductStatsGrid from "./components/ProductStatsGrid";
import ProductsTable, { ProductRow } from "./components/ProductsTable";

const allProducts: ProductRow[] = [
  { id: "p1", name: "Organic Buckwheat Flour", subtitle: "Premium grade", sku: "BW-FL-001", category: "Flour", variant: "500g, 1kg, 2kg", price: 12.99, stockUnits: 284, status: "Active", sales: 1248, featured: false, image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=120&h=120&fit=crop" },
  { id: "p2", name: "Buckwheat Groats", subtitle: "Whole grains", sku: "BW-GR-002", category: "Grains", variant: "250g, 500g", price: 9.49, stockUnits: 18, status: "Active", sales: 892, featured: false, image: "https://images.unsplash.com/photo-1615486363972-f79a9d01a7ae?w=120&h=120&fit=crop" },
  { id: "p3", name: "Buckwheat Pasta", subtitle: "Whole grains", sku: "BW-PA-003", category: "Pasta", variant: "250g, 500g", price: 9.49, stockUnits: 18, status: "Active", sales: 892, featured: false, image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=120&h=120&fit=crop" },
  { id: "p4", name: "Buckwheat Cookies", subtitle: "Crunchy bites", sku: "BW-CK-004", category: "Snacks", variant: "200g", price: 7.99, stockUnits: 42, status: "Draft", sales: 410, featured: true, image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=120&h=120&fit=crop" },
  { id: "p5", name: "Buckwheat Noodles", subtitle: "Quick meal", sku: "BW-ND-005", category: "Noodles", variant: "300g", price: 8.99, stockUnits: 9, status: "Active", sales: 605, featured: false, image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=120&h=120&fit=crop" },
  { id: "p6", name: "Buckwheat Mix", subtitle: "Baking mix", sku: "BW-MX-006", category: "Flour", variant: "1kg", price: 14.99, stockUnits: 0, status: "Draft", sales: 320, featured: false, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&h=120&fit=crop" },
  { id: "p7", name: "Buckwheat Granola", subtitle: "Breakfast", sku: "BW-GN-007", category: "Snacks", variant: "450g", price: 11.5, stockUnits: 66, status: "Active", sales: 720, featured: true, image: "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=120&h=120&fit=crop" },
  { id: "p8", name: "Buckwheat Crackers", subtitle: "Healthy snack", sku: "BW-CR-008", category: "Snacks", variant: "300g", price: 6.25, stockUnits: 12, status: "Active", sales: 512, featured: false, image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=120&h=120&fit=crop" },
  { id: "p9", name: "Buckwheat Tea", subtitle: "Herbal", sku: "BW-TE-009", category: "Tea", variant: "20 bags", price: 5.75, stockUnits: 75, status: "Draft", sales: 211, featured: false, image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=120&h=120&fit=crop" },
  { id: "p10", name: "Buckwheat Energy Bar", subtitle: "12 pack", sku: "BW-EB-010", category: "Snacks", variant: "12 pcs", price: 12.25, stockUnits: 21, status: "Active", sales: 480, featured: false, image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=120&h=120&fit=crop" },
  { id: "p11", name: "Buckwheat Pancake Mix", subtitle: "Morning favorite", sku: "BW-PM-011", category: "Flour", variant: "500g", price: 10.15, stockUnits: 14, status: "Active", sales: 933, featured: true, image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=120&h=120&fit=crop" },
  { id: "p12", name: "Buckwheat Seeds", subtitle: "Natural seed", sku: "BW-SD-012", category: "Grains", variant: "1kg", price: 13.49, stockUnits: 3, status: "Draft", sales: 100, featured: false, image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=120&h=120&fit=crop" },
];

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
  const [products, setProducts] = useState<ProductRow[]>(allProducts);
  const [query, setQuery] = useState("");
  const [productStatus, setProductStatus] = useState("All Status");
  const [stockStatus, setStockStatus] = useState("All Stock");
  const [sortBy, setSortBy] = useState("Newest First");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

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
    if (sortBy === "Newest First") rows = [...rows].reverse();

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

  function archiveSelected() {
    if (selectedIds.length === 0) return window.alert("Select at least one product.");
    setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
  }

  function toggleFeaturedRow(id: string) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)));
  }

  function applyQuickFilter(value: string) {
    if (value === "Featured") setProducts((prev) => [...prev].map((p) => ({ ...p, featured: true })));
    if (value === "Low Stock") setStockStatus("Low Stock");
    if (value === "Best Selling") setSortBy("Price High to Low");
    if (value === "Recently Added") setSortBy("Newest First");
    setPage(1);
  }

  return (
    <section className="w-full bg-[#F3F4F6] p-4 lg:p-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <ProductsHeader
          query={query}
          onQueryChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          onFilter={() => setProductStatus((s) => (s === "All Status" ? "Active" : "All Status"))}
          onExport={() => downloadCsv("products.csv", filtered)}
          onAdd={() => window.alert("Add Product clicked")}
        />

        <ProductStatsGrid />

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
