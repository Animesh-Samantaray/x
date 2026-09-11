import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Trash2,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Globe,
  Loader2,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { askAIQuestion } from "../../services/aiService";
import toast from "react-hot-toast";

const FormattedMessage = ({ content }) => {
  if (!content) return null;

  const lines = content.split("\n");

  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1.5" />;

        if (trimmed.startsWith("#")) {
          const headerText = trimmed.replace(/^#+\s*/, "");
          return (
            <h5 key={idx} className="font-bold text-text-title text-xs tracking-wide border-b border-glass-border/30 pb-0.5 mt-2">
              {formatInline(headerText)}
            </h5>
          );
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const bulletText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-indigo-400 font-bold text-sm leading-none mt-0.5">•</span>
              <span className="flex-1">{formatInline(bulletText)}</span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="font-mono text-indigo-400 font-bold text-xs shrink-0">{numMatch[1]}.</span>
              <span className="flex-1">{formatInline(numMatch[2])}</span>
            </div>
          );
        }

        return <p key={idx}>{formatInline(trimmed)}</p>;
      })}
    </div>
  );
};

const formatInline = (text) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-text-title font-display">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="bg-indigo-500/15 text-indigo-300 font-mono px-1 py-0.5 rounded text-[11px] border border-indigo-500/20">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

const SUGGESTED_PROMPTS = [
  "What courses are available on CKM?",
  "How can I book a mentorship session?",
  "How do I become a course Creator or Expert?",
  "Where can I check my payments & receipts?",
];

