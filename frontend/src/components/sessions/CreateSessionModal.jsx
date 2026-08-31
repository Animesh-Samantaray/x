import React, { useState } from "react";
import SpotlightCard from "../SpotlightCard";
import Button from "../Button";
import DateTimePicker from "./DateTimePicker";
import { createSession } from "../../services/sessionService";
import { X, Video, AlertCircle, CheckCircle2, Link as LinkIcon, Users } from "lucide-react";

const DURATION_OPTIONS = [
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "60 minutes (1 hour)", value: 60 },
  { label: "90 minutes (1.5 hours)", value: 90 },
  { label: "120 minutes (2 hours)", value: 120 },
  { label: "150 minutes (2.5 hours)", value: 150 },
  { label: "180 minutes (3 hours)", value: 180 },
  { label: "210 minutes (3.5 hours)", value: 210 },
  { label: "240 minutes (4 hours)", value: 240 },
];

const CreateSessionModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState(60);
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [price, setPrice] = useState(0);
  const [meetingUrl, setMeetingUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Session title is required.");
      return;
    }
    if (!topic.trim()) {
      setError("Topic/category is required.");
      return;
    }
    if (!scheduledAt) {
      setError("Please select a valid scheduled date and time.");
      return;
    }
    if (new Date(scheduledAt) <= new Date()) {
      setError("Scheduled time must be in the future.");
      return;
    }
    if (maxParticipants < 1) {
      setError("Max participants must be at least 1.");
      return;
    }
    if (price < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (meetingUrl.trim()) {
      try {
        new URL(meetingUrl);
      } catch (_) {
        setError("Please enter a valid Meeting URL (e.g. https://meet.google.com/abc-defg-hij)");
        return;
      }
    }

    try {
      setSubmitting(true);
      const res = await createSession({
        title: title.trim(),
        topic: topic.trim(),
        message: message.trim(),
        scheduledAt,
        duration: Number(duration),
        maxParticipants: Number(maxParticipants),
        price: Number(price),
        meetingUrl: meetingUrl.trim(),
      });

      if (res && res.success) {
        onSuccess(res.message || "Mentorship session created successfully!");
        onClose();
      } else {
        setError(res.message || "Failed to create session.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create session.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <SpotlightCard
        className="w-full max-w-xl bg-bg-panel border border-glass-border/80 p-6 rounded-2xl text-left shadow-2xl space-y-5 my-8"
        glowColor="rgba(168, 85, 247, 0.15)"
      >
        <div className="flex items-center justify-between border-b border-glass-border/40 pb-4">
          <div>
            <h2 className="text-sm font-extrabold text-text-title uppercase tracking-widest flex items-center gap-2">
              <Video size={16} className="text-accent-purple" /> Create Mentorship Session
            </h2>
            <p className="text-[11px] text-text-muted mt-0.5 font-semibold">
              Schedule a 1-on-1 or group live mentorship call for learners.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-text-muted hover:text-rose-400 transition cursor-pointer p-1 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-text-muted uppercase tracking-wider block text-[10px]">
              Session Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Full Stack React & Node.js Mentorship"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full form-input text-xs rounded-xl p-2.5 bg-bg-dark text-text-title border border-glass-border focus:border-accent-purple/50 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-text-muted uppercase tracking-wider block text-[10px]">
              Topic / Domain <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. MERN Stack Architecture, System Design"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full form-input text-xs rounded-xl p-2.5 bg-bg-dark text-text-title border border-glass-border focus:border-accent-purple/50 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-text-muted uppercase tracking-wider block text-[10px]">
              Overview / Agenda (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Describe what learners will gain from this session..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full form-input text-xs rounded-xl p-2.5 bg-bg-dark text-text-title border border-glass-border focus:border-accent-purple/50 focus:outline-none leading-relaxed"
            />
          </div>

          <DateTimePicker
            value={scheduledAt}
            onChange={(isoStr) => setScheduledAt(isoStr)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-text-muted uppercase tracking-wider block text-[10px]">
                Duration <span className="text-rose-400">*</span>
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full form-input text-xs rounded-xl p-2.5 bg-bg-dark text-text-title border border-glass-border focus:border-accent-purple/50 cursor-pointer"
              >
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-text-muted uppercase tracking-wider block text-[10px]">
                Max Participants <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="500"
                  placeholder="10"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  className="w-full form-input text-xs rounded-xl pl-8 pr-3 py-2.5 bg-bg-dark text-text-title border border-glass-border focus:border-accent-purple/50"
                  required
                />
                <Users size={14} className="absolute left-2.5 top-3 text-text-muted" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-text-muted uppercase tracking-wider block text-[10px]">
                Price (₹) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  placeholder="0 for Free"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full form-input text-xs rounded-xl pl-7 pr-3 py-2.5 bg-bg-dark text-text-title border border-glass-border focus:border-accent-purple/50"
                  required
                />
                <span className="absolute left-2.5 top-2.5 text-text-muted font-bold text-xs">₹</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-text-muted uppercase tracking-wider block text-[10px]">
              Meeting URL <span className="text-text-muted font-normal">(Visible only to accepted learners)</span>
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://meet.google.com/abc-defg-hij"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                className="w-full form-input text-xs rounded-xl pl-8 pr-3 py-2.5 bg-bg-dark text-text-title border border-glass-border focus:border-accent-purple/50"
              />
              <LinkIcon size={14} className="absolute left-2.5 top-3 text-text-muted" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-glass-border/40">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
              className="text-xs py-2 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={submitting}
              className="text-xs py-2 px-5 bg-gradient-to-r from-accent-purple to-accent-indigo shadow-lg flex items-center gap-1.5"
            >
              <CheckCircle2 size={14} /> Publish Session
            </Button>
          </div>
        </form>
      </SpotlightCard>
    </div>
  );
};

export default CreateSessionModal;
