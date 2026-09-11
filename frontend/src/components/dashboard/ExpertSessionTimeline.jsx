import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock, User, Video, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * Custom Daily Session Timeline Calendar Component for Expert Dashboard.
 * Maps actual real backend MentorshipSession records day-by-day with colored status dots.
 * 
 * GREEN DOT = Upcoming / Incomplete session (status: open, upcoming, pending, accepted)
 * RED DOT = Completed session (status: completed)
 * MUTED/GRAY DOT = Cancelled / Rejected session
 */
const ExpertSessionTimeline = ({ sessions = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDaySessions, setSelectedDaySessions] = useState(null);
  const [selectedDayLabel, setSelectedDayLabel] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Group real backend sessions by day key "YYYY-MM-DD"
  const sessionMap = new Map();

  sessions.forEach((session) => {
    if (!session.scheduledAt) return;
    const dateObj = new Date(session.scheduledAt);
    if (isNaN(dateObj.getTime())) return;

    // Use local year, month, date to prevent UTC timezone shifts
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${d}`;

    if (!sessionMap.has(key)) {
      sessionMap.set(key, []);
    }
    sessionMap.get(key).push(session);
  });

  // Calculate calendar days matrix for the current month
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDays = lastDayOfMonth.getDate();

  // Get starting day index (Mon=0 ... Sun=6)
  let startDayIndex = firstDayOfMonth.getDay() - 1; // Mon index 0
  if (startDayIndex === -1) startDayIndex = 6; // Sunday

  const calendarDays = [];

  // Padding days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      dayNumber: prevMonthLastDay - i,
      isCurrentMonth: false,
      dateKey: null,
      sessions: [],
    });
  }

  // Days of current month
  const todayObj = new Date();
  const todayKey = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;

  for (let d = 1; d <= totalDays; d++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const daySessions = sessionMap.get(key) || [];
    calendarDays.push({
      dayNumber: d,
      isCurrentMonth: true,
      dateKey: key,
      isToday: key === todayKey,
      sessions: daySessions,
    });
  }

  // Total session count across all loaded sessions
  const totalSessionsCount = sessions.length;

  const handleDayClick = (dayObj) => {
    if (!dayObj.isCurrentMonth || !dayObj.dateKey) return;
    const formattedDate = new Date(year, month, dayObj.dayNumber).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setSelectedDayLabel(formattedDate);
    setSelectedDaySessions(dayObj.sessions);
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-glass-border pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest block">
            MENTORSHIP SESSIONS
          </span>
          <h3 className="text-base font-extrabold text-text-title font-display flex items-center gap-2">
            <span>Monthly Session Activity</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {totalSessionsCount} Sessions
            </span>
          </h3>
        </div>

        {/* Month Navigation & Legend */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span>Upcoming</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
              <span>Completed</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-bg-darker p-1 rounded-xl border border-glass-border">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-title transition cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-mono font-bold px-2 text-text-title">
              {monthName} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-title transition cursor-pointer"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={handleToday}
              className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* 7-Column Calendar Grid */}
      <div className="space-y-2">
        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-text-muted uppercase">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((dayObj, idx) => {
            const hasSessions = dayObj.sessions.length > 0;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15, delay: idx * 0.005 }}
                onClick={() => handleDayClick(dayObj)}
                className={`relative min-h-[64px] sm:min-h-[76px] p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border transition-all duration-150 flex flex-col justify-between ${
                  !dayObj.isCurrentMonth
                    ? "opacity-25 bg-bg-darker/20 border-glass-border/20 cursor-default"
                    : dayObj.isToday
                    ? "bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] cursor-pointer"
                    : hasSessions
                    ? "bg-bg-darker/60 border-glass-border hover:border-emerald-500/40 hover:bg-bg-darker/90 cursor-pointer"
                    : "bg-bg-darker/30 border-glass-border/40 hover:border-glass-border cursor-pointer"
                }`}
              >
                {/* Day Number */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono font-bold ${
                      dayObj.isToday
                        ? "text-purple-400 font-extrabold"
                        : dayObj.isCurrentMonth
                        ? "text-text-title"
                        : "text-text-muted"
                    }`}
                  >
                    {dayObj.dayNumber}
                  </span>

                  {hasSessions && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-white/5 border border-glass-border text-text-muted">
                      {dayObj.sessions.length}
                    </span>
                  )}
                </div>

                {/* Session Dots Container */}
                <div className="flex flex-wrap gap-1 items-center justify-start min-h-[16px] pt-1">
                  {dayObj.sessions.map((session, sIdx) => {
                    const isCompleted = session.status === "completed";
                    const isCancelled = session.status === "cancelled" || session.status === "rejected";

                    let dotClass = "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]"; // Green for upcoming/incomplete
                    let labelStatus = "Upcoming";

                    if (isCompleted) {
                      dotClass = "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.7)]"; // Red for completed
                      labelStatus = "Completed";
                    } else if (isCancelled) {
                      dotClass = "bg-slate-500/50";
                      labelStatus = "Cancelled";
                    }

                    return (
                      <motion.span
                        key={session._id || sIdx}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: sIdx * 0.05 }}
                        title={`${session.title || "Mentorship Session"} (${labelStatus})`}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full cursor-pointer hover:scale-125 transition-transform ${dotClass}`}
                      />
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Session Details Drawer / Popover */}
      <AnimatePresence>
        {selectedDaySessions !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 sm:p-5 rounded-2xl bg-glass-card border border-glass-border shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between border-b border-glass-border pb-3">
              <div className="flex items-center space-x-2">
                <CalendarIcon size={16} className="text-purple-400" />
                <h4 className="text-xs sm:text-sm font-extrabold text-text-title font-mono uppercase tracking-wider">
                  {selectedDayLabel}
                </h4>
              </div>
              <button
                onClick={() => setSelectedDaySessions(null)}
                className="p-1 rounded-lg text-text-muted hover:text-text-title hover:bg-glass-border/30 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {selectedDaySessions.length === 0 ? (
              <p className="text-xs text-text-muted italic py-2">No sessions scheduled for this day.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {selectedDaySessions.map((session) => {
                  const isCompleted = session.status === "completed";
                  const isCancelled = session.status === "cancelled" || session.status === "rejected";

                  const scheduledTime = session.scheduledAt
                    ? new Date(session.scheduledAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "";

                  return (
                    <div
                      key={session._id}
                      className={`p-3.5 rounded-xl border space-y-2 text-left ${
                        isCompleted
                          ? "bg-rose-500/5 border-rose-500/30"
                          : isCancelled
                          ? "bg-bg-darker border-glass-border opacity-70"
                          : "bg-emerald-500/5 border-emerald-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            isCompleted
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                              : isCancelled
                              ? "bg-slate-500/10 text-slate-400 border border-slate-500/30"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isCompleted ? "bg-rose-400" : isCancelled ? "bg-slate-400" : "bg-emerald-400"
                            }`}
                          />
                          <span>{isCompleted ? "Completed" : isCancelled ? "Cancelled" : "Upcoming"}</span>
                        </span>

                        <span className="text-[11px] font-mono text-text-muted flex items-center gap-1 font-bold">
                          <Clock size={12} />
                          <span>{scheduledTime}</span>
                        </span>
                      </div>

                      <div>
                        <h5 className="text-xs font-bold text-text-title line-clamp-1">{session.title}</h5>
                        {session.topic && (
                          <p className="text-[11px] text-text-muted line-clamp-1 font-medium">{session.topic}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-text-muted border-t border-glass-border/40 pt-2">
                        <span>Duration: {session.duration || 30} mins</span>
                        <span>Price: {session.price ? `₹${session.price}` : "Free"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpertSessionTimeline;
