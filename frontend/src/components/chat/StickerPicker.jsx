import React, { useState, useEffect, useRef } from "react";
import { Search, X, Sparkles } from "lucide-react";
import { STICKER_CATEGORIES, STICKERS } from "../../data/stickers";

const StickerPicker = ({ isOpen, onClose, onSelectSticker, anchorRef }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const pickerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        (!anchorRef?.current || !anchorRef.current.contains(event.target))
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  // Filter stickers
  const filteredStickers = STICKERS.filter((sticker) => {
    const matchesSearch =
      !searchQuery ||
      sticker.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sticker.emoji.includes(searchQuery);

    if (!matchesSearch) return false;

    if (activeCategory === "all") return true;
    if (activeCategory === "popular") return sticker.popular;
    return sticker.category === activeCategory;
  });

  return (
    <div
      ref={pickerRef}
      role="dialog"
      aria-label="Sticker Picker"
      className="absolute bottom-14 right-2 sm:right-6 w-[320px] sm:w-[360px] max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95 origin-bottom-right"
    >
      {/* Header / Search bar */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between gap-2 shrink-0 bg-slate-950/60">
        <div className="relative flex-1 flex items-center">
          <Search size={14} className="absolute left-2.5 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stickers..."
            className="w-full pl-8 pr-7 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 text-slate-500 hover:text-slate-300 p-0.5"
            >
              <X size={12} />
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition cursor-pointer"
          title="Close picker"
        >
          <X size={15} />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 p-2 overflow-x-auto border-b border-slate-800/80 scrollbar-none shrink-0 bg-slate-950/40">
        {STICKER_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchQuery("");
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isActive
                  ? "bg-sky-600/90 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <span className="text-xs">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sticker Grid Container */}
      <div className="p-3 max-h-[260px] overflow-y-auto min-h-[200px] flex-1">
        {filteredStickers.length > 0 ? (
          <div className="grid grid-cols-5 gap-2">
            {filteredStickers.map((sticker) => (
              <button
                key={sticker.id}
                onClick={() => {
                  onSelectSticker(sticker.emoji);
                  onClose();
                }}
                title={sticker.label}
                className="group relative flex flex-col items-center justify-center p-2 rounded-xl border border-transparent hover:border-slate-700/80 hover:bg-slate-800/70 transition-all duration-150 cursor-pointer aspect-square active:scale-95"
              >
                <span className="text-3xl group-hover:scale-125 transition-transform duration-150 drop-shadow-sm select-none">
                  {sticker.emoji}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-1 bg-slate-950 text-[9px] text-slate-300 px-1.5 py-0.5 rounded border border-slate-800 pointer-events-none truncate max-w-full z-10 shadow-md">
                  {sticker.label}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
            <Sparkles size={24} className="mb-2 text-slate-600" />
            <p className="text-xs font-medium">No stickers found</p>
            <p className="text-[10px] text-slate-600 mt-0.5">Try searching for something else</p>
          </div>
        )}
      </div>

      {/* Footer info bar */}
      <div className="px-3 py-1.5 bg-slate-950/80 border-t border-slate-800/60 text-[10px] text-slate-500 flex items-center justify-between shrink-0">
        <span>WhatsApp Style Stickers</span>
        <span className="font-semibold text-slate-400">{filteredStickers.length} available</span>
      </div>
    </div>
  );
};

export default StickerPicker;
