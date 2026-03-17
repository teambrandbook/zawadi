import Image from "next/image";

export default function TryRecipes() {
    const recipes = [
        { id: 1, image: "/product/product-2.webp" },
        { id: 2, image: "/product/product-4.webp" },
        { id: 3, image: "/product/product-5.webp" },
    ];

    return (
        <section className="w-full bg-white py-16 px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto">
                <h2 className="font-display text-4xl md:text-5xl font-black text-black text-center mb-12">
                    Try Recipes
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recipes.map((recipe) => (
                        <div key={recipe.id} className="bg-[#0A4834] p-4 flex flex-col gap-4">
                            <div className="relative aspect-[4/5] w-full overflow-hidden">
                                <Image 
                                    src={recipe.image} 
                                    alt="Recipe" 
                                    fill 
                                    className="object-cover" 
                                />
                            </div>
                            <p className="font-display text-white text-lg font-bold leading-tight px-2 pb-2">
                                Discover the rich flavors<br />that inspire our kitchen
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
