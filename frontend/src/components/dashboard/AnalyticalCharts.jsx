import React from "react";

// 1. DUAL CURVE LINE GRAPH (Revenue / Analytics Trend)
export const DualCurveLineChart = ({ dataPoints1 = [20, 45, 28, 60, 35, 70, 50], dataPoints2 = [10, 25, 40, 30, 55, 40, 65], height = 140, color1 = "#3b82f6", color2 = "#10b981" }) => {
  const pointsToPath = (pts) => {
    const width = 300;
    const step = width / (pts.length - 1);
    return pts.reduce((acc, pt, idx) => {
      const x = idx * step;
      const y = height - (pt / 100) * height;
      if (idx === 0) return `M ${x} ${y}`;
      const prevX = (idx - 1) * step;
      const prevY = height - (pts[idx - 1] / 100) * height;
      const cp1X = prevX + step / 2;
      const cp1Y = prevY;
      const cp2X = prevX + step / 2;
      const cp2Y = y;
      return `${acc} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${x} ${y}`;
    }, "");
  };

  const path1 = pointsToPath(dataPoints1);
  const path2 = pointsToPath(dataPoints2);

  return (
    <div className="w-full relative" style={{ height }}>
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 300 ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color1} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color1} stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color2} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color2} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((ratio, i) => (
          <line key={i} x1="0" y1={height * ratio} x2="300" y2={height * ratio} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
        ))}

        <path d={`${path1} L 300 ${height} L 0 ${height} Z`} fill="url(#grad1)" />
        <path d={`${path2} L 300 ${height} L 0 ${height} Z`} fill="url(#grad2)" />

        <path d={path1} fill="none" stroke={color1} strokeWidth="2.5" strokeLinecap="round" />
        <path d={path2} fill="none" stroke={color2} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// 2. MULTI-CURVE DASHED GRAPH (Client/Learner Status)
export const MultiCurveDottedChart = ({ height = 150 }) => {
  return (
    <div className="w-full relative" style={{ height }}>
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 400 ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid horizontal markers */}
        {[20, 50, 80, 110, 140].map((y, i) => (
          <line key={i} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
        ))}

        {/* Curved dotted line 1 (Rose/Pink) */}
        <path
          d="M 0 120 C 50 110, 100 60, 150 40 C 200 20, 250 80, 300 110 C 350 130, 380 90, 400 80"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="2.5"
          strokeDasharray="4 4"
        />

        {/* Curved line 2 (Purple) */}
        <path
          d="M 0 100 C 60 40, 120 70, 180 30 C 240 10, 300 60, 360 40 C 380 35, 390 50, 400 60"
          fill="none"
          stroke="#a855f7"
          strokeWidth="2.5"
        />

        {/* Curved line 3 (Cyan) */}
        <path
          d="M 0 130 C 70 120, 130 90, 190 70 C 250 50, 310 100, 370 80 C 390 70, 395 75, 400 70"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2.5"
          strokeDasharray="6 3"
        />
      </svg>
    </div>
  );
};

// 3. DONUT SEGMENT CHART (Breakdown Visualization)
export const DonutBreakdownChart = ({ segments = [
  { label: "Done / Published", value: 45, color: "#10b981" },
  { label: "In Progress", value: 25, color: "#3b82f6" },
  { label: "Drafts / Pending", value: 20, color: "#a855f7" },
  { label: "Archived", value: 10, color: "#f43f5e" },
] }) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 100;
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-32 h-32 shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="-1 -1 2 2">
          {segments.map((slice, i) => {
            const startPercent = cumulativePercent;
            const slicePercent = slice.value / total;
            cumulativePercent += slicePercent;
            const endPercent = cumulativePercent;

            const [startX, startY] = getCoordinatesForPercent(startPercent);
            const [endX, endY] = getCoordinatesForPercent(endPercent);
            const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

            const pathData = [
              `M ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L 0 0`,
            ].join(" ");

            return <path key={i} d={pathData} fill={slice.color} opacity={0.85} className="hover:opacity-100 transition" />;
          })}
          {/* Center cutout circle */}
          <circle cx="0" cy="0" r="0.62" fill="#0d0e1a" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-sm font-black text-text-title font-mono">{total}</span>
          <span className="text-[8px] text-text-muted uppercase font-mono font-bold">Total</span>
        </div>
      </div>

      <div className="space-y-1.5 flex-1 w-full text-xs font-mono">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center justify-between p-1.5 rounded bg-bg-darker/60 border border-glass-border/30">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-text-main font-semibold truncate">{s.label}</span>
            </div>
            <span className="font-extrabold text-text-title">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. SEMI-CIRCLE ARC GAUGE (Positive Self Talk / Mastery Gauge)
