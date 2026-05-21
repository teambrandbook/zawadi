"use client";

import { useEffect, useState } from "react";
import { Coins, Percent, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";

type TaxRate = {
  id: number;
  country: string;
  region: string | null;
  tax_category: string;
  tax_category_name: string;
  rate: string;
  rate_percent: number;
  name: string;
  effective_from: string;
  is_active: boolean;
};

type TaxCategory = { code: string; name: string };
type Currency = {
  code: string;
  name: string;
  symbol: string;
  decimal_places: number;
  is_active: boolean;
};

const GCC_COUNTRIES: Record<string, string> = {
  SA: "Saudi Arabia",
  AE: "United Arab Emirates",
  BH: "Bahrain",
  OM: "Oman",
  KW: "Kuwait",
  QA: "Qatar",
};

const emptyForm = {
  country: "SA",
  tax_category: "",
  rate_percent: "",
  name: "",
  effective_from: new Date().toISOString().slice(0, 10),
};

export default function TaxCurrencySection() {
  const [rates, setRates] = useState<TaxRate[]>([]);
  const [categories, setCategories] = useState<TaxCategory[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void Promise.all([
      api.get<TaxRate[]>("/tax/rates/"),
      api.get<TaxCategory[]>("/tax/categories/"),
      api.get<Currency[]>("/tax/currencies/all/"),
    ])
      .then(([ratesRes, catsRes, currRes]) => {
        setRates(ratesRes.data);
        setCategories(catsRes.data);
        setCurrencies(currRes.data);
        if (catsRes.data.length > 0) {
          setForm((f) => ({ ...f, tax_category: catsRes.data[0].code }));
        }
      })
      .catch(() => toast.error("Failed to load tax settings."))
      .finally(() => setLoading(false));
  }, []);

  async function toggleActive(rate: TaxRate) {
    try {
      const res = await api.patch<TaxRate>(`/tax/rates/${rate.id}/`, {
        is_active: !rate.is_active,
      });
      setRates((prev) => prev.map((r) => (r.id === rate.id ? res.data : r)));
    } catch {
      toast.error("Could not update rate.");
    }
  }

  async function deleteRate(id: number) {
    if (!confirm("Delete this tax rate?")) return;
    try {
      await api.delete(`/tax/rates/${id}/`);
      setRates((prev) => prev.filter((r) => r.id !== id));
      toast.success("Rate deleted.");
    } catch {
      toast.error("Could not delete rate.");
    }
  }

  async function handleAddRate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post<TaxRate>("/tax/rates/", {
        country: form.country,
        tax_category: form.tax_category,
        rate_percent: parseFloat(form.rate_percent),
        name: form.name,
        effective_from: form.effective_from,
      });
      setRates((prev) => [...prev, res.data]);
      setForm({ ...emptyForm, tax_category: categories[0]?.code ?? "" });
      setShowAddForm(false);
      toast.success("Tax rate added.");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string> } })?.response?.data;
      const msg = data
        ? Object.values(data).join(" ")
        : "Failed to add rate.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-[#DFDFDF] bg-white p-6 text-sm text-[#667085]">
        Loading tax &amp; currency settings…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Tax Rates */}
      <article className="rounded-lg border border-[#DFDFDF] bg-white p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="inline-flex items-center gap-2 text-lg font-bold text-[#0A4833]">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#0A4833]/10">
                <Percent size={13} />
              </span>
              Tax Rates
            </h3>
            <p className="mt-1 text-xs text-[#4B5563]">
              Configure VAT / tax rates per country and tax category
            </p>
          </div>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-[#0A4833] px-3 text-xs font-semibold text-white"
          >
            <Plus size={12} />
            Add Rate
          </button>
        </div>

        {/* Add Rate Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddRate}
            className="mt-4 rounded-md border border-[#DFDFDF] bg-[#EBE1CF4D] p-4"
          >
            <p className="mb-3 text-xs font-bold text-[#0A4833]">New Tax Rate</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#374151]">Country</label>
                <select
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  className="h-9 w-full rounded-md border border-[#DFDFDF] bg-white px-3 text-sm text-[#0A4833] outline-none"
                >
                  {Object.entries(GCC_COUNTRIES).map(([code, name]) => (
                    <option key={code} value={code}>
                      {code} — {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#374151]">Tax Category</label>
                <select
                  value={form.tax_category}
                  onChange={(e) => setForm((f) => ({ ...f, tax_category: e.target.value }))}
                  className="h-9 w-full rounded-md border border-[#DFDFDF] bg-white px-3 text-sm text-[#0A4833] outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#374151]">Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="15"
                  value={form.rate_percent}
                  onChange={(e) => setForm((f) => ({ ...f, rate_percent: e.target.value }))}
                  className="h-9 w-full rounded-md border border-[#DFDFDF] bg-white px-3 text-sm text-[#0A4833] outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#374151]">Name / Label</label>
                <input
                  type="text"
                  placeholder="SA Standard VAT"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="h-9 w-full rounded-md border border-[#DFDFDF] bg-white px-3 text-sm text-[#0A4833] outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#374151]">Effective From</label>
                <input
                  type="date"
                  value={form.effective_from}
                  onChange={(e) => setForm((f) => ({ ...f, effective_from: e.target.value }))}
                  className="h-9 w-full rounded-md border border-[#DFDFDF] bg-white px-3 text-sm text-[#0A4833] outline-none"
                  required
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="inline-flex h-8 items-center rounded-md border border-[#DFDFDF] px-4 text-xs font-semibold text-[#4B5563]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-8 items-center rounded-md bg-[#0A4833] px-4 text-xs font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Rate"}
              </button>
            </div>
          </form>
        )}

        {/* Rates Table */}
        <div className="mt-4 overflow-x-auto">
          {rates.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#9CA3AF]">
              No tax rates configured yet. Click "Add Rate" to create one.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#F3F4F6] text-xs font-semibold text-[#6B7280]">
                  <th className="pb-2 pr-4">Country</th>
                  <th className="pb-2 pr-4">Category</th>
                  <th className="pb-2 pr-4">Rate</th>
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Effective</th>
                  <th className="pb-2 pr-4 text-center">Active</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody>
                {rates.map((r) => (
                  <tr key={r.id} className="border-b border-[#F9FAFB] last:border-0">
                    <td className="py-2.5 pr-4 font-semibold text-[#0A4833]">
                      {GCC_COUNTRIES[r.country] ?? r.country}
                      <span className="ml-1 text-[10px] font-normal text-[#9CA3AF]">({r.country})</span>
                    </td>
                    <td className="py-2.5 pr-4 text-[#374151]">{r.tax_category_name}</td>
                    <td className="py-2.5 pr-4 font-semibold text-[#0A4833]">
                      {r.rate_percent.toFixed(r.rate_percent % 1 === 0 ? 0 : 2)}%
                    </td>
                    <td className="py-2.5 pr-4 text-[#6B7280]">{r.name}</td>
                    <td className="py-2.5 pr-4 text-[#6B7280]">{r.effective_from}</td>
                    <td className="py-2.5 pr-4 text-center">
                      <button
                        onClick={() => toggleActive(r)}
                        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition ${
                          r.is_active ? "bg-[#0A4833]" : "bg-[#D1D5DB]"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
                            r.is_active ? "left-4" : "left-0.5"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-2.5">
                      <button
                        onClick={() => deleteRate(r.id)}
                        className="text-[#EF4444] hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </article>

      {/* Currencies */}
      <article className="rounded-lg border border-[#DFDFDF] bg-white p-4">
        <h3 className="inline-flex items-center gap-2 text-lg font-bold text-[#0A4833]">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#0A4833]/10">
            <Coins size={13} />
          </span>
          Currencies
        </h3>
        <p className="mt-1 text-xs text-[#4B5563]">
          Configured currencies used across the platform. Manage via Django admin.
        </p>
        <div className="mt-4 overflow-x-auto">
          {currencies.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#9CA3AF]">No currencies found.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#F3F4F6] text-xs font-semibold text-[#6B7280]">
                  <th className="pb-2 pr-4">Code</th>
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Symbol</th>
                  <th className="pb-2 pr-4">Decimals</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {currencies.map((c) => (
                  <tr key={c.code} className="border-b border-[#F9FAFB] last:border-0">
                    <td className="py-2.5 pr-4 font-bold text-[#0A4833]">{c.code}</td>
                    <td className="py-2.5 pr-4 text-[#374151]">{c.name}</td>
                    <td className="py-2.5 pr-4 text-[#6B7280]">{c.symbol}</td>
                    <td className="py-2.5 pr-4 text-[#6B7280]">{c.decimal_places}</td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          c.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {c.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </article>
    </div>
  );
}
