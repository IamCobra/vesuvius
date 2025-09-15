"use client";

import { useState, useEffect } from "react";
import { RESTAURANT_INFO } from "@/app/constants/restaurant";

interface KitchenOrder {
  id: string;
  tableNumber: number;
  items: KitchenOrderItem[];
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "SERVED";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  orderedAt: string;
  estimatedTime?: number;
}

interface KitchenOrderItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  notes?: string;
  prepTime: number;
  status: "PENDING" | "PREPARING" | "READY";
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  available: boolean;
  prepTime: number;
  ingredients?: string[];
}

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["ALL", "FORRETTER", "HOVEDRETTER", "DESSERTER", "DRIKKEVARER"];

  useEffect(() => {
    fetchOrders();
    fetchMenu();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
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

  const fetchMenu = async () => {
    try {
      const res = await fetch("/api/menu/items");
      const data = await res.json();
      if (data.success) setMenuItems(data.items);
    } catch (err) {
      console.error("Fejl ved hentning af menu:", err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: KitchenOrder["status"]) => {
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

  const updateItemAvailability = async (itemId: string, available: boolean) => {
    try {
      await fetch(`/api/menu/items/${itemId}/availability`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available }),
      });
      fetchMenu();
    } catch (err) {
      console.error("Fejl ved opdatering af menuitem:", err);
    }
  };

  const getPriorityColor = (priority: KitchenOrder["priority"]) => {
    switch (priority) {
      case "URGENT": return "bg-red-100 border-red-500 text-red-800";
      case "HIGH": return "bg-orange-100 border-orange-500 text-orange-800";
      case "NORMAL": return "bg-blue-100 border-blue-500 text-blue-800";
      case "LOW": return "bg-gray-100 border-gray-500 text-gray-800";
      default: return "bg-gray-100 border-gray-500 text-gray-800";
    }
  };

  const getStatusColor = (status: KitchenOrder["status"]) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500";
      case "CONFIRMED": return "bg-blue-500";
      case "PREPARING": return "bg-orange-500";
      case "READY": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const timeSinceOrder = (orderedAt: string) => {
    const diff = Math.floor((Date.now() - new Date(orderedAt).getTime()) / 60000);
    if (diff < 1) return "Lige nu";
    if (diff === 1) return "1 minut siden";
    return `${diff} minutter siden`;
  };

  const filteredMenuItems = selectedCategory === "ALL" ? menuItems : menuItems.filter(i => i.category === selectedCategory);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-900">Indlæser køkken...</div>;

  return (
    <div className="min-h-screen bg-burgundy-light">
      {/* Header */}
      <header className="bg-burgundy-primary text-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{RESTAURANT_INFO.name} - Køkken</h1>
            <p className="text-gray-200">Ordre håndtering & menu administration</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-burgundy-dark px-4 py-2 rounded-2xl">
              {orders.filter(o => o.status === "PREPARING").length} i gang
            </div>
            <div className="bg-yellow-500 px-4 py-2 rounded-2xl">
              {orders.filter(o => o.status === "PENDING").length} ventende
            </div>
            <div className="bg-gray-700 px-4 py-2 rounded-2xl">
              {new Date().toLocaleTimeString("da-DK")}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders Section */}
        <section className="lg:col-span-2 space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-500">Ingen aktive ordre</div>
          ) : orders.sort((a,b) => {
            const p = { URGENT:4,HIGH:3,NORMAL:2,LOW:1 };
            return (p[b.priority]-p[a.priority]) || (new Date(a.orderedAt).getTime() - new Date(b.orderedAt).getTime());
          }).map(order => (
            <div key={order.id} className={`bg-white p-4 rounded-2xl shadow border-2 ${getPriorityColor(order.priority)}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-xl">Bord {order.tableNumber}</h3>
                  <p className="text-sm">{timeSinceOrder(order.orderedAt)}</p>
                  {order.estimatedTime && <p className="text-sm font-medium">Est. tid: {order.estimatedTime} min</p>}
                </div>
                <div className="flex flex-col items-end">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(order.status)}`}></div>
                  <span className="text-xs mt-1 font-medium">{order.status}</span>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                {order.items.map(item => (
                  <div key={item.id} className="bg-burgundy-light rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold">{item.quantity}x {item.name}</span>
                        <span className="text-sm text-gray-700 ml-2">({item.prepTime} min)</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${item.status === "READY" ? "bg-green-200 text-green-800" : item.status === "PREPARING" ? "bg-yellow-200 text-yellow-800" : "bg-gray-200 text-gray-800"}`}>{item.status}</span>
                    </div>
                    {item.notes && <p className="text-sm text-gray-700 mt-1 italic">Note: {item.notes}</p>}
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                {order.status === "PENDING" && <button onClick={()=>updateOrderStatus(order.id,"CONFIRMED")} className="px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition">Bekræft</button>}
                {order.status === "CONFIRMED" && <button onClick={()=>updateOrderStatus(order.id,"PREPARING")} className="px-4 py-2 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 transition">Start tilberedning</button>}
                {order.status === "PREPARING" && <button onClick={()=>updateOrderStatus(order.id,"READY")} className="px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition">Klar til servering</button>}
              </div>
            </div>
          ))}
        </section>

        {/* Menu Management */}
        <section className="space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Menu Administration</h2>
            <select value={selectedCategory} onChange={e=>setSelectedCategory(e.target.value)} className="w-full border border-gray-300 rounded-2xl px-3 py-2">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredMenuItems.map(item => (
                <div key={item.id} className="bg-burgundy-light p-3 rounded-2xl border border-burgundy-primary">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-700">{item.category}</p>
                      <p className="text-xs text-gray-600">Tilberedningstid: {item.prepTime} min</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${item.available?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}`}>{item.available?"Tilgængeligt":"Ikke tilgængeligt"}</span>
                  </div>
                  <button onClick={()=>updateItemAvailability(item.id,!item.available)} className={`w-full px-3 py-2 rounded-2xl text-sm font-medium ${item.available?"bg-red-600 text-white hover:bg-red-700":"bg-green-600 text-white hover:bg-green-700"} transition`}>{item.available?"Marker som udsolgt":"Marker som tilgængelig"}</button>
                </div>
              ))}
              {filteredMenuItems.length===0 && <p className="text-gray-500 text-center py-4">Ingen menupunkter</p>}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
