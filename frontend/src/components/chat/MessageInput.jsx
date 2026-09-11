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
    <div className="p-3 border-t border-glass-border bg-glass-card relative shrink-0">
      {/* File Preview */}
      {selectedFile && (
        <div className="mb-2 p-2.5 bg-bg-darker border border-glass-border rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="text-lg">📎</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-title truncate">
                {selectedFile.name}
              </p>
              <p className="text-[10px] text-text-muted">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="p-1 rounded-lg hover:bg-glass-card text-text-muted hover:text-text-title transition cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
      )}


      <StickerPicker
        isOpen={showStickerPicker}
        onClose={() => setShowStickerPicker(false)}
        onSelectSticker={handleSelectSticker}
        anchorRef={stickerButtonRef}
      />

     
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
      
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl border border-glass-border hover:bg-bg-darker text-text-muted hover:text-text-title transition shrink-0 cursor-pointer"
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

        <div className="flex-1 relative flex items-center group">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            rows={2}
            className="w-full px-4 py-3 bg-bg-darker/90 border border-glass-border rounded-2xl text-sm text-text-title placeholder:text-text-muted/70 focus:outline-none focus:border-sky-500/70 focus:ring-2 focus:ring-sky-500/20 focus:bg-bg-darker transition-all duration-300 resize-none pr-11 min-h-[52px] max-h-36 shadow-inner"
          />
          <button
            ref={stickerButtonRef}
            type="button"
            onClick={() => setShowStickerPicker((prev) => !prev)}
            className={`absolute right-3 top-3.5 transition-all duration-200 p-1.5 cursor-pointer rounded-xl ${
              showStickerPicker
                ? "text-sky-400 bg-sky-500/20 scale-110"
                : "text-text-muted hover:text-sky-400 hover:bg-white/5 active:scale-95"
            }`}
            title="Stickers"
          >
            <Smile size={20} />
          </button>
        </div>

        <button
          type="submit"
          disabled={disabled || (!message.trim() && !selectedFile)}
          className="p-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shrink-0 cursor-pointer shadow-md hover:shadow-sky-500/25 active:scale-95 flex items-center justify-center"
          title="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
