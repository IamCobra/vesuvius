"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Recharts dynamiske imports
const AreaChart = dynamic(() => import("recharts").then((m) => m.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then((m) => m.Area), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });

// debounce hook
function useDebounced<T>(value: T, delay = 300): T {
  const [state, setState] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setState(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return state;
}

// session timeout hook
function useSessionTimeout(onTimeout: () => void, timeoutMs = 30 * 60 * 1000) {
  useEffect(() => {
    let last = Date.now();
    const events = ["mousemove", "keydown", "touchstart", "click"];
    const reset = () => (last = Date.now());
    events.forEach((e) => window.addEventListener(e, reset));
    const iv = setInterval(() => {
      if (Date.now() - last > timeoutMs) onTimeout();
    }, 10000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      clearInterval(iv);
    };
  }, [onTimeout, timeoutMs]);
}

interface Session { role: string; name: string; }
interface TrendPoint { date: string; revenue: number; }
interface Stats {
  dailyRevenueFormatted?: string;
  monthlyRevenueFormatted?: string;
  tableUtilization?: number;
  topDish?: { name: string; count: number };
  topDishes?: { name: string; count: number }[];
  trend?: TrendPoint[];
}
interface MenuItem { id: string; name: string; category?: string; price?: number; description?: string; tags?: string[]; is_active?: boolean; }
interface OrdersSummary { queued: number; in_progress: number; ready: number; complications: number; }

export default function AdminDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [ordersSummary, setOrdersSummary] = useState<OrdersSummary>({ queued: 0, in_progress: 0, ready: 0, complications: 0 });
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 250);

  useSessionTimeout(() => {
    fetch("/api/auth/logout", { method: "POST" }).finally(() => window.location.href = "/login");
  }, 30 * 60 * 1000);

  const filteredMenu = useMemo(() => {
    if (!debouncedQuery) return menu;
    const q = debouncedQuery.toLowerCase();
    return menu.filter(m => m.name.toLowerCase().includes(q) || (m.description || "").toLowerCase().includes(q));
  }, [menu, debouncedQuery]);

  const fetchStats = async () => {
    try { const res = await fetch("/api/admin/stats"); if (!res.ok) throw new Error(); setStats(await res.json()); } 
    catch (err) { console.error(err); }
  };
  const fetchMenu = async () => {
    try { const res = await fetch("/api/admin/menu"); if (!res.ok) throw new Error(); const j = await res.json(); setMenu(j.items || []); } 
    catch (err) { console.error(err); }
  };
  const fetchOrdersSummary = async () => {
    try { const res = await fetch("/api/admin/orders/summary"); if (!res.ok) throw new Error(); const s: OrdersSummary = await res.json(); setOrdersSummary(s); } 
    catch (err) { console.error(err); }
  };

  useEffect(() => { setSession({ role: "admin", name: "Dev Tester" }); setLoadingSession(false); }, []);

  useEffect(() => {
    if (!session) return;
    fetchStats(); fetchMenu(); fetchOrdersSummary();
    const interval = setInterval(fetchOrdersSummary, 8000);
    return () => clearInterval(interval);
  }, [session]);

  if (loadingSession) return <div className="p-8 text-gray-900">Indlæser session...</div>;
  if (!session || session.role !== "admin") return (
    <div className="min-h-screen flex items-center justify-center bg-burgundy-light">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Adgang nægtet</h2>
        <p className="mb-6 text-gray-700">Du skal være administrator for at se denne side.</p>
        <Link href="/login" className="px-4 py-2 bg-burgundy-primary hover:bg-burgundy-dark text-white rounded-2xl transition">
          Log ind
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-burgundy-light">
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="col-span-1 bg-white rounded-2xl p-4 shadow-lg">
          <nav className="space-y-3">
            {["Oversigt","Menu Editor","Ordreoverblik","Statistik"].map((label,i)=>
              <a key={i} href={`#${label.toLowerCase().replace(' ','')}`} className="block py-2 px-4 rounded-2xl hover:bg-burgundy-light text-gray-900 font-semibold transition">{label}</a>
            )}
          </nav>
        </aside>

        {/* Main content */}
        <main className="col-span-1 lg:col-span-3 space-y-6">
          {/* Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card title="Daglig omsætning" value={stats?.dailyRevenueFormatted || "–"} subtitle="I dag" />
            <Card title="Månedlig omsætning" value={stats?.monthlyRevenueFormatted || "–"} subtitle="Denne måned" />
            <Card title="Bordudnyttelse" value={stats?.tableUtilization !== undefined ? `${Math.round(stats.tableUtilization*100)}%`:"–"} subtitle="Booked vs tilgængelig" />
            <Card title="Top ret" value={stats?.topDish?.name || "–"} subtitle={`Solgt: ${stats?.topDish?.count||0}`} />
          </section>

          {/* Trend + ordre */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Omsætning — 30 dage</h3>
              <div style={{height:220}}>
                {stats?.trend ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={stats.trend} margin={{ top:5,right:20,left:0,bottom:5 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--burgundy-primary)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="var(--burgundy-primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="var(--burgundy-primary)" fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : <div className="text-sm text-gray-500">Ingen data</div>}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Ordre status</h4>
              <ul className="space-y-2 text-gray-900">
                <li className="flex justify-between"><span>Afventer</span><strong>{ordersSummary.queued}</strong></li>
                <li className="flex justify-between"><span>I gang</span><strong>{ordersSummary.in_progress}</strong></li>
                <li className="flex justify-between"><span>Færdig</span><strong>{ordersSummary.ready}</strong></li>
                <li className="flex justify-between text-red-600"><span>Komplikationer</span><strong>{ordersSummary.complications}</strong></li>
              </ul>
              <Link href="/kitchen" className="mt-4 block text-center px-4 py-2 bg-burgundy-primary hover:bg-burgundy-dark text-white rounded-2xl transition">
                Gå til køkkenskærm
              </Link>
            </div>
          </section>

          {/* Menu Editor */}
          <section id="menueditor" className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Menu Editor</h3>
              <div className="flex items-center gap-2">
                <input
                  value={query}
                  onChange={(e)=>setQuery(e.target.value)}
                  placeholder="Søg i menupunkter..."
                  className="px-3 py-2 border rounded-2xl w-48 text-sm focus:ring-2 focus:ring-burgundy-primary focus:outline-none text-gray-900 bg-white placeholder-gray-500"
                />
                <AddMenuItemButton onAdd={fetchMenu} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMenu.map(m => (
                <article key={m.id} className="border rounded-2xl p-4 flex flex-col hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{m.name}</h4>
                        <p className="text-sm text-gray-800">{m.category} • {m.price !== undefined && m.price !== null && !isNaN(Number(m.price)) ? Number(m.price).toFixed(2) + " kr" : "–"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={async ()=>{
                          const edited = prompt("Rediger navn:",m.name);
                          if(!edited) return;
                          await fetch(`/api/admin/menu/${m.id}`,{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({...m,name:edited})});
                          fetchMenu();
                        }}
                        className="text-sm px-3 py-1 rounded-2xl border bg-burgundy-primary text-white hover:bg-burgundy-dark transition"
                      >
                        Rediger
                      </button>
                      <button
                        onClick={async ()=>{
                          if(!confirm("Slet denne ret?")) return;
                          await fetch(`/api/admin/menu/${m.id}`,{method:"DELETE"});
                          fetchMenu();
                        }}
                        className="text-sm px-3 py-1 rounded-2xl border border-red-600 text-red-600 hover:bg-red-100 transition"
                      >
                        Slet
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 flex-1">{m.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>Tags: {m.tags?.join(", ") || "–"}</span>
                    <span>{m.is_active ? "Aktiv" : "Ude af kort"}</span>
                  </div>
                </article>
              ))}
              {filteredMenu.length === 0 && <div className="col-span-full text-center text-gray-500 py-6">Ingen menupunkter fundet</div>}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */
function Card({ title, value, subtitle }: { title:string; value:string; subtitle?:string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg flex flex-col hover:shadow-xl transition">
      <span className="text-sm text-gray-800">{title}</span>
      <strong className="text-2xl mt-2 text-burgundy-primary">{value}</strong>
      {subtitle && <span className="text-xs text-gray-700 mt-1">{subtitle}</span>}
    </div>
  );
}

function AddMenuItemButton({ onAdd }: { onAdd?: ()=>void }) {
  const [open,setOpen] = useState(false);
  return (
    <div>
      <button onClick={()=>setOpen(true)} className="px-4 py-2 bg-burgundy-primary hover:bg-burgundy-dark text-white rounded-2xl font-semibold transition">Tilføj ret</button>
      {open && <AddMenuModal onClose={()=>{setOpen(false); onAdd?.();}} />}
    </div>
  );
}

function AddMenuModal({ onClose }: { onClose:()=>void }) {
  const [name,setName]=useState("");
  const [price,setPrice]=useState(0);
  const [category,setCategory]=useState("");
  const [description,setDescription]=useState("");

  async function submit() {
    if(!name) return alert("Indtast navn");
    await fetch("/api/admin/menu",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({name,price,category,description})
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
  <div className="bg-white rounded-2xl p-6 w-full max-w-lg text-gray-900">
        <h3 className="text-lg font-semibold mb-3">Tilføj ny ret</h3>
        <div className="grid grid-cols-1 gap-3">
          <label className="text-sm">Navn<input value={name} onChange={(e)=>setName(e.target.value)} className="w-full border px-2 py-1 rounded-2xl mt-1"/></label>
          <label className="text-sm">Pris (kr)<input type="number" value={price} onChange={(e)=>setPrice(Number(e.target.value))} className="w-full border px-2 py-1 rounded-2xl mt-1"/></label>
          <label className="text-sm">Kategori<input value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full border px-2 py-1 rounded-2xl mt-1"/></label>
          <label className="text-sm">Beskrivelse<textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full border px-2 py-1 rounded-2xl mt-1"/></label>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={onClose} className="px-3 py-2 border rounded-2xl">Annuller</button>
            <button onClick={submit} className="px-3 py-2 bg-burgundy-primary hover:bg-burgundy-dark text-white rounded-2xl">Gem</button>
          </div>
        </div>
      </div>
    </div>
  );
}
