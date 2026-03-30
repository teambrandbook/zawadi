"use client"

import React from "react"

const categories = ["Breakfast", "Lunch", "Snack", "Dinner"]

function RecipeFilter() {
  return (
    <div className="grid pt-35 grid-cols-2 px-37 max-sm:px-10 md:grid-cols-4 gap-4 md:gap-8">
      {categories.map((category) => (
        <button
          key={category}
          className="h-13 md:h-15  bg-[#0A4834] rounded-full w-full text-white font-sans font-extrabold text-sm  uppercase tracking-widest hover:bg-[#1A5A44] transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default RecipeFilter