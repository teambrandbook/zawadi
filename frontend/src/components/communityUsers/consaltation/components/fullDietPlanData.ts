export type FullDietMeal = {
  id: string;
  label: string;
  time: string;
  item: string;
  quantity: string;
  calories: string;
  note: string;
  dotClassName: string;
};

export type FullDietPlanDetails = {
  client: {
    name: string;
    age: string;
    goal: string;
    dietPreference: string;
    allergies: string;
    avatar: string;
  };
  plan: {
    title: string;
    goal: string;
    duration: string;
    startDate: string;
    dailyCalories: string;
    difficulty: string;
    status: string;
    consultant: string;
  };
  buckwheatIntegration: {
    products: string[];
    serving: string;
    benefitsNote: string;
  };
  lifestyle: {
    foodsToAvoid: string[];
    exerciseRecommendations: string[];
    sleepHydration: string[];
    personalizedAdvice: string;
  };
  meals: FullDietMeal[];
};

export const fullDietPlanDetails: FullDietPlanDetails = {
  client: {
    name: "Emily Chen",
    age: "32",
    goal: "Weight Loss",
    dietPreference: "Vegetarian",
    allergies: "Nuts, Dairy",
    avatar: "/recipe/recipe-3.webp",
  },
  plan: {
    title: "30-Day Weight Loss Plan",
    goal: "Weight Loss",
    duration: "30 Days",
    startDate: "April 24, 2026",
    dailyCalories: "1500 kcal",
    difficulty: "Beginner",
    status: "Active",
    consultant: "Dr. Sarah Johnson",
  },
  buckwheatIntegration: {
    products: ["Buckwheat groats", "Buckwheat flour", "Buckwheat noodles", "Buckwheat granola"],
    serving: "1 cup cooked buckwheat or 2 buckwheat-based servings daily",
    benefitsNote:
      "Buckwheat supports steady energy, improves satiety, and adds fiber-rich variety that fits this client's weight-loss goal without making meals feel restrictive.",
  },
  lifestyle: {
    foodsToAvoid: ["Sugary drinks", "Deep-fried snacks", "Late-night desserts", "High-sodium packaged meals"],
    exerciseRecommendations: ["30-minute brisk walk", "2 light strength sessions weekly", "10-minute post-meal stretching"],
    sleepHydration: ["7-8 hours of sleep nightly", "8-10 glasses of water daily", "Keep caffeine before 4 PM"],
    personalizedAdvice:
      "Batch-prep breakfast and lunch, keep dinner lighter, and pair buckwheat meals with greens or lean protein to stay full and consistent through the week.",
  },
  meals: [
    {
      id: "meal-breakfast",
      label: "Breakfast",
      time: "7:00 AM",
      item: "Buckwheat porridge with berries",
      quantity: "1 bowl",
      calories: "320 cal",
      note: "Add chia seeds for extra fiber and omega-3s.",
      dotClassName: "bg-[#F97316]",
    },
    {
      id: "meal-midmorning",
      label: "Mid-Morning Snack",
      time: "10:30 AM",
      item: "Greek yogurt with sliced apple",
      quantity: "1 cup",
      calories: "150 cal",
      note: "Swap with coconut yogurt on dairy-sensitive days.",
      dotClassName: "bg-[#EAB308]",
    },
    {
      id: "meal-lunch",
      label: "Lunch",
      time: "1:00 PM",
      item: "Buckwheat Buddha bowl",
      quantity: "1 plate",
      calories: "450 cal",
      note: "Include roasted vegetables and tahini dressing.",
      dotClassName: "bg-[#22C55E]",
    },
    {
      id: "meal-evening",
      label: "Evening Snack",
      time: "4:00 PM",
      item: "Herbal tea with roasted chickpeas",
      quantity: "1 serving",
      calories: "180 cal",
      note: "Keeps evening cravings controlled before dinner.",
      dotClassName: "bg-[#EF4444]",
    },
    {
      id: "meal-dinner",
      label: "Dinner",
      time: "7:30 PM",
      item: "Stuffed peppers with buckwheat and mushrooms",
      quantity: "2 halves",
      calories: "400 cal",
      note: "Keep dinner vegetable-forward and easy to digest.",
      dotClassName: "bg-[#8B5CF6]",
    },
  ],
};
