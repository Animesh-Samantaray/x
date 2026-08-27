import React, { useState } from "react";
import SpotlightCard from "../SpotlightCard";
import Button from "../Button";
import {
  X,
  Upload,
  Link as LinkIcon,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  Paperclip
} from "lucide-react";

const UnitFormModal = ({
  courseId,
  initialUnit = null,
  isOpen,
  onClose,
  onSubmitSuccess
}) => {
  const isEdit = Boolean(initialUnit);

  const [title, setTitle] = useState(initialUnit?.title || "");
  const [description, setDescription] = useState(initialUnit?.description || "");
  
  // Existing attachments (for edit mode)
  const [existingAttachments, setExistingAttachments] = useState(
    initialUnit?.attachments || []
  );
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState([]);

  // New URL attachments added in form
  const [urlAttachments, setUrlAttachments] = useState([]);
  const [newUrlTitle, setNewUrlTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newUrlType, setNewUrlType] = useState("link");

  // New files selected for upload
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  // Add a direct URL attachment to transient state
  const handleAddUrlAttachment = () => {
    if (!newUrl.trim()) {
      setFormError("Please enter a valid URL.");
      return;
    }
    setFormError("");

    setUrlAttachments([
      ...urlAttachments,
      {
        title: newUrlTitle.trim() || newUrl.trim(),
        url: newUrl.trim(),
        type: newUrlType,
      },
    ]);

    setNewUrlTitle("");
    setNewUrl("");
    setNewUrlType("link");
  };

  const handleRemoveUrlAttachment = (index) => {
    setUrlAttachments(urlAttachments.filter((_, i) => i !== index));
  };

  // Handle local file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArr]);
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Handle removing existing attachment (in Edit mode)
  const handleRemoveExisting = (attachmentId) => {
    setExistingAttachments(
      existingAttachments.filter((att) => att._id !== attachmentId)
    );
    setRemovedAttachmentIds((prev) => [...prev, attachmentId]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim()) {
      setFormError("Unit title is required.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      if (!isEdit) {
        formData.append("course", courseId);
      }

      // Attach direct URL attachments if any
      if (urlAttachments.length > 0) {
        formData.append("attachments", JSON.stringify(urlAttachments));
      }

      // Attach file uploads if any
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      // For Edit unit, pass removedAttachmentIds if any
      if (isEdit && removedAttachmentIds.length > 0) {
        formData.append("removeAttachments", JSON.stringify(removedAttachmentIds));
      }

      await onSubmitSuccess(formData, initialUnit?._id);
      onClose();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || "Failed to save unit.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <SpotlightCard
        className="w-full max-w-2xl bg-bg-panel border border-glass-border/70 p-6 rounded-2xl text-left shadow-2xl space-y-5 my-8"
        glowColor="rgba(168, 85, 247, 0.12)"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-glass-border/40 pb-3">
          <h3 className="text-sm font-bold text-text-title uppercase tracking-wider flex items-center gap-2">
            <FileText size={16} className="text-accent-purple" />
            {isEdit ? "Edit Learning Unit" : "Add New Learning Unit"}
          </h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-rose-400 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="p-3 border border-rose-500/20 bg-rose-500/5 rounded-xl text-xs text-rose-400 flex items-center gap-2 font-semibold">
            <AlertCircle size={14} className="shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Unit Title & Description */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="font-bold text-text-muted uppercase">Unit Title *</label>
              <input
                type="text"
                placeholder="e.g. Unit 1: Introduction to Module Concepts"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full form-input rounded-xl p-2.5 bg-bg-dark text-text-title border-glass-border focus:border-accent-purple/50 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-text-muted uppercase">Description</label>
              <textarea
                placeholder="Describe what learners will achieve in this unit..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full form-input rounded-xl p-2.5 bg-bg-dark text-text-title border-glass-border focus:border-accent-purple/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Existing Attachments (Edit Mode) */}
          {isEdit && existingAttachments.length > 0 && (
            <div className="space-y-2 border-t border-glass-border/30 pt-3">
              <label className="font-bold text-text-muted uppercase flex items-center gap-1">
                <Paperclip size={12} className="text-accent-cyan" /> Existing Unit Attachments ({existingAttachments.length})
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {existingAttachments.map((att) => (
                  <div
                    key={att._id}
                    className="p-2.5 rounded-xl border border-glass-border/60 bg-bg-dark flex items-center justify-between gap-2"
                  >
                    <div className="overflow-hidden">
                      <div className="font-bold text-text-title truncate">{att.title || att.url}</div>
                      <span className="text-[9px] uppercase font-bold text-accent-purple bg-accent-purple/10 border border-accent-purple/20 px-1.5 py-0.2 rounded">
                        {att.type}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExisting(att._id)}
                      className="text-rose-400 hover:text-rose-300 p-1 hover:bg-rose-500/10 rounded transition cursor-pointer"
                      title="Remove attachment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Attachments Section */}
          <div className="space-y-3 border-t border-glass-border/30 pt-3">
            <label className="font-bold text-text-muted uppercase flex items-center gap-1">
              <Paperclip size={12} className="text-accent-purple" /> Attachments (Optional)
            </label>

            {/* A. Direct URL Attachment Form */}
            <div className="p-3 bg-bg-darker rounded-xl border border-glass-border/50 space-y-2.5">
              <span className="text-[10px] font-bold uppercase text-accent-cyan flex items-center gap-1">
                <LinkIcon size={12} /> Add Direct URL Attachment
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="Attachment Title"
                  value={newUrlTitle}
                  onChange={(e) => setNewUrlTitle(e.target.value)}
                  className="sm:col-span-4 form-input text-xs rounded-lg p-2 bg-bg-dark"
                />
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or doc URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="sm:col-span-5 form-input text-xs rounded-lg p-2 bg-bg-dark"
                />
                <select
                  value={newUrlType}
                  onChange={(e) => setNewUrlType(e.target.value)}
                  className="sm:col-span-3 form-input text-xs rounded-lg p-2 bg-bg-dark cursor-pointer"
                >
                  <option value="link">Link</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="image">Image</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddUrlAttachment}
                className="text-[10px] font-bold text-accent-purple hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} /> Add URL Attachment
              </button>

              {/* Pending URL Attachments list */}
              {urlAttachments.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  {urlAttachments.map((att, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-bg-dark border border-glass-border/40 flex items-center justify-between text-[11px]">
                      <div className="truncate">
                        <span className="font-bold text-text-title">{att.title}</span>
                        <span className="ml-2 text-[9px] text-accent-purple font-bold">[{att.type}]</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveUrlAttachment(idx)}
                        className="text-rose-400 hover:text-rose-300 p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* B. Upload File Attachment Form */}
            <div className="p-3 bg-bg-darker rounded-xl border border-glass-border/50 space-y-2">
              <span className="text-[10px] font-bold uppercase text-accent-purple flex items-center gap-1">
                <Upload size={12} /> Upload Files (PDF, Video, Docs, Images)
              </span>

              <label className="flex items-center justify-center p-3 border-2 border-dashed border-glass-border rounded-xl cursor-pointer hover:border-accent-purple/50 bg-bg-dark/50 transition">
                <div className="flex items-center gap-2 text-text-muted">
                  <Upload size={16} className="text-accent-purple" />
                  <span className="text-xs font-semibold">Click to browse files to upload</span>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Selected Files preview list */}
              {selectedFiles.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-bg-dark border border-glass-border/40 flex items-center justify-between text-[11px]">
                      <div className="truncate">
                        <span className="font-bold text-text-title">{file.name}</span>
                        <span className="ml-2 text-[9px] text-text-muted">
                          ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="text-rose-400 hover:text-rose-300 p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-glass-border/30">
            <Button variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {submitting ? (isEdit ? "Saving..." : "Creating...") : isEdit ? "Update Unit" : "Create Unit"}
            </Button>
          </div>
        </form>
      </SpotlightCard>
    </div>
  );
};

export default UnitFormModal;
