"use client";

type Props = {
  open: boolean;
  currentStatus: string;
  onClose: () => void;
  onSave: (status: string) => void;
};

const options = ["Packed", "Shipped", "Out for Delivery", "Delivered"];

export default function OrderStatusModal({ open, currentStatus, onClose, onSave }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-xl border border-[#DFDFDF] bg-white p-5 shadow-lg">
        <h3 className="text-xl font-semibold text-[#0A4833]">Update Order Status</h3>
        <p className="mt-1 text-sm text-[#6B7280]">Choose current delivery stage.</p>

        <div className="mt-4 space-y-2">
          {options.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onSave(status)}
              className={`w-full rounded-md border px-3 py-2 text-left text-sm ${
                currentStatus === status ? "border-[#0A4833] bg-[#ECF8F2] text-[#0A4833]" : "border-[#DFDFDF] bg-white text-[#374151]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-md border border-[#DFDFDF] bg-white px-4 py-2 text-sm text-[#374151] hover:bg-[#F7F7F7]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
