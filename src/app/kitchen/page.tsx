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
  estimatedTime?: number; // minutes
}

interface KitchenOrderItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  notes?: string;
  prepTime: number; // minutes
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

  const categories = [
    "ALL",
    "FORRETTER",
    "HOVEDRETTER",
    "DESSERTER",
    "DRIKKEVARER",
  ];

  useEffect(() => {
    fetchKitchenOrders();
    fetchMenuItems();

    // Setup real-time updates every 5 seconds
    const interval = setInterval(() => {
      fetchKitchenOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchKitchenOrders = async () => {
    try {
      const response = await fetch("/api/kitchen/orders");
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching kitchen orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("/api/menu/items");
      const data = await response.json();
      if (data.success) {
        setMenuItems(data.items);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    newStatus: KitchenOrder["status"]
  ) => {
    try {
      const response = await fetch(`/api/kitchen/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchKitchenOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const updateItemAvailability = async (itemId: string, available: boolean) => {
    try {
      const response = await fetch(`/api/menu/items/${itemId}/availability`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ available }),
      });

      if (response.ok) {
        fetchMenuItems();
      }
    } catch (error) {
      console.error("Error updating item availability:", error);
    }
  };

  const getPriorityColor = (priority: KitchenOrder["priority"]) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 border-red-500 text-red-800";
      case "HIGH":
        return "bg-orange-100 border-orange-500 text-orange-800";
      case "NORMAL":
        return "bg-blue-100 border-blue-500 text-blue-800";
      case "LOW":
        return "bg-gray-100 border-gray-500 text-gray-800";
      default:
        return "bg-gray-100 border-gray-500 text-gray-800";
    }
  };

  const getStatusColor = (status: KitchenOrder["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "CONFIRMED":
        return "bg-blue-500";
      case "PREPARING":
        return "bg-orange-500";
      case "READY":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTimeSinceOrder = (orderedAt: string) => {
    const orderTime = new Date(orderedAt);
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - orderTime.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 1) return "Lige nu";
    if (diffMinutes === 1) return "1 minut siden";
    return `${diffMinutes} minutter siden`;
  };

  const filteredMenuItems =
    selectedCategory === "ALL"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading køkken dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {RESTAURANT_INFO.name} - Køkken
              </h1>
              <p className="text-gray-600">
                Ordre håndtering og menu administration
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-burgundy-primary text-white px-4 py-2 rounded-lg">
                {orders.filter((o) => o.status === "PREPARING").length} i gang
              </div>
              <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
                {orders.filter((o) => o.status === "PENDING").length} ventende
              </div>
              <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                {new Date().toLocaleTimeString("da-DK")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Aktive Ordre ({orders.length})
                </h2>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Ingen aktive ordre
                  </p>
                ) : (
                  orders
                    .sort((a, b) => {
                      // Sort by priority first, then by time
                      const priorityOrder = {
                        URGENT: 4,
                        HIGH: 3,
                        NORMAL: 2,
                        LOW: 1,
                      };
                      if (
                        priorityOrder[a.priority] !== priorityOrder[b.priority]
                      ) {
                        return (
                          priorityOrder[b.priority] - priorityOrder[a.priority]
                        );
                      }
                      return (
                        new Date(a.orderedAt).getTime() -
                        new Date(b.orderedAt).getTime()
                      );
                    })
                    .map((order) => (
                      <div
                        key={order.id}
                        className={`border-2 rounded-lg p-4 ${getPriorityColor(
                          order.priority
                        )}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-xl">
                              Bord {order.tableNumber}
                            </h3>
                            <p className="text-sm">
                              {getTimeSinceOrder(order.orderedAt)}
                            </p>
                            {order.estimatedTime && (
                              <p className="text-sm font-medium">
                                Est. tid: {order.estimatedTime} min
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            <div
                              className={`w-4 h-4 rounded-full ${getStatusColor(
                                order.status
                              )}`}
                            ></div>
                            <span className="text-xs mt-1 font-medium">
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="bg-white bg-opacity-50 rounded p-3"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-semibold">
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span className="text-sm text-gray-600 ml-2">
                                    ({item.prepTime} min)
                                  </span>
                                </div>
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    item.status === "READY"
                                      ? "bg-green-200 text-green-800"
                                      : item.status === "PREPARING"
                                      ? "bg-yellow-200 text-yellow-800"
                                      : "bg-gray-200 text-gray-800"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </div>
                              {item.notes && (
                                <p className="text-sm text-gray-700 mt-1 italic">
                                  Note: {item.notes}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex space-x-2">
                          {order.status === "PENDING" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "CONFIRMED")
                              }
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              Bekræft
                            </button>
                          )}
                          {order.status === "CONFIRMED" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "PREPARING")
                              }
                              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                            >
                              Start tilberedning
                            </button>
                          )}
                          {order.status === "PREPARING" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "READY")
                              }
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              Klar til servering
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>

          {/* Menu Items Management */}
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Menu Administration
                </h2>
              </div>
              <div className="p-6">
                {/* Category Filter */}
                <div className="mb-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Menu Items */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredMenuItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            {item.category}
                          </p>
                          <p className="text-xs text-gray-500">
                            Tilberedningstid: {item.prepTime} min
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              item.available
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.available
                              ? "Tilgængeligt"
                              : "Ikke tilgængeligt"}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          updateItemAvailability(item.id, !item.available)
                        }
                        className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors ${
                          item.available
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {item.available
                          ? "Marker som udsolgt"
                          : "Marker som tilgængelig"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
