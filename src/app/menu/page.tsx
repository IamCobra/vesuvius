"use client";

import Link from "next/link";
import { useState } from "react";
import Footer from "@/app/components/footer";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and our special sauce",
    price: 12.99,
    category: "Burgers",
    image: "🍔",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce, and basil on thin crust",
    price: 14.99,
    category: "Pizza",
    image: "🍕",
  },
  {
    id: 3,
    name: "Caesar Salad",
    description: "Crispy romaine lettuce with parmesan and croutons",
    price: 9.99,
    category: "Salads",
    image: "🥗",
  },
  {
    id: 4,
    name: "Chicken Wings",
    description: "Spicy buffalo wings served with ranch dipping sauce",
    price: 11.99,
    category: "Appetizers",
    image: "🍗",
  },
  {
    id: 5,
    name: "Pasta Carbonara",
    description: "Creamy pasta with bacon, eggs, and parmesan cheese",
    price: 13.99,
    category: "Pasta",
    image: "🍝",
  },
  {
    id: 6,
    name: "Fish Tacos",
    description: "Grilled fish with cabbage slaw and lime crema",
    price: 10.99,
    category: "Tacos",
    image: "🌮",
  },
];

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categories = [
    "All",
    "Burgers",
    "Pizza",
    "Salads",
    "Appetizers",
    "Pasta",
    "Tacos",
  ];

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedCategory === cat
                    ? "bg-burgundy-primary text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-burgundy-light"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-burgundy-primary">${item.price}</span>
                    <Link
                      href="/order"
                      className="block mt-4 bg-burgundy-primary text-white px-4 py-2 rounded-lg hover:bg-burgundy-dark transition-colors"
                    >
                      Tilføj
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Shared Footer component */}
      <Footer />

    </div>
  );
}
