import React, { useEffect, useMemo, useState } from "react";
import {
  Home, Folder, Tags, Star, BookOpen, Search, Play, Image as ImageIcon,
  Video, ChevronLeft, ChevronRight, X, Loader2, AlertCircle
} from "lucide-react";

// ==========================================
// PASTE YOUR DEPLOYED APPS SCRIPT URL HERE
// ==========================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwHSa68x5oLGYWjTHUjICny7D6nFd2oDgXfS3NPMgCLat1QVzk8vw6VWrAiShQY5EX5Ig/exec';



const popularTags = [
  "Travel", "Nature", "Portraits", "Lifestyle", "Technology", "Food",
  "Architecture", "Wildlife", "Tutorials", "Behind the scenes",
  "Events", "Creative", "Short films", "Photography"
];

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [activeMedia, setActiveMedia] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    let alive = true;

    async function loadGallery() {
      try {
        if (!SCRIPT_URL) {
          setLoading(false);
          return;
        }
        const response = await fetch(SCRIPT_URL);
        if (!response.ok) throw new Error(`Unable to load gallery (${response.status})`);
        const data = await response.json();
        if (alive) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        if (alive) setError(err.message || "Could not load gallery.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadGallery();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const typeMatch = activeType === "all" || item.type === activeType;
      const titleMatch = !search || (item.title || "").toLowerCase().includes(search.toLowerCase());
      const tagMatch = !activeTag || (item.tags || []).some(
        (tag) => String(tag).toLowerCase() === activeTag.toLowerCase()
      );
      return typeMatch && titleMatch && tagMatch;
    });
  }, [items, activeType, search, activeTag]);

  useEffect(() => setPage(1), [activeType, search, activeTag]);

  const featured = filtered[0];
  const galleryItems = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const thumbnail = (item, size = "w1000") =>
    `https://drive.google.com/thumbnail?id=${item.id}&sz=${size}`;

  return (
    <div className="min-h-screen bg-[#101010] text-white">
      <header className="border-b border-white/10 bg-[#171717]">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <a href="#" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600">
              <Play size={19} fill="white" />
            </span>
            <span className="text-left">
              <span className="block text-3xl font-bold tracking-tight">
                Kamababa Desi
              </span>
              <span className="mt-1 block text-sm text-neutral-400">
                Watch free Desi sex videos & Indian girls nude mms xxx videos
              </span>
            </span>
          </a>

          <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-[560px]">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search gallery..."
                className="h-11 w-full border border-white/10 bg-[#222] pl-11 pr-4 text-sm outline-none transition focus:border-violet-500"
              />
            </div>
            <button className="flex h-11 w-12 items-center justify-center bg-violet-600 transition hover:bg-violet-500" aria-label="Search">
              <Search size={19} />
            </button>
          </form>
        </div>

        <nav className="border-y border-white/10 bg-gradient-to-b from-[#292929] to-[#1d1d1d]">
          <div className="mx-auto flex max-w-[1500px] overflow-x-auto px-5 lg:px-10">
            {[
              [Home, "Home"], [Folder, "Categories"], [Tags, "Tags"],
              [Star, "Creators"], [BookOpen, "Stories"]
            ].map(([Icon, label], index) => (
              <button
                key={label}
                onClick={() => { setActiveTag(""); setActiveType("all"); }}
                className={`flex shrink-0 items-center gap-2 border-r border-white/10 px-5 py-4 text-sm transition hover:bg-white/10 ${index === 0 ? "bg-white/5 text-white" : "text-neutral-300"}`}
              >
                <Icon size={15} fill={label === "Creators" ? "currentColor" : "none"} />
                {label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-8 lg:px-10">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">Featured collection</p>
                <h1 className="mt-1 text-xl font-semibold">Explore the gallery</h1>
              </div>
              <span className="text-xs text-neutral-500">{filtered.length} items</span>
            </div>

            {loading ? (
              <div className="flex min-h-[420px] items-center justify-center border border-white/10 bg-[#191919] text-neutral-400">
                <Loader2 className="mr-3 animate-spin text-violet-500" /> Loading gallery...
              </div>
            ) : error ? (
              <div className="flex min-h-[220px] items-center gap-3 border border-red-900/50 bg-red-950/20 p-5 text-sm text-red-300">
                <AlertCircle size={20} /> {error}
              </div>
            ) : featured ? (
              <button
                onClick={() => setActiveMedia(featured)}
                className="group relative block aspect-video w-full overflow-hidden border border-violet-700/70 bg-black text-left shadow-[0_15px_50px_rgba(0,0,0,.35)]"
              >
                <img src={thumbnail(featured, "w1600")} alt={featured.title || "Featured media"} referrerPolicy="no-referrer" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]" />
                <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/10" />
                <span className="absolute left-4 top-4 flex items-center gap-2 bg-black/65 px-3 py-1.5 text-xs uppercase tracking-wider text-white backdrop-blur">
                  {featured.type === "video" ? <Video size={14} /> : <ImageIcon size={14} />}
                  Featured {featured.type}
                </span>
                {featured.type === "video" && (
                  <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white bg-violet-700/90 shadow-xl transition group-hover:scale-110">
                    <Play size={34} fill="white" className="ml-1" />
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 pt-20">
                  <span className="block text-xl font-semibold sm:text-2xl">{featured.title || "Featured media"}</span>
                  <span className="mt-1 block text-sm text-neutral-300">{featured.date || "Gallery highlight"}</span>
                </span>
              </button>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center border border-white/10 bg-[#191919] text-center">
                <ImageIcon size={34} className="mb-3 text-neutral-600" />
                <p className="font-medium">No media found</p>
                <p className="mt-1 text-sm text-neutral-500">Try another search or category.</p>
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-3">
              <div>
                <h2 className="text-lg font-semibold">Latest uploads</h2>
                <p className="mt-1 text-xs text-neutral-500">Browse the newest photos and videos</p>
              </div>
              <div className="flex gap-1 rounded-sm border border-white/10 bg-[#1b1b1b] p-1">
                {["all", "photo", "video"].map((type) => (
                  <button key={type} onClick={() => setActiveType(type)} className={`px-3 py-2 text-xs capitalize transition ${activeType === type ? "bg-violet-600 text-white" : "text-neutral-400 hover:text-white"}`}>
                    {type === "photo" ? "Photos" : type === "video" ? "Videos" : "All"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.filter((item) => !featured || item.id !== featured.id).map((item) => (
                <button key={item.id} onClick={() => setActiveMedia(item)} className="group overflow-hidden border border-white/10 bg-[#1a1a1a] text-left transition hover:border-violet-500/70">
                  <div className="relative aspect-video overflow-hidden bg-black">
                    <img src={thumbnail(item, "w800")} alt={item.title || "Gallery item"} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-wider text-neutral-200">{item.type}</span>
                    {item.type === "video" && <span className="absolute inset-0 flex items-center justify-center bg-black/15"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600/90"><Play size={18} fill="white" /></span></span>}
                  </div>
                  <div className="p-3">
                    <h3 className="truncate text-sm font-medium text-neutral-100 group-hover:text-violet-300">{item.title || "Untitled media"}</h3>
                    <p className="mt-2 text-[11px] text-neutral-500">{item.date || "Recently added"}</p>
                  </div>
                </button>
              ))}
            </div>

            {filtered.length > perPage && (
              <div className="mt-6 flex items-center justify-between border border-white/10 bg-[#191919] px-4 py-3 text-xs text-neutral-400">
                <span>Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="border border-white/10 p-2 hover:bg-white/10 disabled:opacity-30"><ChevronLeft size={16} /></button>
                  <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="border border-white/10 p-2 hover:bg-white/10 disabled:opacity-30"><ChevronRight size={16} /></button>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="border border-white/10 bg-[#191919]">
              <h2 className="border-l-[5px] border-violet-600 bg-[#292929] px-4 py-3 text-base font-semibold">Popular tags</h2>
              <div className="flex flex-wrap gap-2 p-3">
                {popularTags.map((tag) => (
                  <button key={tag} onClick={() => setActiveTag(activeTag === tag ? "" : tag)} className={`inline-flex items-center gap-1.5 border px-3 py-2 text-xs transition ${activeTag === tag ? "border-violet-500 bg-violet-700 text-white" : "border-white/10 bg-[#343434] text-neutral-200 hover:border-violet-500 hover:bg-[#414141]"}`}>
                    <Tags size={12} /> {tag}
                  </button>
                ))}
              </div>
              {activeTag && <button onClick={() => setActiveTag("")} className="flex items-center gap-1 px-4 pb-4 text-xs text-violet-300 hover:text-white"><X size={13} /> Clear tag filter</button>}
            </section>

            <section className="border border-white/10 bg-[#191919]">
              <h2 className="border-l-[5px] border-violet-600 bg-[#292929] px-4 py-3 text-base font-semibold">Browse media</h2>
              <div className="divide-y divide-white/10">
                <button onClick={() => setActiveType("photo")} className="flex w-full items-center justify-between px-4 py-3 text-sm text-neutral-300 hover:bg-white/5"><span className="flex items-center gap-2"><ImageIcon size={15} /> Photos</span><span className="text-neutral-500">{items.filter(i => i.type === "photo").length}</span></button>
                <button onClick={() => setActiveType("video")} className="flex w-full items-center justify-between px-4 py-3 text-sm text-neutral-300 hover:bg-white/5"><span className="flex items-center gap-2"><Video size={15} /> Videos</span><span className="text-neutral-500">{items.filter(i => i.type === "video").length}</span></button>
                <button onClick={() => { setActiveType("all"); setActiveTag(""); setSearch(""); }} className="flex w-full items-center justify-between px-4 py-3 text-sm text-neutral-300 hover:bg-white/5"><span className="flex items-center gap-2"><Folder size={15} /> All media</span><span className="text-neutral-500">{items.length}</span></button>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <footer className="mt-10 border-t border-white/10 bg-[#171717] px-5 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} MediaHouse. All rights reserved.
      </footer>

      {activeMedia && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex flex-col bg-black/95">
          <div className="flex items-center justify-between border-b border-white/10 bg-[#151515] px-4 py-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-violet-400">{activeMedia.type}</p>
              <h2 className="truncate text-sm font-semibold">{activeMedia.title || "Media preview"}</h2>
            </div>
            <button onClick={() => setActiveMedia(null)} className="ml-4 p-2 text-neutral-300 hover:bg-white/10" aria-label="Close preview"><X size={21} /></button>
          </div>
          <div className="flex flex-1 items-center justify-center p-3 sm:p-8">
            {activeMedia.type === "video" ? (
              <iframe title={activeMedia.title || "Video"} src={`https://drive.google.com/file/d/${activeMedia.id}/preview`} allow="autoplay; fullscreen" allowFullScreen className="aspect-video w-full max-w-5xl border-0 bg-black" />
            ) : (
              <img src={thumbnail(activeMedia, "w1600")} alt={activeMedia.title || "Photo"} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" />
            )}
          </div>
          <div className="border-t border-white/10 px-5 py-3 text-xs text-neutral-400">{activeMedia.date || ""}</div>
        </div>
      )}
    </div>
  );
}