export const SemiCircleArcGauge = ({ percentage = 72, title = "Mastery Score", label = "High Efficiency" }) => {
  const radius = 70;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Calculate ball indicator location on half circle arc (180deg -> 0deg)
  const angleRad = Math.PI * (1 - percentage / 100);
  const cx = 90 + radius * Math.cos(angleRad);
  const cy = 85 - radius * Math.sin(angleRad);

  return (
    <div className="flex flex-col items-center justify-center space-y-2 py-2">
      <div className="relative w-48 h-28 overflow-hidden flex items-end justify-center">
        <svg className="w-48 h-28 overflow-visible" viewBox="0 0 180 95">
          <defs>
            <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Track Arc */}
          <path
            d="M 20 85 A 70 70 0 0 1 160 85"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value Arc */}
          <path
            d="M 20 85 A 70 70 0 0 1 160 85"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Indicator Dot */}
          <circle cx={cx} cy={cy} r="6" fill="#ffffff" stroke="#7c3aed" strokeWidth="3" className="shadow-lg" />
        </svg>

        <div className="absolute bottom-1 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-text-title font-mono tracking-tight">{percentage}%</span>
          <span className="text-[9px] text-cyan-400 font-extrabold uppercase font-mono tracking-wider">{label}</span>
        </div>
      </div>
      <span className="text-xs font-bold text-text-muted font-display uppercase tracking-wider">{title}</span>
    </div>
  );
};

// 5. LOLLIPOP BAR CHART (Decisions Priority / Grit)
export const LollipopBarChart = ({ bars = [
  { label: "Mon", value: 70, color: "#a855f7" },
  { label: "Tue", value: 90, color: "#ec4899" },
  { label: "Wed", value: 50, color: "#3b82f6" },
  { label: "Thu", value: 35, color: "#06b6d4" },
  { label: "Fri", value: 60, color: "#a855f7" },
  { label: "Sat", value: 45, color: "#10b981" },
  { label: "Sun", value: 80, color: "#f59e0b" },
], height = 120 }) => {
  return (
    <div className="w-full flex items-end justify-between gap-2 px-2" style={{ height }}>
      {bars.map((bar, i) => {
        const barH = (bar.value / 100) * (height - 24);

        return (
          <div key={i} className="flex flex-col items-center flex-1 space-y-1">
            <div className="w-full flex flex-col items-center relative" style={{ height: height - 20 }}>
              {/* Lollipop Stem */}
              <div
                className="w-1 rounded-full absolute bottom-0 transition-all duration-500"
                style={{ height: barH, backgroundColor: bar.color, opacity: 0.6 }}
              />
              {/* Lollipop Ball Top */}
              <div
                className="w-3.5 h-3.5 rounded-full absolute transition-all duration-500 shadow-md border-2 border-bg-dark font-bold"
                style={{ bottom: barH - 7, backgroundColor: bar.color }}
              />
            </div>
            <span className="text-[9px] font-mono font-semibold text-text-muted">{bar.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// 6. SPARKLINE GRAPH CARD (Coach Ability / Overall HITE Sparklines)
export const SparklineMiniCard = ({ title = "Coach Ability", value = "Brilliant", badge = "+3.2%", points = [20, 35, 25, 80, 50, 70, 40], color = "#f59e0b" }) => {
  const pointsToPath = (pts) => {
    const width = 120;
    const height = 40;
    const step = width / (pts.length - 1);
    return pts.reduce((acc, pt, idx) => {
      const x = idx * step;
      const y = height - (pt / 100) * height;
      if (idx === 0) return `M ${x} ${y}`;
      return `${acc} L ${x} ${y}`;
    }, "");
  };

  const path = pointsToPath(points);

  return (
    <div className="p-4 rounded-2xl bg-slate-900/80 border border-glass-border space-y-2 text-left flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">{title}</span>
        {badge && (
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {badge}
          </span>
        )}
      </div>

      <div className="text-lg font-black font-mono text-text-title leading-none">{value}</div>

      <div className="w-full h-10 pt-1">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 120 40">
          <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

// 7. HORIZONTAL GOAL PROGRESS BARS (Goals 2026 Panel)
export const HorizontalGoalsList = ({ goals = [
  { label: "4 Masterclasses Completed", percent: 90, color: "bg-cyan-500" },
  { label: "MRR Target Reach $5,000", percent: 53, color: "bg-purple-500" },
  { label: "Build Technical Portfolio", percent: 36, color: "bg-indigo-500" },
  { label: "Mentorship Hours Milestone", percent: 72, color: "bg-pink-500" },
] }) => {
  return (
    <div className="space-y-3 font-mono text-xs">
      {goals.map((g, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-text-main font-semibold">{g.label}</span>
            <span className="font-extrabold text-text-title">{g.percent}%</span>
          </div>
          <div className="w-full h-2.5 bg-bg-darker rounded-full overflow-hidden border border-glass-border/40 p-0.5">
            <div className={`h-full rounded-full transition-all duration-700 ease-out ${g.color}`} style={{ width: `${g.percent}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};