const BUTTON_SIZE = 56; // 56px width/height of the launcher

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [speechLanguage, setSpeechLanguage] = useState("en-IN");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgIndex, setSpeakingMsgIndex] = useState(null);

  // Position state (bottom-right offset or absolute screen coordinates)
  // Store position as { x, y } absolute coordinates on viewport
  const [position, setPosition] = useState(() => {
    try {
      const saved = sessionStorage.getItem("ckm_chatbot_pos");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          return parsed;
        }
      }
    } catch (e) {}
    // Default initial position (bottom-right: 24px margin)
    const initialX = Math.max(10, window.innerWidth - BUTTON_SIZE - 24);
    const initialY = Math.max(10, window.innerHeight - BUTTON_SIZE - 24);
    return { x: initialX, y: initialY };
  });

  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const elementStartPosRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Clamp position to viewport bounds on resize
  const clampPosition = (pos) => {
    const maxX = Math.max(0, window.innerWidth - BUTTON_SIZE);
    const maxY = Math.max(0, window.innerHeight - BUTTON_SIZE);
    return {
      x: Math.min(Math.max(0, pos.x), maxX),
      y: Math.min(Math.max(0, pos.y), maxY),
    };
  };

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const clamped = clampPosition(prev);
        try {
          sessionStorage.setItem("ckm_chatbot_pos", JSON.stringify(clamped));
        } catch (e) {}
        return clamped;
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pointer Drag Handlers (Desktop Mouse + Mobile Touch)
  const handlePointerDown = (e) => {
    // Only drag on primary pointer (left click or touch)
    if (e.button !== undefined && e.button !== 0) return;

    const pointerX = e.clientX;
    const pointerY = e.clientY;

    dragStartPosRef.current = { x: pointerX, y: pointerY };
    elementStartPosRef.current = { ...position };
    hasDraggedRef.current = false;
    isDraggingRef.current = true;

    // Capture pointer so drag remains smooth outside button bounds
    if (e.target.setPointerCapture) {
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - dragStartPosRef.current.x;
    const dy = e.clientY - dragStartPosRef.current.y;
    const dist = Math.hypot(dx, dy);

    // Movement threshold check (~6px) to distinguish click vs drag
    if (dist > 6) {
      hasDraggedRef.current = true;
      if (!isDragging) setIsDragging(true);
    }

    if (hasDraggedRef.current) {
      const newPos = clampPosition({
        x: elementStartPosRef.current.x + dx,
        y: elementStartPosRef.current.y + dy,
      });

      setPosition(newPos);
    }
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    if (e.target.releasePointerCapture) {
      try {
        e.target.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    if (hasDraggedRef.current) {
      // Save position to sessionStorage on drop
      try {
        sessionStorage.setItem("ckm_chatbot_pos", JSON.stringify(position));
      } catch (err) {}
    } else {
      // It was a click/tap, toggle open state!
      setIsOpen((prev) => !prev);
    }
  };

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste! 🙏 I am KnowledgeBot, your AI assistant for the Collaborative Knowledge Marketplace. Ask me anything about courses, 1-on-1 mentorship, resources, or account settings!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = speechLanguage;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputQuery(transcript);
        };

        recognition.onerror = (event) => {
          console.warn("Speech recognition notice:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed") {
            toast.error("Microphone access blocked. Please allow mic permission in your browser.");
          } else if (event.error !== "no-speech") {
            toast.error(`Voice input error: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.error("Failed to initialize speech recognition:", err);
      }
    }
  }, [speechLanguage]);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your current browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = speechLanguage;
          recognitionRef.current.start();
          const langLabel = speechLanguage === "en-IN" ? "Indian English (en-IN)" : "Hindi (hi-IN)";
          toast.success(`Listening in ${langLabel}... Speak now.`);
        }
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        setIsListening(false);
      }
    }
  };

  const speakText = (text, index) => {
    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported in your browser.");
      return;
    }

    if (isSpeaking && speakingMsgIndex === index) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMsgIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#`]/g, ""));
    utterance.lang = speechLanguage;

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMsgIndex(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMsgIndex(null);
    };

    setIsSpeaking(true);
    setSpeakingMsgIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query || !query.trim() || loading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessages = [
      ...messages,
      { sender: "user", text: query.trim(), time: userTime },
    ];

    setMessages(newMessages);
    setInputQuery("");
    setLoading(true);

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    try {
      const res = await askAIQuestion(query.trim());
      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      if (res && res.success && res.answer) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: res.answer, time: botTime },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "I apologize, but I could not generate an answer right now. Please try again.",
            time: botTime,
            isError: true,
          },
        ]);
      }
    } catch (error) {
      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const errorMsg = error?.message || "Failed to reach AI service. Please check your connection.";
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: errorMsg, time: botTime, isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setMessages([
      {
        sender: "bot",
        text: "Chat cleared! How else can I assist you with the Collaborative Knowledge Marketplace?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    toast.success("Chat history cleared.");
  };

  // Smart popup positioning relative to launcher position
  const getPanelPositionStyles = () => {
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;

    const isNearRight = position.x > windowW / 2;
    const isNearBottom = position.y > windowH / 2;

    const styles = {};

    if (isNearRight) {
      styles.right = `${Math.max(16, windowW - position.x - BUTTON_SIZE)}px`;
    } else {
      styles.left = `${Math.max(16, position.x)}px`;
    }

    if (isNearBottom) {
      styles.bottom = `${Math.max(16, windowH - position.y + 12)}px`;
    } else {
      styles.top = `${Math.max(16, position.y + BUTTON_SIZE + 12)}px`;
    }

    return styles;
  };

  return (
    <>
      {/* Draggable Launcher Button */}
      <div
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
          touchAction: "none",
        }}
        className="z-50 select-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              type="button"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isDragging ? 1.08 : 1,
                opacity: 1,
                boxShadow: isDragging
                  ? "0 20px 35px -5px rgba(99, 102, 241, 0.5)"
                  : "0 10px 25px -5px rgba(99, 102, 241, 0.3)",
              }}
              exit={{ scale: 0, opacity: 0 }}
              aria-label="Open AI assistant"
              className="group relative flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white border border-white/20 overflow-hidden transition-shadow duration-200"
            >
              <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping opacity-25 pointer-events-none" />
              <Sparkles className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300 pointer-events-none" />
              <span className="absolute top-2 right-2 h-3 w-3 rounded-full bg-emerald-400 border-2 border-bg-panel shadow-sm pointer-events-none" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Expanded Chatbot Panel with Smart Viewport Docking */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={getPanelPositionStyles()}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
            className="fixed z-50 w-[calc(100vw-32px)] sm:w-[410px] h-[82vh] sm:h-[580px] max-h-[640px] rounded-3xl bg-bg-panel/95 backdrop-blur-2xl border border-glass-border shadow-2xl flex flex-col overflow-hidden text-text-main font-sans"
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-bg-panel/90 border-b border-glass-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                    <Bot size={20} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-bg-panel" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-black text-text-title font-display uppercase tracking-wide">
                      KnowledgeBot AI
                    </h3>
                    <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/15 text-indigo-400 text-[9px] font-mono font-bold border border-indigo-500/20">
                      Grok 3.6
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted font-medium">
                    Collaborative Knowledge Marketplace
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const nextLang = speechLanguage === "en-IN" ? "hi-IN" : "en-IN";
                    setSpeechLanguage(nextLang);
                    toast.success(`Voice language set to ${nextLang === "en-IN" ? "Indian English" : "Hindi (हिंदी)"}`);
                  }}
                  className="px-2 py-1 rounded-xl bg-glass-card border border-glass-border text-[10px] font-mono font-bold text-indigo-400 hover:bg-glass-border transition cursor-pointer flex items-center gap-1"
                  title="Switch Voice Language"
                >
                  <Globe size={11} />
                  {speechLanguage === "en-IN" ? "EN-IN" : "HI-IN"}
                </button>

                <button
                  onClick={clearChat}
                  className="p-2 rounded-xl text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                  title="Clear chat history"
                >
                  <Trash2 size={15} />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-text-muted hover:text-text-title hover:bg-glass-border transition cursor-pointer"
                  title="Close Assistant"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-glass-border">
              {messages.map((msg, index) => {
                const isUser = msg.sender === "user";
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`h-7 w-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isUser
                          ? "bg-indigo-600 text-white"
                          : "bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white shadow-sm"
                      }`}
                    >
                      {isUser ? <User size={14} /> : <Bot size={14} />}
                    </div>

                    <div className="group relative max-w-[82%] space-y-1">
                      <div
                        className={`p-3 rounded-2xl shadow-sm text-xs ${
                          isUser
                            ? "bg-indigo-600 text-white rounded-tr-none font-medium"
                            : msg.isError
                            ? "bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-tl-none"
                            : "bg-bg-darker/90 text-text-main border border-glass-border/70 rounded-tl-none"
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        ) : (
                          <FormattedMessage content={msg.text} />
                        )}
                      </div>

                      <div
                        className={`flex items-center gap-2 px-1 text-[9px] text-text-muted ${
                          isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span>{msg.time}</span>
                        {!isUser && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleCopy(msg.text, index)}
                              className="p-1 rounded hover:bg-glass-border text-text-muted hover:text-text-title transition cursor-pointer"
                              title="Copy response"
                            >
                              {copiedIndex === index ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            </button>
                            <button
                              onClick={() => speakText(msg.text, index)}
                              className={`p-1 rounded hover:bg-glass-border transition cursor-pointer ${
                                isSpeaking && speakingMsgIndex === index ? "text-indigo-400 animate-pulse" : "text-text-muted hover:text-text-title"
                              }`}
                              title="Read Aloud"
                            >
                              {isSpeaking && speakingMsgIndex === index ? <VolumeX size={11} /> : <Volume2 size={11} />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white flex items-center justify-center shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="p-3 rounded-2xl bg-bg-darker/90 border border-glass-border/70 rounded-tl-none flex items-center gap-2 text-xs text-indigo-400 font-medium">
                    <Loader2 size={14} className="animate-spin text-indigo-400" />
                    <span>KnowledgeBot is thinking...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 2 && !loading && (
              <div className="px-4 pb-2 pt-1 border-t border-glass-border/30 bg-bg-panel/40">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1 font-display">
                  <HelpCircle size={10} className="text-indigo-400" /> Suggested Topics
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-[11px] px-2.5 py-1 rounded-xl bg-glass-card hover:bg-indigo-600/15 border border-glass-border hover:border-indigo-500/30 text-text-muted hover:text-indigo-300 transition cursor-pointer text-left font-medium"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isListening && (
              <div className="px-4 py-1.5 bg-indigo-600/20 border-t border-indigo-500/30 flex items-center justify-between text-xs text-indigo-300 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-mono text-[11px]">
                    Listening ({speechLanguage === "en-IN" ? "Indian English" : "Hindi"})... Speak now
                  </span>
                </div>
                <button
                  onClick={toggleListening}
                  className="text-[10px] underline hover:text-white font-bold cursor-pointer"
                >
                  Stop
                </button>
              </div>
            )}

            {/* Input Form */}
            <div className="p-3 bg-bg-panel border-t border-glass-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 bg-bg-darker border border-glass-border rounded-2xl px-3 py-1.5 focus-within:border-indigo-500/50 transition-colors"
              >
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    isListening
                      ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-bounce"
                      : "text-text-muted hover:text-indigo-400 hover:bg-glass-border"
                  }`}
                  title={`Voice Input (${speechLanguage === "en-IN" ? "Indian English" : "Hindi"})`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={
                    isListening
                      ? "Listening to voice input..."
                      : "Ask KnowledgeBot anything..."
                  }
                  disabled={loading}
                  className="flex-1 bg-transparent text-xs text-text-title placeholder:text-text-muted outline-none py-1.5"
                />

                <button
                  type="submit"
                  disabled={!inputQuery.trim() || loading}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    inputQuery.trim() && !loading
                      ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-500"
                      : "text-text-muted opacity-40 cursor-not-allowed"
                  }`}
                  title="Send message"
                >
                  <Send size={15} />
                </button>
              </form>

              <div className="flex items-center justify-between px-1 mt-1.5 text-[9px] text-text-muted">
                <span>Supports Indian English (en-IN) & Hindi (hi-IN)</span>
                <span>Powered by Groq AI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot;
