"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Recharts is available in the environment; import dynamically to avoid SSR issues
const AreaChart = dynamic(() => import("recharts").then((m) => m.AreaChart), {
  ssr: false,
});
const Area = dynamic(() => import("recharts").then((m) => m.Area), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), {
  ssr: false,
});
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), {
  ssr: false,
});
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);

// Small helper: debounce
function useDebounced<T>(value: T, delay = 300): T {
  const [state, setState] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setState(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return state;
}

// Session timeout hook (30 minutes inactivity)
function useSessionTimeout(onTimeout: () => void, timeoutMs = 30 * 60 * 1000) {
  useEffect(() => {
    let last = Date.now();
    const events = ["mousemove", "keydown", "touchstart", "click"];
    const reset = () => (last = Date.now());
    events.forEach((e) => window.addEventListener(e, reset));
    const iv = setInterval(() => {
      if (Date.now() - last > timeoutMs) {
        onTimeout();
      }
    }, 10000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      clearInterval(iv);
    };
  }, [onTimeout, timeoutMs]);
}

// RoleGuard — fetch session and ensure role === 'admin'
async function fetchSession() {
  try {
    const res = await fetch("/api/auth/session");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

interface Session {
  role: string;
  name: string;
}
interface TrendPoint {
  date: string;
  revenue: number;
}
interface Stats {
  dailyRevenueFormatted?: string;
  monthlyRevenueFormatted?: string;
  tableUtilization?: number;
  topDish?: { name: string; count: number };
  topDishes?: { name: string; count: number }[];
  trend?: TrendPoint[];
}
interface MenuItem {
  id: string;
  name: string;
  category?: string;
  price?: number;
  description?: string;
  tags?: string[];
  is_active?: boolean;
}
interface OrdersSummary {
  queued: number;
  in_progress: number;
  ready: number;
  complications: number;
}

export default function AdminDashboard() {
  // Move ALL hooks to the top level - they must always be called in the same order
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [ordersSummary, setOrdersSummary] = useState<OrdersSummary>({
    queued: 0,
    in_progress: 0,
    ready: 0,
    complications: 0,
  });
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounced<string>(query, 250);

  // Session timeout hook - called unconditionally
  useSessionTimeout(() => {
    // call logout endpoint and reload
    fetch("/api/auth/logout", { method: "POST" }).finally(() => {
      window.location.href = "/login";
    });
  }, 30 * 60 * 1000);

  // Memoized filtered menu
  const filteredMenu = useMemo(() => {
    if (!debouncedQuery) return menu;
    const q =
      typeof debouncedQuery === "string" ? debouncedQuery.toLowerCase() : "";
    return menu.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.description || "").toLowerCase().includes(q)
    );
  }, [menu, debouncedQuery]);

  // Define async functions outside of useEffect
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("failed to load stats");
      const j: Stats = await res.json();
      setStats(j);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await fetch("/api/admin/menu");
      if (!res.ok) throw new Error("failed to load menu");
      const j: { items: MenuItem[] } = await res.json();
      setMenu(j.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrdersSummary = async () => {
    try {
      const res = await fetch("/api/admin/orders/summary");
      if (!res.ok) throw new Error("failed");
      const summary: OrdersSummary = await res.json();
      setOrdersSummary(summary);
    } catch (err) {
      console.error(err);
    }
  };

  // Session fetch effect
  useEffect(() => {
    let mounted = true;
    fetchSession().then((s) => {
      if (!mounted) return;
      setSession(s);
      setLoadingSession(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Data fetching effect - now includes dependencies
  useEffect(() => {
    if (!session) return;

    // load initial data
    fetchStats();
    fetchMenu();
    fetchOrdersSummary();

    const interval = setInterval(() => {
      // poll key metrics every 8s (kitchen speed requirement)
      fetchOrdersSummary();
    }, 8000);

    return () => clearInterval(interval);
  }, [session]); // Add dependencies to fix exhaustive-deps warning

  // Early returns after all hooks are called
  if (loadingSession) {
    return <div className="p-8">Loading session...</div>;
  }

  if (!session || session.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-4">Adgang nægtet</h2>
          <p className="mb-6">
            Du skal være administrator for at se denne side.
          </p>
          <Link
            href="/login"
            className="px-4 py-2 bg-orange-600 text-white rounded"
          >
            Log ind
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Vesuvius — Admin</h1>
          <span className="text-sm text-gray-500">
            Velkommen, {session.name}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchStats();
              fetchMenu();
            }}
            className="px-3 py-1 border rounded text-sm"
          >
            Opdater
          </button>
          <Link
            href="/logout"
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Log ud
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="col-span-1 bg-white rounded-lg p-4 shadow">
          <nav className="space-y-2">
            <Link
              href="/admin"
              className="block py-2 px-3 rounded hover:bg-orange-50 font-semibold"
            >
              Oversigt
            </Link>
            <a
              href="#menu-editor"
              className="block py-2 px-3 rounded hover:bg-orange-50"
            >
              Menu Editor
            </a>
            <a
              href="#orders"
              className="block py-2 px-3 rounded hover:bg-orange-50"
            >
              Ordreoverblik
            </a>
            <a
              href="#reports"
              className="block py-2 px-3 rounded hover:bg-orange-50"
            >
              Statistik
            </a>
          </nav>
        </aside>

        {/* Main content */}
        <main className="col-span-1 lg:col-span-3 space-y-6">
          {/* Overview cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              title="Daglig omsætning"
              value={stats?.dailyRevenueFormatted || "–"}
              subtitle="I dag"
            />
            <Card
              title="Månedlig omsætning"
              value={stats?.monthlyRevenueFormatted || "–"}
              subtitle="Denne måned"
            />
            <Card
              title="Bordudnyttelse"
              value={
                stats?.tableUtilization !== undefined &&
                stats?.tableUtilization !== null
                  ? `${Math.round(stats.tableUtilization * 100)}%`
                  : "–"
              }
              subtitle="Booked vs tilgængelig"
            />
            <Card
              title="Top ret"
              value={stats?.topDish?.name || "–"}
              subtitle={`Solgt: ${stats?.topDish?.count || 0}`}
            />
          </section>

          {/* Trend chart + orders summary */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              className="lg:col-span-2 bg-white rounded-lg p-4 shadow"
              aria-labelledby="trend-title"
            >
              <h3 id="trend-title" className="text-lg font-semibold mb-3">
                Omsætning — 30 dage
              </h3>
              <div style={{ height: 220 }}>
                {stats?.trend ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart
                      data={stats.trend}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorRev"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="5%" stopOpacity={0.8} />
                          <stop offset="95%" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#f97316"
                        fillOpacity={1}
                        fill="url(#colorRev)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-sm text-gray-500">Ingen data</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold">Ordre status</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Afventer</span>
                  <strong>{ordersSummary.queued}</strong>
                </li>
                <li className="flex justify-between">
                  <span>I gang</span>
                  <strong>{ordersSummary.in_progress}</strong>
                </li>
                <li className="flex justify-between">
                  <span>Færdig</span>
                  <strong>{ordersSummary.ready}</strong>
                </li>
                <li className="flex justify-between text-red-600">
                  <span>Komplikationer</span>
                  <strong>{ordersSummary.complications}</strong>
                </li>
              </ul>
              <div className="mt-4">
                <Link
                  href="/kitchen"
                  className="block text-center px-3 py-2 bg-orange-600 text-white rounded"
                >
                  Gå til køkkenskærm
                </Link>
              </div>
            </div>
          </section>

          {/* Menu Editor */}
          <section id="menu-editor" className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Menu Editor</h3>
              <div className="flex items-center gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Søg i menupunkter..."
                  className="px-3 py-2 border rounded w-48 text-sm"
                  aria-label="Søg menupunkter"
                />
                <AddMenuItemButton onAdd={fetchMenu} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMenu.map((m) => (
                <article
                  key={m.id}
                  className="border rounded p-3 flex flex-col"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{m.name}</h4>
                      <p className="text-sm text-gray-600">
                        {m.category} •{" "}
                        {m.price ? (m.price / 100).toFixed(2) + " kr" : "–"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          const edited = prompt("Rediger navn:", m.name);
                          if (!edited) return;
                          await fetch(`/api/admin/menu/${m.id}`, {
                            method: "PUT",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ ...m, name: edited }),
                          });
                          fetchMenu();
                        }}
                        className="text-sm px-2 py-1 border rounded"
                      >
                        Rediger
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm("Slet denne ret?")) return;
                          await fetch(`/api/admin/menu/${m.id}`, {
                            method: "DELETE",
                          });
                          fetchMenu();
                        }}
                        className="text-sm px-2 py-1 border rounded text-red-600"
                      >
                        Slet
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-gray-700 flex-1">
                    {m.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>Tags: {m.tags?.join(", ") || "–"}</span>
                    <span>{m.is_active ? "Aktiv" : "Ude af kort"}</span>
                  </div>
                </article>
              ))}

              {filteredMenu.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-6">
                  Ingen menupunkter fundet
                </div>
              )}
            </div>
          </section>

          {/* Reports + settings */}
          <section id="reports" className="bg-white rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold mb-3">Rapporter</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border rounded">
                <h4 className="font-semibold">Mest solgte retter</h4>
                <ol className="mt-2 text-sm list-decimal list-inside">
                  {(stats?.topDishes || []).map((d, idx) => (
                    <li key={idx}>
                      {d.name} — {d.count}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-3 border rounded">
                <h4 className="font-semibold">Bordudnyttelse</h4>
                <p className="mt-2 text-sm">
                  Procentdel reserverede borde:{" "}
                  <strong>
                    {stats?.tableUtilization
                      ? Math.round(stats.tableUtilization * 100) + "%"
                      : "–"}
                  </strong>
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Tidsbegrænsninger på reservationer håndteres i
                  reservations-mikrotjenesten.
                </p>
              </div>

              <div className="p-3 border rounded">
                <h4 className="font-semibold">Fejlhåndteringstest</h4>
                <p className="mt-2 text-sm">
                  Kør simuleret netværksfejl og verificer DB integritet. API
                  tilbyder en test-endpoint:{" "}
                  <code>/api/admin/test/failure</code>
                </p>
              </div>
            </div>
          </section>

          <section id="settings" className="bg-white rounded-lg p-4 shadow">
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded">
                <label className="block text-sm font-medium">
                  Session timeout (min)
                </label>
                <input
                  defaultValue={30}
                  type="number"
                  min={5}
                  max={240}
                  className="mt-2 px-3 py-2 border rounded w-24"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Standard: 30 minutter inaktivitet.
                </p>
              </div>

              <div className="p-3 border rounded">
                <label className="block text-sm font-medium">
                  Password policy
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Minimum 8 tegn, mindst et tal og et stort bogstav.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ---------- Small subcomponents ---------- */

function Card({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white rounded-lg p-4 shadow flex flex-col">
      <span className="text-sm text-gray-500">{title}</span>
      <strong className="text-2xl mt-2">{value}</strong>
      {subtitle && (
        <span className="text-xs text-gray-400 mt-1">{subtitle}</span>
      )}
    </div>
  );
}

function AddMenuItemButton({ onAdd }: { onAdd?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-2 bg-green-600 text-white rounded"
      >
        Tilføj ret
      </button>
      {open && (
        <AddMenuModal
          onClose={() => {
            setOpen(false);
            onAdd?.();
          }}
        />
      )}
    </div>
  );
}

function AddMenuModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  async function submit() {
    if (!name) return alert("Indtast navn");
    await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        price_cents: Math.round(price * 100),
        category,
        description,
      }),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-3">Tilføj ny ret</h3>
        <div className="grid grid-cols-1 gap-3">
          <label className="text-sm">
            Navn
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-2 py-1 rounded mt-1"
            />
          </label>
          <label className="text-sm">
            Pris (kr)
            <input
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              type="number"
              className="w-full border px-2 py-1 rounded mt-1"
            />
          </label>
          <label className="text-sm">
            Kategori
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border px-2 py-1 rounded mt-1"
            />
          </label>
          <label className="text-sm">
            Beskrivelse
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-2 py-1 rounded mt-1"
            />
          </label>

          <div className="flex justify-end gap-2 mt-3">
            <button onClick={onClose} className="px-3 py-2 border rounded">
              Annuller
            </button>
            <button
              onClick={submit}
              className="px-3 py-2 bg-orange-600 text-white rounded"
            >
              Gem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
