import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import RecipeDetail from "@/components/recipe/RecipeDetail";
import { notFound } from "next/navigation";

const recipes = {
    "buckwheat-salad": {
        title: "BUCKWHEAT & <br /> VEG SALAD",
        description: "A nutritious blend of wholesome buckwheat and fresh seasonal vegetables, perfect for a light yet satisfying meal that fuels your day with natural energy.",
        image: "/recipe/recipe-2.webp",
        nutrition: [
            { label: "Calories", value: "320g" },
            { label: "Fat", value: "8g" },
            { label: "Carbs", value: "48g" },
            { label: "Protein", value: "10g" },
        ],
        ingredientsCount: 8,
        ingredientsText: "Fresh buckwheat, cherry tomatoes, cucumbers, bell peppers, extra virgin olive oil, lemon juice, sea salt, and fresh herbs.",
        steps: [
            "Rinse the buckwheat thoroughly under cold water.",
            "Cook buckwheat in boiling water for 15-20 minutes until tender.",
            "Chop all vegetables into bite-sized pieces.",
            "Whisk olive oil and lemon juice for the dressing.",
            "Combine all ingredients in a large bowl and toss with dressing."
        ]
    },
    "blueberry-dessert": {
        title: "BLUEBERRY <br /> SUPERFOOD BOWL",
        description: "Celebrate the vibrant flavors of fresh blueberries in this antioxidant-rich superfood bowl, balanced with creamy textures and a hint of sweetness.",
        image: "/recipe/recipe-3.webp",
        nutrition: [
            { label: "Calories", value: "245g" },
            { label: "Fat", value: "4g" },
            { label: "Carbs", value: "38g" },
            { label: "Protein", value: "5g" },
        ],
        ingredientsCount: 6,
        ingredientsText: "Organic blueberries, Greek yogurt, chia seeds, honey, granola, and fresh mint leaves.",
        steps: [
            "Wash the blueberries and pat them dry.",
            "Prepare the yogurt base by mixing in a spoon of honey.",
            "Layer the yogurt and blueberries in a transparent bowl.",
            "Sprinkle chia seeds and granola on top for crunch.",
            "Garnish with fresh mint and serve chilled."
        ]
    },
    "upma-special": {
        title: "BUCKWHEAT CURRY <br /> & GARLIC KALE",
        description: "A hearty and warming dish featuring savory buckwheat curry paired with zesty garlic-infused kale, bringing a perfect balance of nutrition and bold flavors.",
        image: "/recipe/recipe-4.webp",
        nutrition: [
            { label: "Calories", value: "288g" },
            { label: "Fat", value: "5g" },
            { label: "Carbs", value: "54g" },
            { label: "Protein", value: "6g" },
        ],
        ingredientsCount: 11,
        ingredientsText: "Toasted buckwheat, fresh kale, garlic cloves, onion, curry powder, coconut milk, ginger, tumeric, salt, pepper, and lime.",
        steps: [
            "Sauté onions, garlic, and ginger until fragrant.",
            "Add curry powder and spices, then stir in the buckwheat.",
            "Pour in coconut milk and simmer until buckwheat is cooked.",
            "In a separate pan, lightly sauté kale with minced garlic.",
            "Serve the curry topped with the garlic kale and a squeeze of lime."
        ]
    },
    "buckwheat-soup": {
        title: "WARM <br /> BUCKWHEAT SOUP",
        description: "A comforting and nourishing soup made with toasted buckwheat and fresh garden vegetables, perfect for cold days or a wholesome lunch.",
        image: "/product/product-5.webp",
        nutrition: [
            { label: "Calories", value: "210g" },
            { label: "Fat", value: "3g" },
            { label: "Carbs", value: "42g" },
            { label: "Protein", value: "7g" },
        ],
        ingredientsCount: 9,
        ingredientsText: "Toasted buckwheat, carrots, celery, onions, vegetable broth, fresh parsley, olive oil, garlic, and cracked black pepper.",
        steps: [
            "Prepare all vegetables by dicing them into small, even pieces.",
            "In a large pot, sauté onions and garlic in olive oil until translucent.",
            "Add carrots and celery, and cook for another 5 minutes.",
            "Stir in the toasted buckwheat and pour in the vegetable broth.",
            "Simmer for 25-30 minutes until buckwheat is tender.",
            "Garnish with fresh parsley before serving."
        ]
    }
};

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const recipe = recipes[slug as keyof typeof recipes];

    if (!recipe) {
        notFound();
    }

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <RecipeDetail recipe={recipe} />
            <Footer />
        </main>
    );
}
