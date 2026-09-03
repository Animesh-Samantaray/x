import React, { useState, useRef } from "react";
import { Send, Paperclip, X, Smile } from "lucide-react";
import StickerPicker from "./StickerPicker";

const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const fileInputRef = useRef(null);
  const stickerButtonRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!message.trim() && !selectedFile) || disabled) return;

    onSendMessage(message, selectedFile);
    setMessage("");
    setSelectedFile(null);
    setShowStickerPicker(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectSticker = (stickerEmoji) => {
    if (disabled) return;
    // Direct sticker sending
    onSendMessage(stickerEmoji, null);
    setShowStickerPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="p-3 border-t border-slate-800 bg-slate-900/90 relative shrink-0">
      {/* File Preview */}
      {selectedFile && (
        <div className="mb-2 p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="text-lg">📎</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">
                {selectedFile.name}
              </p>
              <p className="text-[10px] text-slate-400">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* WhatsApp-Style Sticker Picker */}
      <StickerPicker
        isOpen={showStickerPicker}
        onClose={() => setShowStickerPicker(false)}
        onSelectSticker={handleSelectSticker}
        anchorRef={stickerButtonRef}
      />

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition shrink-0 cursor-pointer"
          disabled={disabled}
          title="Attach file"
        >
          <Paperclip size={17} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {/* Textarea Input */}
        <div className="flex-1 relative flex items-center">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 transition resize-none pr-9 min-h-[40px] max-h-28"
          />

          {/* Sticker Button */}
          <button
            ref={stickerButtonRef}
            type="button"
            onClick={() => setShowStickerPicker((prev) => !prev)}
            className={`absolute right-2.5 transition p-1 cursor-pointer rounded-lg ${
              showStickerPicker
                ? "text-sky-400 bg-sky-500/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
            title="Stickers"
          >
            <Smile size={17} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || (!message.trim() && !selectedFile)}
          className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 cursor-pointer shadow-sm"
          title="Send message"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
