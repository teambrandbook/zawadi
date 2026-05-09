type AddNutritionistHeaderProps = {
  isEditMode?: boolean;
};

export default function AddNutritionistHeader({ isEditMode = false }: AddNutritionistHeaderProps) {
  return (
    <header className="space-y-2">
      <h1 className="text-3xl font-semibold text-[#0A4833]">{isEditMode ? "Edit Nutritionist" : "Add Nutritionist"}</h1>
      <p className="text-xs text-[#9CA3AF]">Nutritionists / {isEditMode ? "Edit Nutritionist" : "Add Nutritionist"}</p>
      <p className="pt-2 text-sm text-[#4B5563]">
        {isEditMode
          ? "Update expert profile details, specializations, and consultation settings."
          : "Create a new expert profile, define specializations, and manage availability for consultations."}
      </p>
    </header>
  );
}
