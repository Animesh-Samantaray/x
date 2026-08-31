import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

const DateTimePicker = ({ value, onChange, error }) => {
  const todayStr = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(todayStr);
  const [hour, setHour] = useState("03");
  const [minute, setMinute] = useState("30");
  const [ampm, setAmpm] = useState("PM");

  useEffect(() => {
    if (value) {
      try {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          setDate(`${yyyy}-${mm}-${dd}`);

          let h = d.getHours();
          const m = String(d.getMinutes()).padStart(2, "0");
          const period = h >= 12 ? "PM" : "AM";

          h = h % 12;
          h = h ? h : 12;

          setHour(String(h).padStart(2, "0"));
          setMinute(m);
          setAmpm(period);
        }
      } catch (err) {
        console.error("Invalid date value passed to DateTimePicker:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!date) return;

    let h = parseInt(hour, 10);
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;

    const [year, month, day] = date.split("-").map(Number);
    const combinedDate = new Date(year, month - 1, day, h, parseInt(minute, 10), 0);

    if (!isNaN(combinedDate.getTime())) {
      onChange(combinedDate.toISOString());
    }
  }, [date, hour, minute, ampm]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <CalendarIcon size={12} className="text-accent-purple" /> Select Date <span className="text-rose-400">*</span>
          </label>
          <input
            type="date"
            min={todayStr}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full form-input text-xs rounded-xl p-2.5 bg-bg-dark text-text-title border border-glass-border focus:border-accent-purple/50 focus:outline-none cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Clock size={12} className="text-accent-cyan" /> Select Time (12h) <span className="text-rose-400">*</span>
          </label>
          <div className="flex items-center gap-1.5">
            <select
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="form-input text-xs rounded-xl p-2.5 bg-bg-dark text-text-title border border-glass-border focus:border-accent-purple/50 cursor-pointer flex-1"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const val = String(i + 1).padStart(2, "0");
                return (
                  <option key={val} value={val}>
                    {val}
                  </option>
                );
              })}
            </select>

            <span className="text-text-muted font-bold">:</span>

            <select
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="form-input text-xs rounded-xl p-2.5 bg-bg-dark text-text-title border border-glass-border focus:border-accent-purple/50 cursor-pointer flex-1"
            >
              {["00", "15", "30", "45"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={ampm}
              onChange={(e) => setAmpm(e.target.value)}
              className="form-input text-xs rounded-xl p-2.5 bg-bg-dark text-text-title font-bold border border-glass-border focus:border-accent-purple/50 cursor-pointer w-20"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
      </div>

      {error && <p className="text-[10px] text-rose-400 font-semibold">{error}</p>}
    </div>
  );
};

export default DateTimePicker;
