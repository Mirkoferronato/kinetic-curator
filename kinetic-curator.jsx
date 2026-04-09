import { useState, useEffect, useRef } from "react";

// ── CONFIG ──────────────────────────────────────────────────────────────
const AFFILIATE_TAG = "mirkoferron07-21";
const PRODUCTS_JSON_URL = "./products.json"; // cambia con URL reale
const makeAmazonLink = (asin) =>
  `https://www.amazon.it/dp/${asin}?tag=${AFFILIATE_TAG}`;

const CATEGORIES = [
  { id: "all", label: "Tutto", icon: "star" },
  { id: "electronics", label: "Electronics", icon: "devices" },
  { id: "home", label: "Home", icon: "home" },
  { id: "fashion", label: "Fashion", icon: "apparel" },
  { id: "sport", label: "Sport", icon: "sports_soccer" },
  { id: "beauty", label: "Beauty", icon: "content_cut" },
  { id: "auto", label: "Auto", icon: "directions_car" },
  { id: "giardino", label: "Giardino", icon: "yard" },
  { id: "bambini", label: "Bambini", icon: "child_care" },
  { id: "libri", label: "Libri", icon: "menu_book" },
];

const DEMO_PRODUCTS = [
  { id: 1, cat: "electronics", title: "Cuffie Wireless Noise Cancelling Premium", price: 189, oldPrice: 345, discount: 45, asin: "B0CX23V2ZK", top10: true, top10rank: 1, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWDEBMg11W3r9m6vd1LGLz_9-gfLmJHTwN-caOFGoQbzzghjNx98AsgmPEA45etLRQztZ9vPOrmz0qjhOlM_35YzTNxga8k_Iuei3Zs5-qqXdycN4uVP128OnkgvQXSIOSUPk6sGd3EBIuccxapwXiYG7J6pn7AAjb0SKHsGXsLgkm3PxljpqK8lQ5uqzQHjtnuSywVCIiFR6KR_CHF72Dh43ywEl15zHNjIKlAnXh4g1y9U3uNsiMsuoIqZDpt4G6Zbr1eRPyTbs" },
  { id: 2, cat: "home", title: "Macchina Espresso Artisan Edition Nera", price: 299, oldPrice: 420, discount: 30, asin: "B0DEXAMPLE", top10: true, top10rank: 2, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9PdBClwizvx2DikuK1tYLAjDs3pMtGu5OCSUXkroGXfBDQFYOxN4xmNk8t63Eq-emtA1OXRxrb11Iyqwk14ibb8J3X-I0yyyi4ytFhEVahxrJ29T3FfjUG0sTACc5Tdlau46qaK_F621oK4eMB8NYy0iIqpfQEmpVkVgJd7Qtis2dvt0VckKOh2qRYBUd0hGucHgZxo3P13WqB_QV-Hsn9wTKKIgxFEU_NcunUegQZIlwWvinC3_ihkJNaOXA8-dpEcWS1_KC2Tw" },
  { id: 3, cat: "fashion", title: "Sneakers Minimalist Leather Premium", price: 75, oldPrice: 185, discount: 60, asin: "B0DFASHION", top10: true, top10rank: 3, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUmh8OC_-QmYMY-TfRjLEJWTT1Rqj_6PXq-ViFAIY_vBLIG979aqVufJi6zc8RXDYorSGicgt4AbM-Rwd5Qzbdn5vLdRvbhyeNY9T9Herdl5i8CZuhDSeacI4PlqOWGXWoRqz7qyDQNP9K2TkNXc_oSvOx-1nErE3OMmdIJk6Sy5CV0VSejmf08RYey-un3bnzVAnHfd7ENYpYNNHvKcj5UH1AyDifqrSXJB6dtEHkHKqLHpHeh1xYGg_bqp1QDi6DvZzDNxIY6z4" },
  { id: 4, cat: "electronics", title: "Smartwatch Ultra Fitness Tracker GPS", price: 129, oldPrice: 249, discount: 48, asin: "B0DWATCH01", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWDEBMg11W3r9m6vd1LGLz_9-gfLmJHTwN-caOFGoQbzzghjNx98AsgmPEA45etLRQztZ9vPOrmz0qjhOlM_35YzTNxga8k_Iuei3Zs5-qqXdycN4uVP128OnkgvQXSIOSUPk6sGd3EBIuccxapwXiYG7J6pn7AAjb0SKHsGXsLgkm3PxljpqK8lQ5uqzQHjtnuSywVCIiFR6KR_CHF72Dh43ywEl15zHNjIKlAnXh4g1y9U3uNsiMsuoIqZDpt4G6Zbr1eRPyTbs" },
  { id: 5, cat: "sport", title: "Tappetino Yoga Premium Antiscivolo 6mm", price: 34, oldPrice: 59, discount: 42, asin: "B0DSPORT01", top10: true, top10rank: 5, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9PdBClwizvx2DikuK1tYLAjDs3pMtGu5OCSUXkroGXfBDQFYOxN4xmNk8t63Eq-emtA1OXRxrb11Iyqwk14ibb8J3X-I0yyyi4ytFhEVahxrJ29T3FfjUG0sTACc5Tdlau46qaK_F621oK4eMB8NYy0iIqpfQEmpVkVgJd7Qtis2dvt0VckKOh2qRYBUd0hGucHgZxo3P13WqB_QV-Hsn9wTKKIgxFEU_NcunUegQZIlwWvinC3_ihkJNaOXA8-dpEcWS1_KC2Tw" },
  { id: 6, cat: "beauty", title: "Set Skincare Vitamina C Siero + Crema", price: 22, oldPrice: 45, discount: 51, asin: "B0DBEAUTY1", top10: true, top10rank: 4, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUmh8OC_-QmYMY-TfRjLEJWTT1Rqj_6PXq-ViFAIY_vBLIG979aqVufJi6zc8RXDYorSGicgt4AbM-Rwd5Qzbdn5vLdRvbhyeNY9T9Herdl5i8CZuhDSeacI4PlqOWGXWoRqz7qyDQNP9K2TkNXc_oSvOx-1nErE3OMmdIJk6Sy5CV0VSejmf08RYey-un3bnzVAnHfd7ENYpYNNHvKcj5UH1AyDifqrSXJB6dtEHkHKqLHpHeh1xYGg_bqp1QDi6DvZzDNxIY6z4" },
  { id: 7, cat: "auto", title: "Aspirapolvere Auto 12V Portatile 9000Pa", price: 29, oldPrice: 55, discount: 47, asin: "B0DAUTO001", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9PdBClwizvx2DikuK1tYLAjDs3pMtGu5OCSUXkroGXfBDQFYOxN4xmNk8t63Eq-emtA1OXRxrb11Iyqwk14ibb8J3X-I0yyyi4ytFhEVahxrJ29T3FfjUG0sTACc5Tdlau46qaK_F621oK4eMB8NYy0iIqpfQEmpVkVgJd7Qtis2dvt0VckKOh2qRYBUd0hGucHgZxo3P13WqB_QV-Hsn9wTKKIgxFEU_NcunUegQZIlwWvinC3_ihkJNaOXA8-dpEcWS1_KC2Tw" },
  { id: 8, cat: "giardino", title: "Robot Tagliaerba WiFi 600mq", price: 449, oldPrice: 699, discount: 36, asin: "B0DGARDEN1", top10: true, top10rank: 6, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWDEBMg11W3r9m6vd1LGLz_9-gfLmJHTwN-caOFGoQbzzghjNx98AsgmPEA45etLRQztZ9vPOrmz0qjhOlM_35YzTNxga8k_Iuei3Zs5-qqXdycN4uVP128OnkgvQXSIOSUPk6sGd3EBIuccxapwXiYG7J6pn7AAjb0SKHsGXsLgkm3PxljpqK8lQ5uqzQHjtnuSywVCIiFR6KR_CHF72Dh43ywEl15zHNjIKlAnXh4g1y9U3uNsiMsuoIqZDpt4G6Zbr1eRPyTbs" },
  { id: 9, cat: "bambini", title: "Costruzioni Magnetiche 100 Pezzi STEM", price: 28, oldPrice: 50, discount: 44, asin: "B0DKIDS001", top10: true, top10rank: 7, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUmh8OC_-QmYMY-TfRjLEJWTT1Rqj_6PXq-ViFAIY_vBLIG979aqVufJi6zc8RXDYorSGicgt4AbM-Rwd5Qzbdn5vLdRvbhyeNY9T9Herdl5i8CZuhDSeacI4PlqOWGXWoRqz7qyDQNP9K2TkNXc_oSvOx-1nErE3OMmdIJk6Sy5CV0VSejmf08RYey-un3bnzVAnHfd7ENYpYNNHvKcj5UH1AyDifqrSXJB6dtEHkHKqLHpHeh1xYGg_bqp1QDi6DvZzDNxIY6z4" },
  { id: 10, cat: "libri", title: "Kindle Paperwhite 16GB Ultima Generazione", price: 149, oldPrice: 189, discount: 21, asin: "B0DBOOKS01", top10: true, top10rank: 8, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9PdBClwizvx2DikuK1tYLAjDs3pMtGu5OCSUXkroGXfBDQFYOxN4xmNk8t63Eq-emtA1OXRxrb11Iyqwk14ibb8J3X-I0yyyi4ytFhEVahxrJ29T3FfjUG0sTACc5Tdlau46qaK_F621oK4eMB8NYy0iIqpfQEmpVkVgJd7Qtis2dvt0VckKOh2qRYBUd0hGucHgZxo3P13WqB_QV-Hsn9wTKKIgxFEU_NcunUegQZIlwWvinC3_ihkJNaOXA8-dpEcWS1_KC2Tw" },
];

// ── HOOKS ───────────────────────────────────────────────────────────────
function useCountdown() {
  const getTarget = () => { const e = new Date(); e.setHours(23,59,59,999); return e; };
  const [target] = useState(getTarget);
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const diff = Math.max(0, target - now);
  const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function useProducts() {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [source, setSource] = useState("demo");
  useEffect(() => {
    let c = false;
    fetch(PRODUCTS_JSON_URL).then(r => { if (!r.ok) throw 0; return r.json(); })
      .then(d => { if (!c && Array.isArray(d) && d.length) { setProducts(d); setSource("json"); } })
      .catch(() => {});
    return () => { c = true; };
  }, []);
  return { products, source };
}

// ── COMPONENTS ──────────────────────────────────────────────────────────
function Icon({ name, filled, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}>{name}</span>;
}

function ProductCard({ product }) {
  return (
    <a href={makeAmazonLink(product.asin)} target="_blank" rel="noopener noreferrer nofollow"
      className="group flex flex-col bg-white dark:bg-slate-800/60 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_24px_48px_rgba(10,26,58,0.08)] hover:-translate-y-1 no-underline">
      <div className="relative w-full aspect-square mb-5 overflow-hidden rounded-xl bg-gray-50 dark:bg-slate-700/40">
        <img src={product.img} alt={product.title} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute top-3 left-3 bg-[#00a7cb] text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">-{product.discount}%</div>
      </div>
      <div className="flex flex-col flex-grow">
        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.08em] mb-2">{product.cat}</p>
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-snug mb-4 flex-grow">{product.title}</h3>
        <div className="flex items-baseline gap-3 mb-5">
          <span className="text-2xl font-black text-[#ab3500] dark:text-[#ff6b35]">€{product.price},00</span>
          <span className="text-sm text-gray-400 line-through font-medium">€{product.oldPrice},00</span>
        </div>
        <div className="w-full py-3.5 bg-gradient-to-r from-[#ab3500] to-[#ff6b35] text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-orange-500/20 transition-all duration-200">
          Vai all'Offerta <Icon name="arrow_forward" className="text-sm" />
        </div>
      </div>
    </a>
  );
}

function Top10Card({ product, rank }) {
  return (
    <a href={makeAmazonLink(product.asin)} target="_blank" rel="noopener noreferrer nofollow"
      className="group flex items-center gap-4 bg-white dark:bg-slate-800/60 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 no-underline min-w-[300px] snap-start shrink-0">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${rank <= 3 ? "bg-gradient-to-br from-[#ab3500] to-[#ff6b35] text-white shadow-md shadow-orange-500/30" : "bg-[#e1e8ff] dark:bg-slate-700 text-[#0a1a3a] dark:text-gray-300"}`}>{rank}</div>
      <div className="w-16 h-16 rounded-lg bg-gray-50 dark:bg-slate-700/40 overflow-hidden shrink-0">
        <img src={product.img} alt={product.title} className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-400" loading="lazy" />
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{product.cat}</p>
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight truncate">{product.title}</h4>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-black text-[#ab3500] dark:text-[#ff6b35]">€{product.price}</span>
          <span className="text-xs text-gray-400 line-through">€{product.oldPrice}</span>
          <span className="text-[10px] font-black text-[#00a7cb]">-{product.discount}%</span>
        </div>
      </div>
      <Icon name="arrow_forward" className="text-gray-300 dark:text-gray-600 group-hover:text-[#ab3500] dark:group-hover:text-[#ff6b35] transition-colors shrink-0" />
    </a>
  );
}

// ── MAIN APP ────────────────────────────────────────────────────────────
export default function KineticCurator() {
  const [dark, setDark] = useState(false);
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const countdown = useCountdown();
  const { products, source } = useProducts();

  useEffect(() => { if (showSearch) searchRef.current?.focus(); }, [showSearch]);

  const top10 = products.filter(p => p.top10).sort((a, b) => (a.top10rank || 99) - (b.top10rank || 99)).slice(0, 10);
  const filtered = products.filter(p => {
    const catMatch = activeCat === "all" || p.cat === activeCat;
    const searchMatch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div className={dark ? "dark" : ""} style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="min-h-screen bg-[#faf8ff] dark:bg-[#0a1a3a] text-[#0a1a3a] dark:text-[#faf8ff] transition-colors duration-300">

        {/* HEADER */}
        <header className="fixed top-0 w-full z-50 bg-[#faf8ff]/90 dark:bg-[#0a1a3a]/90 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-center justify-between px-5 py-3.5 max-w-6xl mx-auto">
            <button onClick={() => setShowSearch(s => !s)} className="text-[#ab3500] dark:text-[#ff6b35] hover:opacity-70 transition-opacity">
              <Icon name={showSearch ? "close" : "search"} />
            </button>
            <div className="font-black tracking-[-0.05em] text-xl uppercase select-none">KINETIC</div>
            <button onClick={() => setDark(d => !d)} className="text-[#ab3500] dark:text-[#ff6b35] hover:opacity-70 transition-opacity">
              <Icon name={dark ? "light_mode" : "dark_mode"} />
            </button>
          </div>
          {showSearch && (
            <div className="px-5 pb-3 max-w-6xl mx-auto">
              <input ref={searchRef} type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca offerte..."
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#ab3500]/30 transition-all placeholder:text-gray-400" />
            </div>
          )}
        </header>

        <main className="pt-20 pb-28 md:pb-12">

          {/* HERO */}
          <section className="px-5 py-10 md:py-16 max-w-6xl mx-auto">
            <div className="bg-[#f1f3ff] dark:bg-slate-800/50 rounded-2xl p-8 md:p-14 relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b35]/10 blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00a7cb]/8 blur-[60px] -ml-24 -mb-24 pointer-events-none" />
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[-0.03em] uppercase mb-6 leading-[1.05]">Le Migliori Offerte<br />del Giorno</h1>
              <div className="inline-flex items-center gap-3 bg-[#0a1a3a] dark:bg-white text-white dark:text-[#0a1a3a] px-6 py-3 rounded-full text-sm tracking-[0.05em] uppercase shadow-lg font-medium">
                <Icon name="schedule" className="text-[#ff6b35] dark:text-[#ab3500] scale-75" />
                Termina tra <span className="text-[#ff6b35] dark:text-[#ab3500] font-black tabular-nums font-mono">{countdown}</span>
              </div>
            </div>
          </section>

          {/* TOP 10 */}
          {top10.length > 0 && (
            <section className="px-5 max-w-6xl mx-auto mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ab3500] to-[#ff6b35] flex items-center justify-center">
                  <Icon name="trophy" className="text-white text-lg" />
                </div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Top 10 del Momento</h2>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
                {top10.map((p, i) => <Top10Card key={p.id} product={p} rank={i + 1} />)}
              </div>
            </section>
          )}

          {/* CATEGORY CHIPS */}
          <section className="hidden md:flex justify-center gap-3 px-5 mb-10 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setActiveCat(c.id)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeCat === c.id ? "bg-[#ab3500] text-white shadow-md shadow-orange-500/20" : "bg-[#e1e8ff] dark:bg-slate-700 text-[#0a1a3a] dark:text-gray-300 hover:bg-[#d9e2ff] dark:hover:bg-slate-600"}`}>
                {c.label}
              </button>
            ))}
          </section>

          {/* GRID */}
          <section className="px-5 max-w-6xl mx-auto">
            {source === "json" && (
              <div className="flex items-center gap-2 mb-4 text-xs text-green-600 dark:text-green-400 font-medium">
                <Icon name="cloud_done" className="text-base" /> Prodotti caricati da JSON esterno
              </div>
            )}
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Icon name="search_off" className="text-5xl mb-3 block" />
                <p className="text-sm">Nessuna offerta trovata</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </section>
        </main>

        {/* FOOTER */}
        <footer className="w-full py-8 bg-[#f1f3ff] dark:bg-[#1a2a4a]">
          <div className="flex flex-col items-center text-center px-8 gap-3">
            <div className="flex gap-6">
              {["Privacy", "Terms", "Verified Deals"].map(l => <a key={l} href="#" className="text-xs text-gray-500 dark:text-gray-400 no-underline hover:text-[#ab3500] transition-colors">{l}</a>)}
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 max-w-md">© 2026 Kinetic Curator. Affiliate Disclosure: potremmo ricevere commissioni dagli acquisti effettuati tramite i nostri link.</p>
          </div>
        </footer>

        {/* BOTTOM NAV */}
        <nav className="md:hidden fixed bottom-0 w-full z-50 bg-[#faf8ff]/85 dark:bg-[#0a1a3a]/85 backdrop-blur-xl border-t border-gray-200/20 dark:border-gray-700/20">
          <div className="flex justify-around items-center h-16 px-2">
            {CATEGORIES.filter(c => ["electronics","home","fashion","sport","beauty"].includes(c.id)).map(c => {
              const active = activeCat === c.id;
              return (
                <button key={c.id} onClick={() => setActiveCat(c.id === activeCat ? "all" : c.id)}
                  className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${active ? "text-[#ab3500] dark:text-[#ff6b35]" : "text-gray-400 dark:text-gray-500"}`}>
                  <Icon name={c.icon} filled={active} />
                  <span className="text-[10px] font-bold tracking-[0.04em] uppercase">{c.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
    </div>
  );
}
