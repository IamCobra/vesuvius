"use client";

import { useState, useEffect } from "react";
import { RESTAURANT_INFO } from "@/app/constants/restaurant";
interface KitchenOrderItem {
  id: string;
  quantity: number;
  notes?: string;
  menuItem?: {
    name: string;
    category: string;
  };
}

interface KitchenOrder {
  id: string;
  status: string;
  createdAt: string;
  items?: KitchenOrderItem[];
}

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch("/api/menu/items");
      const data = await res.json();
      if (data.success) setMenuItems(data.items);
    } catch (err) {
      console.error("Fejl ved hentning af menu:", err);
    }
  };
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/kitchen/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (err) {
      console.error("Fejl ved opdatering af ordre:", err);
    }
  };

  // Add this function to handle menu item availability toggle
  const updateItemAvailability = async (itemId: string, available: boolean) => {
    try {
      await fetch(`/api/menu/items/${itemId}/availability`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available }),
      });
      fetchMenuItems();
    } catch (err) {
      console.error("Fejl ved opdatering af menuitem:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    setCurrentTime(new Date().toLocaleTimeString("da-DK"));
    const orderInterval = setInterval(() => {
      fetchOrders();
    }, 5000);
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("da-DK"));
    }, 1000);
    return () => {
      clearInterval(orderInterval);
      clearInterval(clockInterval);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/kitchen/orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error("Fejl ved hentning af ordrer:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const timeSinceOrder = (createdAt: string) => {
    const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    if (diff < 1) return "Lige nu";
    if (diff === 1) return "1 minut siden";
    return `${diff} minutter siden`;
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-burgundy-light">
      <div className="flex flex-col items-center">
        <span className="text-lg text-gray-900 font-medium">Indlæser køkken...</span>
      </div>
    </div>
  );

  // Group orders by status
  const statusColumns = [
    { key: "PENDING", label: "Ventende" },
    { key: "PREPARING", label: "I gang" },
    { key: "READY", label: "Klar" },
  ];
  const activeOrders = orders.filter(o => o.status !== "SERVED");

  return (
    <div className="min-h-screen bg-burgundy-light font-sans">
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar for menu items and ingredients */}
        <aside className="col-span-1 flex flex-col gap-6 mb-8 lg:mb-0">
          {/* Available Items */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <h2 className="text-lg font-bold text-green-700 mb-4 text-center">Tilgængelige retter</h2>
            <div className="space-y-4 max-h-[35vh] overflow-y-auto">
              {menuItems.filter(i => i.available).length === 0 ? (
                <div className="text-gray-400 text-center">Ingen tilgængelige retter</div>
              ) : menuItems.filter(i => i.available).map(item => (
                <div key={item.id} className="border-b pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <span className="text-xs font-bold px-2 py-1 rounded-2xl bg-green-100 text-green-800">Tilgængelig</span>
                  </div>
                  <div className="text-xs text-gray-700 mb-1">{item.category}</div>
                  {item.ingredients && Array.isArray(item.ingredients) && item.ingredients.length > 0 && (
                    <div className="text-xs text-gray-700">Ingredienser: <span className="font-medium">{item.ingredients.join(", ")}</span></div>
                  )}
                  <button
                    onClick={() => updateItemAvailability(item.id, false)}
                    className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-2xl text-sm font-semibold shadow transition border-2 bg-red-50 border-red-400 text-red-700 hover:bg-red-100 hover:border-red-500"
                    title="Marker som udsolgt"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    Udsolgt
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Sold Out Items */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <h2 className="text-lg font-bold text-red-700 mb-4 text-center">Udsolgte retter</h2>
            <div className="space-y-4 max-h-[35vh] overflow-y-auto">
              {menuItems.filter(i => !i.available).length === 0 ? (
                <div className="text-gray-400 text-center">Ingen udsolgte retter</div>
              ) : menuItems.filter(i => !i.available).map(item => (
                <div key={item.id} className="border-b pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <span className="text-xs font-bold px-2 py-1 rounded-2xl bg-red-100 text-red-800">Udsolgt</span>
                  </div>
                  <div className="text-xs text-gray-700 mb-1">{item.category}</div>
                  {item.ingredients && Array.isArray(item.ingredients) && item.ingredients.length > 0 && (
                    <div className="text-xs text-gray-700">Ingredienser: <span className="font-medium">{item.ingredients.join(", ")}</span></div>
                  )}
                  <button
                    onClick={() => updateItemAvailability(item.id, true)}
                    className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-2xl text-sm font-semibold shadow transition border-2 bg-green-50 border-green-400 text-green-700 hover:bg-green-100 hover:border-green-500"
                    title="Marker som tilgængelig"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Tilgængelig
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
        {/* Main kitchen order columns */}
        <section className="col-span-1 lg:col-span-3 space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-burgundy-primary drop-shadow text-center mb-2">{RESTAURANT_INFO.name} Køkken</h1>
          <div className="flex justify-center mb-8">
            <span className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-xl font-mono tracking-wider shadow-lg">{currentTime}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statusColumns.map(col => (
              <div key={col.key} className="space-y-6">
                <h2 className="text-xl font-bold text-center text-gray-900 mb-4 tracking-wide uppercase drop-shadow-sm">{col.label}</h2>
                {activeOrders.filter(o => o.status === col.key).length === 0 ? (
                  <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-400 text-lg font-medium">Ingen ordrer</div>
                ) : activeOrders.filter(o => o.status === col.key).map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-2xl text-burgundy-primary">#{order.id.slice(0, 6)}</h3>
                      <span className="text-sm font-semibold capitalize text-gray-700 bg-gray-100 px-3 py-1 rounded-full shadow-inner">{order.status?.toLowerCase?.() || "ukendt"}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">{timeSinceOrder(order.createdAt)}</div>
                    <div className="space-y-3">
                      {Array.isArray(order.items) && order.items.length > 0 ? order.items.map(item => {
                        const menuItem = menuItems.find(m => m.name === item.menuItem?.name && m.category === item.menuItem?.category);
                        return (
                          <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-lg text-gray-900">{item.quantity}x {item.menuItem?.name || ""}</span>
                              <span className="text-sm text-gray-700 font-medium">{item.menuItem?.category || ""}</span>
                            </div>
                            {item.notes && <span className="text-xs text-gray-600 italic">{item.notes}</span>}
                            {menuItem?.ingredients && Array.isArray(menuItem.ingredients) && menuItem.ingredients.length > 0 && (
                              <div className="text-xs text-gray-700 mt-1">Ingredienser: <span className="font-medium">{menuItem.ingredients.join(", ")}</span></div>
                            )}
                          </div>
                        );
                      }) : <p className="text-gray-400">Ingen varer</p>}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 justify-end">
                      {order.status === "PENDING" && (
                        <button onClick={() => updateOrderStatus(order.id, "PREPARING")}
                          className="px-4 py-2 bg-orange-500 text-white rounded-2xl font-semibold shadow hover:bg-orange-600 transition">Start tilberedning</button>
                      )}
                      {order.status === "PREPARING" && (
                        <button onClick={() => updateOrderStatus(order.id, "READY")}
                          className="px-4 py-2 bg-green-600 text-white rounded-2xl font-semibold shadow hover:bg-green-700 transition">Marker som klar</button>
                      )}
                      {order.status === "READY" && (
                        <button onClick={() => updateOrderStatus(order.id, "SERVED")}
                          className="px-4 py-2 bg-gray-700 text-white rounded-2xl font-semibold shadow hover:bg-gray-800 transition">Marker som serveret</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
