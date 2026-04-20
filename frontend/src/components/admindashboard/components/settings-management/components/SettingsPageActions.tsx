import { RotateCcw, Save } from "lucide-react";

type SettingsPageActionsProps = {
  lastSaved: string;
  onReset: () => void;
  onCancel: () => void;
  onSave: () => void;
};

export default function SettingsPageActions({ lastSaved, onReset, onCancel, onSave }: SettingsPageActionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onReset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border-2 border-[#DFDFDF] bg-transparent px-5 text-sm font-semibold text-[#0A4833]"
        >
          <RotateCcw size={13} />
          Reset to Default
        </button>

        <div className="flex items-center gap-3 self-end">
          <button onClick={onCancel} className="h-10 rounded-md px-4 text-sm font-semibold text-[#0A483399]">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0A4833] px-6 text-sm font-semibold text-white shadow-[0px_4px_6px_rgba(10,72,51,0.2),0px_10px_15px_rgba(10,72,51,0.2)]"
          >
            <Save size={13} />
            Save Changes
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-[#0A483380] sm:text-sm">Last saved: {lastSaved}</p>
    </div>
  );
}
