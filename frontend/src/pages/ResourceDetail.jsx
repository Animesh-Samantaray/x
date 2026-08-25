import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResourceById } from "../services/resourceService";
import api from "../services/api";
import SpotlightCard from "../components/SpotlightCard";
import Button from "../components/Button";
import { ArrowLeft, BookOpen, ExternalLink, Calendar, User, Folder, Tag, FileText, Link as LinkIcon, AlertCircle } from "lucide-react";

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingDocId, setDownloadingDocId] = useState(null);

  const handleOpenDocument = async (docId, docName, docMimeType) => {
    try {
      setDownloadingDocId(docId);
      const response = await api.get(`/resource/${id}/document/${docId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: docMimeType || "application/octet-stream" });
      const blobUrl = window.URL.createObjectURL(blob);

      const isPdf = (docMimeType && docMimeType === "application/pdf") || docName.toLowerCase().endsWith(".pdf");
      
      if (isPdf) {
        window.open(blobUrl, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", docName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }

      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch (err) {
      console.error("Error opening document:", err);
      const directUrl = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/resource/${id}/document/${docId}`;
      window.open(directUrl, "_blank");
    } finally {
      setDownloadingDocId(null);
    }
  };

  const fetchResource = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getResourceById(id);
      if (res && res.success) {
        setResource(res.resource);
      } else {
        setError("Resource not found or unauthorized.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load resource details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResource();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4 text-xs text-text-muted">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-accent-cyan/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-accent-cyan animate-spin"></div>
        </div>
        <p className="animate-pulse tracking-widest uppercase">Fetching resource details...</p>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto my-12">
        <AlertCircle className="text-rose-400 mb-2 animate-bounce" size={24} />
        <h4 className="text-sm font-bold text-text-title">Unable to open Resource</h4>
        <p className="text-xs text-text-muted mt-1 mb-6">{error || "Failed to load requested resource."}</p>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/")} variant="secondary" className="text-xs py-2 px-4">
            Back to Dashboard
          </Button>
          <Button onClick={fetchResource} className="text-xs py-2 px-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const hasThumbnail = resource.thumbnail && resource.thumbnail.startsWith("http");

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-text-title transition duration-150 cursor-pointer active:scale-95 py-1 px-2 border border-transparent hover:border-glass-border hover:bg-glass-border/30 rounded-xl"
      >
        <ArrowLeft size={14} /> Back to Explorer
      </button>

      <SpotlightCard className="p-0 overflow-hidden" glowColor="rgba(6, 182, 212, 0.08)">
        <div className="h-64 sm:h-80 w-full bg-bg-dark border-b border-glass-border relative overflow-hidden">
          {hasThumbnail ? (
            <img src={resource.thumbnail} alt={resource.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#1E114A] via-[#15103E] to-[#0A0625] text-white">
              <BookOpen size={64} className="text-accent-cyan/40 animate-pulse" />
            </div>
          )}
          
          {resource.category && (
            <span className="absolute top-4 left-4 text-[9px] font-extrabold uppercase tracking-widest bg-bg-deep/80 text-accent-cyan border border-accent-cyan/20 px-3 py-1 rounded-lg backdrop-blur-md">
              {resource.category.name}
            </span>
          )}
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-text-title leading-tight">
              {resource.title}
            </h1>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-text-muted font-semibold pt-1 border-b border-glass-border/30 pb-4">
              <div className="flex items-center gap-1.5">
                <User size={12} className="text-accent-cyan" />
                <span>Created by:</span>
                <span className="text-text-title">{resource.createdBy?.name || "Unknown Creator"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={12} />
                <span>Published on:</span>
                <span className="text-text-title">
                  {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
                </span>
              </div>
              {resource.status && resource.status !== "published" && (
                <div className="flex items-center gap-1">
                  <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    {resource.status}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 text-xs leading-relaxed text-text-main">
            <h3 className="font-bold text-text-title uppercase tracking-widest text-[9px]">Resource Overview</h3>
            <p className="whitespace-pre-wrap bg-bg-darker/40 p-4 border border-glass-border/50 rounded-xl leading-relaxed">
              {resource.description}
            </p>
          </div>

          {resource.topics && resource.topics.length > 0 && (
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-text-muted uppercase tracking-widest text-[9px]">Associated Topics</h3>
              <div className="flex flex-wrap gap-2">
                {resource.topics.map((topic, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 px-3 py-1 rounded-lg font-bold">
                    <Tag size={10} /> {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </SpotlightCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpotlightCard className="p-6 flex flex-col justify-between" glowColor="rgba(124, 58, 237, 0.08)">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3">
              <h3 className="text-xs font-bold text-text-title uppercase tracking-widest flex items-center gap-2">
                <FileText className="text-accent-purple" size={14} /> Downloadable Documents
              </h3>
              <span className="text-[10px] text-text-muted bg-glass-border px-2 py-0.5 rounded-full font-bold">
                {resource.documents?.length || 0} files
              </span>
            </div>

            {(!resource.documents || resource.documents.length === 0) ? (
              <p className="text-xs text-text-muted py-6 italic text-center">No PDF notes or configuration files attached.</p>
            ) : (
              <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
                {resource.documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-glass-border/60 bg-bg-darker/35 hover:bg-bg-darker/60 rounded-xl transition duration-150 text-xs">
                    <div className="flex items-center gap-2 max-w-[70%]">
                      <FileText size={14} className="text-text-muted shrink-0" />
                      <span className="font-semibold text-text-title truncate">{doc.name}</span>
                    </div>
                    <button
                      onClick={() => handleOpenDocument(doc._id, doc.name, doc.mimeType)}
                      disabled={downloadingDocId !== null}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-accent-purple/20 bg-accent-purple/5 text-accent-purple hover:bg-accent-purple hover:text-white font-bold tracking-wider text-[9px] uppercase transition cursor-pointer active:scale-95 whitespace-nowrap disabled:opacity-50"
                    >
                      {downloadingDocId === doc._id ? "Opening..." : "Open Document"} <ExternalLink size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-6 flex flex-col justify-between" glowColor="rgba(249, 115, 22, 0.08)">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3">
              <h3 className="text-xs font-bold text-text-title uppercase tracking-widest flex items-center gap-2">
                <LinkIcon className="text-accent-orange" size={14} /> Reference Links
              </h3>
              <span className="text-[10px] text-text-muted bg-glass-border px-2 py-0.5 rounded-full font-bold">
                {resource.links?.length || 0} links
              </span>
            </div>

            {(!resource.links || resource.links.length === 0) ? (
              <p className="text-xs text-text-muted py-6 italic text-center">No reference links or GitHub repos attached.</p>
            ) : (
              <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
                {resource.links.map((link, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-glass-border/60 bg-bg-darker/35 hover:bg-bg-darker/60 rounded-xl transition duration-150 text-xs">
                    <div className="flex items-center gap-2 max-w-[70%]">
                      <LinkIcon size={14} className="text-text-muted shrink-0" />
                      <span className="font-semibold text-text-title truncate">{link.title}</span>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-accent-orange/20 bg-accent-orange/5 text-accent-orange hover:bg-accent-orange hover:text-white font-bold tracking-wider text-[9px] uppercase transition cursor-pointer active:scale-95 whitespace-nowrap"
                    >
                      Open Link <ExternalLink size={10} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default ResourceDetail;
