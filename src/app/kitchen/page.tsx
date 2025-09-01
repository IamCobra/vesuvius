"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  table?: string;
  status: "queued" | "in_progress" | "ready" | "complications";
  items: { qty: number; name: string }[];
  placedAt: string;
};

// --- MOCK DATA I FRONTEND ---
const mockOrders: Order[] = [
  {
    id: 101,
    table: "Bord 4",
    status: "queued",
    items: [
      { qty: 2, name: "Pizza Margherita" },
      { qty: 1, name: "Pasta Carbonara" },
    ],
    placedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 102,
    table: "Bord 7",
    status: "in_progress",
    items: [{ qty: 1, name: "Lasagne" }],
    placedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 103,
    table: "Takeaway",
    status: "ready",
    items: [{ qty: 3, name: "Pizza Vesuvio" }],
    placedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
];

// Simuler API-kald
async function mockFetchOrders(): Promise<Order[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve([...mockOrders]), 200)
  );
}

async function mockUpdateStatus(
  orderId: number,
  newStatus: Order["status"]
): Promise<Order> {
  return new Promise((resolve, reject) => {
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) return reject(new Error("Order not found"));
    order.status = newStatus;
    setTimeout(() => resolve(order), 200);
  });
}

// --- KØKKENSKÆRM ---
export default function KitchenScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  // const [error, setError] = useState("");

  async function fetchOrders() {
    try {
      const data = await mockFetchOrders();
      setOrders(
        data.sort(
          (a, b) =>
            new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime()
        )
      );
      // setError("");
    } catch {
      // setError("Kan ikke hente ordrer");
      console.error("Kan ikke hente ordrer");
    }
  }

  async function updateStatus(orderId: number, newStatus: Order["status"]) {
    try {
      await mockUpdateStatus(orderId, newStatus);
      fetchOrders();
    } catch {
      console.error("Kunne ikke opdatere status");
    }
  }

  useEffect(() => {
    fetchOrders();
    const iv = setInterval(fetchOrders, 8000);
    return () => clearInterval(iv);
  }, []);

  const statuses: Order["status"][] = [
    "queued",
    "in_progress",
    "ready",
    "complications",
  ];
  const statusLabels: Record<Order["status"], string> = {
    queued: "Afventer",
    in_progress: "I gang",
    ready: "Færdig",
    complications: "Komplikation",
  };
  const statusColors: Record<Order["status"], string> = {
    queued: "bg-yellow-500",
    in_progress: "bg-blue-500",
    ready: "bg-green-500",
    complications: "bg-red-600",
  };

  function timeSince(dateStr: string) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    return diff === 0 ? "Nu" : `${diff} min`;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Ordreoversigt */}
      <main className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statuses.map((status) => (
          <section
            key={status}
            className="bg-white rounded-lg shadow p-4 flex flex-col"
          >
            <h2
              className={`text-lg font-semibold mb-4 px-2 py-1 rounded text-white ${statusColors[status]}`}
            >
              {statusLabels[status]}
            </h2>
            <div className="space-y-4 flex-1 overflow-y-auto">
              {orders.filter((o) => o.status === status).length === 0 && (
                <p className="text-sm text-gray-400 italic">Ingen ordrer</p>
              )}
              {orders
                .filter((o) => o.status === status)
                .map((order) => (
                  <article
                    key={order.id}
                    className="border rounded-lg bg-gray-50 p-3 flex flex-col"
                  >
                    <div className="flex justify-between mb-2 text-sm font-semibold">
                      <span>#{order.id}</span>
                      <span>{order.table}</span>
                    </div>
                    <ul className="text-sm mb-3 flex-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.qty}× {item.name}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 mb-2">
                      Lagt for {timeSince(order.placedAt)} siden
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {statuses
                        .filter((s) => s !== order.status)
                        .map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(order.id, s)}
                            className={`text-xs px-2 py-1 rounded ${statusColors[s]} text-white hover:opacity-80`}
                          >
                            {statusLabels[s]}
                          </button>
                        ))}
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
