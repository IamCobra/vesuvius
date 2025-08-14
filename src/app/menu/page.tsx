"use client";

import Link from "next/link";
import { useState } from "react";

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
      {/* Header */}
      <section className="bg-[#A63A50] text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl">
            Discover our delicious selection of carefully crafted dishes
          </p>
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  selectedCategory === category
                    ? "bg-[#A63A50] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-[#F0E7D8]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="text-4xl mb-4 text-center">{item.image}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-[#A63A50]">
                      ${item.price}
                    </span>
                    <Link
                      href="/order"
                      className="bg-[#A63A50] text-white px-4 py-2 rounded-lg hover:bg-[#8B2E44] transition-colors"
                    >
                      Add to Order
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#A63A50] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Contact Us Section */}
            <div>
              <h3 className="text-2xl font-bold mb-8 italic">Contact Us</h3>
              <div className="space-y-4 text-[#F0E7D8]">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 mt-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p>123 kagemand gade</p>
                    <p>By: Odense, 5000</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <p>60903434</p>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <p>hello@vesuvius.com</p>
                </div>
              </div>
            </div>

            {/* Opening Hours Section */}
            <div>
              <h3 className="text-2xl font-bold mb-8 italic">
                Our Kitchen&apos;s
                <br />
                Opening Times
              </h3>
              <div className="space-y-3 text-[#F0E7D8]">
                <div className="flex justify-between">
                  <span>Monday</span>
                  <span>CLOSED</span>
                </div>
                <div className="flex justify-between">
                  <span>Tuesday</span>
                  <span>12-1:30pm, 6-9pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Wednesday</span>
                  <span>12-1:30pm, 6-9pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Thursday</span>
                  <span>12-1:30pm, 6-9pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span>12-1:30pm, 6-9pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>12-1:30pm, 6-9pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>12:15-1:30pm, 6:15-8:15pm</span>
                </div>
              </div>
            </div>

            {/* Quick Links Section */}
            <div>
              <h3 className="text-2xl font-bold mb-8 italic">Quick Links</h3>
              <div className="space-y-4 mb-8">
                <Link
                  href="/"
                  className="block text-[#F0E7D8] hover:text-white transition-colors underline"
                >
                  About Us
                </Link>
                <Link
                  href="/order"
                  className="block text-[#F0E7D8] hover:text-white transition-colors underline"
                >
                  Make a Booking
                </Link>
                <Link
                  href="/menu"
                  className="block text-[#F0E7D8] hover:text-white transition-colors underline"
                >
                  Menu
                </Link>
                <Link
                  href="/order"
                  className="block text-[#F0E7D8] hover:text-white transition-colors underline"
                >
                  Contact Us
                </Link>
              </div>

              {/* Social Media Icons */}
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
