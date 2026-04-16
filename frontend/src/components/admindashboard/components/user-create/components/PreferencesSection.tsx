import CreateUserSection from "./CreateUserSection";

type Props = {
  values: {
    wellnessInterests: string;
    dietPreference: string;
    preferredCommunication: string;
    notificationPreferences: string;
  };
  onChange: (field: string, value: string) => void;
};

const inputClass = "h-12 w-full rounded-lg border border-[#DFDFDF] bg-[#F7F7F7] px-3 text-sm outline-none ring-[#0A4833]/20 focus:ring-2";

export default function PreferencesSection({ values, onChange }: Props) {
  return (
    <CreateUserSection title="Preferences & Initial Setup">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="text-sm text-[#0A4833]">Wellness Interests
          <select className={inputClass} value={values.wellnessInterests} onChange={(e) => onChange("wellnessInterests", e.target.value)}>
            <option>Select interests</option>
            <option>Weight Management</option>
            <option>Fitness</option>
            <option>Mindfulness</option>
          </select>
        </label>
        <label className="text-sm text-[#0A4833]">Diet Preference
          <select className={inputClass} value={values.dietPreference} onChange={(e) => onChange("dietPreference", e.target.value)}>
            <option>Select diet type</option>
            <option>Vegetarian</option>
            <option>Vegan</option>
            <option>Keto</option>
          </select>
        </label>
        <label className="text-sm text-[#0A4833]">Preferred Communication
          <select className={inputClass} value={values.preferredCommunication} onChange={(e) => onChange("preferredCommunication", e.target.value)}>
            <option>Email</option>
            <option>SMS</option>
            <option>Phone</option>
          </select>
        </label>
        <label className="text-sm text-[#0A4833]">Notification Preferences
          <select className={inputClass} value={values.notificationPreferences} onChange={(e) => onChange("notificationPreferences", e.target.value)}>
            <option>All Notifications</option>
            <option>Important Only</option>
            <option>None</option>
          </select>
        </label>
      </div>
    </CreateUserSection>
  );
}
