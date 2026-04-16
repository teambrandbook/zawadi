import CreateUserSection from "./CreateUserSection";

type Props = {
  values: {
    wellness_interests: string;
    diet_preference: string;
    preferred_communication: string;
    notification_preferences: string;
  };
  onChange: (field: string, value: string) => void;
};

const inputClass =
  "h-12 w-full rounded-lg border border-[#DFDFDF] bg-[#F7F7F7] px-3 text-sm outline-none ring-[#0A4833]/20 focus:ring-2";

export default function PreferencesSection({ values, onChange }: Props) {
  return (
    <CreateUserSection title="Preferences & Initial Setup">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Wellness Interests */}
        <label className="text-sm text-[#0A4833]">
          Wellness Interests
          <select
            className={inputClass}
            value={values.wellness_interests}
            onChange={(e) =>
              onChange("wellness_interests", e.target.value)
            }
          >
            <option value="">Select interests</option>
            <option value="Weight Management">Weight Management</option>
            <option value="Fitness">Fitness</option>
            <option value="Mindfulness">Mindfulness</option>
          </select>
        </label>

        {/* Diet Preference */}
        <label className="text-sm text-[#0A4833]">
          Diet Preference
          <select
            className={inputClass}
            value={values.diet_preference}
            onChange={(e) =>
              onChange("diet_preference", e.target.value)
            }
          >
            <option value="">Select diet type</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Keto">Keto</option>
          </select>
        </label>

        {/* Preferred Communication */}
        <label className="text-sm text-[#0A4833]">
          Preferred Communication
          <select
            className={inputClass}
            value={values.preferred_communication}
            onChange={(e) =>
              onChange("preferred_communication", e.target.value)
            }
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="phone">Phone</option>
          </select>
        </label>

        {/* Notification Preferences */}
        <label className="text-sm text-[#0A4833]">
          Notification Preferences
          <select
            className={inputClass}
            value={values.notification_preferences}
            onChange={(e) =>
              onChange("notification_preferences", e.target.value)
            }
          >
            <option value="all">All Notifications</option>
            <option value="important">Important Only</option>
            <option value="none">None</option>
          </select>
        </label>

      </div>
    </CreateUserSection>
  );
}