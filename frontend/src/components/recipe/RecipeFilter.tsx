"use client"

import React from "react"

const categories = ["Breakfast", "Lunch", "Dessert", "Dinner"]

function RecipeFilter() {
  return (
    <div className="grid pt-32 md:pt-50 grid-cols-2 px-6 md:px-12 lg:px-24 max-sm:px-6 md:grid-cols-4 gap-4 md:gap-8 mb-12">
      {categories.map((category) => (
        <button
          key={category}
          className="h-13 md:h-15 bg-[#274836] rounded-full w-full text-white font-playfair font-semibold text-lg hover:bg-white hover:text-[#274836] border-2 border-transparent hover:border-[#274836] transition-all shadow-lg"
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default RecipeFilter