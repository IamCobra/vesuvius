"use client";

import { useState, useEffect } from "react";
import { RESTAURANT_INFO } from "@/app/constants/restaurant";

interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "SERVED";
  total: number;
  createdAt: string;
  customer: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface TableStatus {
  tableNumber: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING";
  currentOrder?: string;
  guests?: number;
}

export default function WaiterDashboard() {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActiveOrders();
    fetchTableStatuses();
    // Setup real-time updates every 10 seconds
    const interval = setInterval(() => {
      fetchActiveOrders();
      fetchTableStatuses();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchActiveOrders = async () => {
    try {
      const response = await fetch("/api/orders?status=active");
      const data = await response.json();
      if (data.success) {
        setActiveOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTableStatuses = async () => {
    try {
      const response = await fetch("/api/tables/status");
      const data = await response.json();
      if (data.success) {
        setTableStatuses(data.tables);
      }
    } catch (error) {
      console.error("Error fetching table statuses:", error);
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchActiveOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const updateTableStatus = async (
    tableNumber: number,
    newStatus: TableStatus["status"]
  ) => {
    try {
      const response = await fetch(`/api/tables/${tableNumber}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTableStatuses();
      }
    } catch (error) {
      console.error("Error updating table status:", error);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PREPARING":
        return "bg-orange-100 text-orange-800";
      case "READY":
        return "bg-green-100 text-green-800";
      case "SERVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTableStatusColor = (status: TableStatus["status"]) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500";
      case "OCCUPIED":
        return "bg-red-500";
      case "RESERVED":
        return "bg-yellow-500";
      case "CLEANING":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading tjener dashboard...</div>
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
                {RESTAURANT_INFO.name} - Tjener Dashboard
              </h1>
              <p className="text-gray-600">Ordre håndtering og bordstatus</p>
            </div>
            <div className="bg-burgundy-primary text-white px-4 py-2 rounded-lg">
              {new Date().toLocaleTimeString("da-DK")}
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
                  Aktive Ordre ({activeOrders.length})
                </h2>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {activeOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Ingen aktive ordre
                  </p>
                ) : (
                  activeOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">
                            Bord {order.tableNumber}
                          </h3>
                          <p className="text-gray-600">{order.customer}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleTimeString(
                              "da-DK"
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                          <p className="text-lg font-semibold mt-2">
                            {order.total.toFixed(2)} kr
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span>
                              {(item.quantity * item.price).toFixed(2)} kr
                            </span>
                            {item.notes && (
                              <p className="text-xs text-gray-500 italic">
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
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Bekræft
                          </button>
                        )}
                        {order.status === "READY" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "SERVED")
                            }
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Serveret
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Table Status Grid */}
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Bordstatus ({RESTAURANT_INFO.tablesCount} borde)
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {Array.from(
                    { length: RESTAURANT_INFO.tablesCount },
                    (_, i) => {
                      const tableNumber = i + 1;
                      const tableStatus = tableStatuses.find(
                        (t) => t.tableNumber === tableNumber
                      );
                      const status = tableStatus?.status || "AVAILABLE";

                      return (
                        <button
                          key={tableNumber}
                          onClick={() => setSelectedTable(tableNumber)}
                          className={`
                          w-12 h-12 rounded-lg text-white font-semibold text-sm
                          ${getTableStatusColor(status)}
                          ${
                            selectedTable === tableNumber
                              ? "ring-2 ring-offset-2 ring-burgundy-primary"
                              : ""
                          }
                          hover:opacity-80 transition-all
                        `}
                        >
                          {tableNumber}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Legend */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Ledig</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Optaget</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Reserveret</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Rengøring</span>
                  </div>
                </div>

                {/* Selected Table Actions */}
                {selectedTable && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="font-semibold mb-3">Bord {selectedTable}</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          updateTableStatus(selectedTable, "OCCUPIED")
                        }
                        className="w-full px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Marker som optaget
                      </button>
                      <button
                        onClick={() =>
                          updateTableStatus(selectedTable, "CLEANING")
                        }
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Send til rengøring
                      </button>
                      <button
                        onClick={() =>
                          updateTableStatus(selectedTable, "AVAILABLE")
                        }
                        className="w-full px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Marker som ledig
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
