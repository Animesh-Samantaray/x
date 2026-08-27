import React from "react";
import { FileText, Video, Image, ExternalLink, File, Play } from "lucide-react";

/**
 * Extracts YouTube video ID from URL
 * Supports:
 * - https://www.youtube.com/watch?v=ID
 * - https://youtu.be/ID
 * - https://www.youtube.com/embed/ID
 */
export const getYouTubeEmbedUrl = (url) => {
  if (!url || typeof url !== "string") return null;

  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
  } catch (err) {
    console.error("Error parsing YouTube URL:", err);
  }
  return null;
};

/**
 * Renders attachment preview icon based on type / extension
 */
export const getAttachmentIcon = (type, url) => {
  switch (type) {
    case "video":
      return <Video size={16} className="text-rose-400 shrink-0" />;
    case "image":
      return <Image size={16} className="text-emerald-400 shrink-0" />;
    case "document":
      return <FileText size={16} className="text-accent-cyan shrink-0" />;
    case "link":
      return <ExternalLink size={16} className="text-accent-purple shrink-0" />;
    default:
      if (url && (url.includes("youtube.com") || url.includes("youtu.be"))) {
        return <Play size={16} className="text-rose-500 shrink-0" />;
      }
      return <File size={16} className="text-text-muted shrink-0" />;
  }
};

const AttachmentViewer = ({ attachment }) => {
  if (!attachment || !attachment.url) {
    return (
      <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-xl text-xs text-rose-400">
        Invalid attachment data.
      </div>
    );
  }

  const { title, url, type } = attachment;
  const youtubeEmbed = getYouTubeEmbedUrl(url);

  // 1. YouTube Player Embed
  if (youtubeEmbed) {
    return (
      <div className="space-y-2">
        {title && <h4 className="text-xs font-bold text-text-title flex items-center gap-1.5"><Play size={14} className="text-rose-500" /> {title}</h4>}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-glass-border bg-black">
          <iframe
            src={youtubeEmbed}
            title={title || "YouTube video"}
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // 2. HTML5 Video Player
  if (type === "video" || (url.match(/\.(mp4|webm|ogg|mov)($|\?)/i))) {
    return (
      <div className="space-y-2">
        {title && <h4 className="text-xs font-bold text-text-title flex items-center gap-1.5"><Video size={14} className="text-rose-400" /> {title}</h4>}
        <div className="rounded-xl overflow-hidden border border-glass-border bg-black">
          <video controls className="w-full max-h-[480px] object-contain">
            <source src={url} />
            Your browser does not support HTML5 video playback.
          </video>
        </div>
      </div>
    );
  }

  // 3. Image Viewer
  if (type === "image" || (url.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i))) {
    return (
      <div className="space-y-2">
        {title && <h4 className="text-xs font-bold text-text-title flex items-center gap-1.5"><Image size={14} className="text-emerald-400" /> {title}</h4>}
        <div className="rounded-xl overflow-hidden border border-glass-border bg-bg-dark p-2 flex justify-center">
          <img src={url} alt={title || "Attachment image"} className="max-h-96 object-contain rounded-lg" />
        </div>
      </div>
    );
  }

  // 4. PDF / Document Embed
  if (type === "document" && url.toLowerCase().includes(".pdf")) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {title && <h4 className="text-xs font-bold text-text-title flex items-center gap-1.5"><FileText size={14} className="text-accent-cyan" /> {title}</h4>}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-accent-cyan hover:underline flex items-center gap-1 font-bold"
          >
            Open in new tab <ExternalLink size={10} />
          </a>
        </div>
        <div className="rounded-xl overflow-hidden border border-glass-border bg-bg-dark h-[500px]">
          <iframe src={url} title={title || "Document PDF"} className="w-full h-full border-0" />
        </div>
      </div>
    );
  }

  // 5. External Link / General Document / Fallback Link
  return (
    <div className="p-4 rounded-xl border border-glass-border bg-glass-card space-y-3">
      <div className="flex items-center gap-3">
        {getAttachmentIcon(type, url)}
        <div className="overflow-hidden">
          <h4 className="text-xs font-bold text-text-title truncate">{title || "Attachment Resource"}</h4>
          <p className="text-[10px] text-text-muted truncate">{url}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-accent-purple/15 text-accent-purple border border-accent-purple/30 hover:bg-accent-purple/25 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5"
        >
          <span>Open Resource</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};

export default AttachmentViewer;
