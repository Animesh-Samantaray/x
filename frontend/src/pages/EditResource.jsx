import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../services/categoryService";
import { getResourceById, updateResource } from "../services/resourceService";
import SpotlightCard from "../components/SpotlightCard";
import Button from "../components/Button";
import { ArrowLeft, Edit2, Trash2, X, Plus, AlertCircle, Info, FileText, Link as LinkIcon, BookOpen, Tag } from "lucide-react";

const EditResource = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingResource, setLoadingResource] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [status, setStatus] = useState("draft");

  const [topics, setTopics] = useState([]);
  const [topicInput, setTopicInput] = useState("");

  const [documents, setDocuments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [links, setLinks] = useState([]);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [editingLinkIndex, setEditingLinkIndex] = useState(null);

  const [formError, setFormError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingResource(true);
        setLoadingCats(true);

        const [catsRes, resourceRes] = await Promise.all([
          getCategories(),
          getResourceById(id)
        ]);

        if (catsRes && catsRes.success) {
          setCategories(catsRes.categories || []);
        }

        if (resourceRes && resourceRes.success) {
          const r = resourceRes.resource;
          setTitle(r.title);
          setDescription(r.description);
          setSelectedCategory(r.category?._id || r.category || "");
          setThumbnail(r.thumbnail || "");
          setStatus(r.status || "draft");
          setTopics(r.topics || []);
          setDocuments(r.documents || []);
          setLinks(r.links || []);
        } else {
          setFormError("Resource not found or unauthorized.");
        }
      } catch (err) {
        console.error(err);
        setFormError(err.response?.data?.message || "Failed to load resource data.");
      } finally {
        setLoadingResource(false);
        setLoadingCats(false);
      }
    };
    loadData();
  }, [id]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    const t = topicInput.trim();
    if (t && !topics.includes(t)) {
      setTopics([...topics, t]);
      setTopicInput("");
    }
  };

  const handleRemoveTopic = (index) => {
    setTopics(topics.filter((_, idx) => idx !== index));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    if (documents.length + selectedFiles.length + files.length > 5) {
      triggerToast("Maximum of 5 documents total (existing + new) allowed.");
      return;
    }

    const allowedExtensions = ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt"];
    const getExtension = (filename) => filename.split(".").pop().toLowerCase();

    const validatedFiles = [];
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        triggerToast(`File size cannot exceed 10 MB: ${file.name}`);
        return;
      }

      const ext = getExtension(file.name);
      if (!allowedExtensions.includes(ext)) {
        triggerToast(`Unsupported file type: ${file.name}`);
        return;
      }

      validatedFiles.push(file);
    }

    setSelectedFiles((prev) => [...prev, ...validatedFiles]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRemoveExistingDocument = (index) => {
    setDocuments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    const title = linkTitle.trim();
    const url = linkUrl.trim();

    if (!title || !url) {
      triggerToast("Link Title and URL are required");
      return;
    }

    if (editingLinkIndex !== null) {
      const updated = [...links];
      updated[editingLinkIndex] = { title, url };
      setLinks(updated);
      setEditingLinkIndex(null);
    } else {
      setLinks([...links, { title, url }]);
    }

    setLinkTitle("");
    setLinkUrl("");
  };

  const handleEditLink = (index) => {
    const link = links[index];
    setLinkTitle(link.title);
    setLinkUrl(link.url);
    setEditingLinkIndex(index);
  };

  const handleRemoveLink = (index) => {
    setLinks(links.filter((_, idx) => idx !== index));
    if (editingLinkIndex === index) {
      setEditingLinkIndex(null);
      setLinkTitle("");
      setLinkUrl("");
    }
  };

  const handleSave = async (targetStatus) => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    const trimmedThumb = thumbnail.trim();

    if (!trimmedTitle || !trimmedDesc) {
      setFormError("Title and description are required.");
      return;
    }

    if (!selectedCategory) {
      setFormError("Please select a category.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const formData = new FormData();
      formData.append("title", trimmedTitle);
      formData.append("description", trimmedDesc);
      formData.append("category", selectedCategory);
      if (trimmedThumb) {
        formData.append("thumbnail", trimmedThumb);
      }
      formData.append("topics", JSON.stringify(topics));
      formData.append("links", JSON.stringify(links));
      formData.append("status", targetStatus);
      formData.append("existingDocuments", JSON.stringify(documents));

      selectedFiles.forEach((file) => {
        formData.append("documents", file);
      });

      const res = await updateResource(id, formData);

      if (res && res.success) {
        triggerToast(`Resource successfully updated as ${targetStatus}`);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || `Failed to update resource as ${targetStatus}.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingResource && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4 text-xs text-text-muted">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-accent-blue/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-accent-blue animate-spin"></div>
        </div>
        <p className="animate-pulse tracking-widest uppercase">Loading form data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto relative pb-12">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[100] flex items-center gap-3 bg-bg-panel border border-accent-blue/30 bg-bg-darker/95 px-5 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
          <Info className="text-accent-blue shrink-0 animate-pulse" size={18} />
          <p className="text-xs font-semibold text-text-title">{toastMessage}</p>
        </div>
      )}

      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-text-title transition duration-150 cursor-pointer active:scale-95 py-1 px-2 border border-transparent hover:border-glass-border hover:bg-glass-border/30 rounded-xl"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      <div className="border-b border-glass-border/40 pb-5">
        <h1 className="text-2xl font-extrabold text-text-title flex items-center gap-2">
          <Edit2 className="text-accent-blue" size={24} /> Edit Resource
        </h1>
        <p className="text-xs text-text-muted font-semibold mt-1">
          Modify the basic fields, topics, attachments, or links of this resource.
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <SpotlightCard className="p-6 text-xs space-y-4" glowColor="rgba(59, 130, 246, 0.05)">
            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest border-b border-glass-border/30 pb-3 mb-2">
              Basic Information
            </h3>

            {formError && (
              <div className="p-3 border border-rose-500/20 bg-rose-500/5 rounded-xl text-rose-400 flex items-center gap-2 font-semibold">
                <AlertCircle size={14} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-text-muted uppercase">Resource Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full form-input rounded-xl p-3 bg-bg-dark text-text-title border-glass-border focus:border-accent-blue/50 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-text-muted uppercase">Content Summary / Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full form-input rounded-xl p-3 bg-bg-dark text-text-title border-glass-border focus:border-accent-blue/50 focus:outline-none leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-text-muted uppercase">Category *</label>
                {loadingCats ? (
                  <div className="h-10 w-full bg-bg-dark border border-glass-border rounded-xl animate-pulse"></div>
                ) : (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full form-input rounded-xl p-3 bg-bg-dark text-text-title border-glass-border focus:border-accent-blue/50 cursor-pointer"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-muted uppercase">Thumbnail Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full form-input rounded-xl p-3 bg-bg-dark text-text-title border-glass-border focus:border-accent-blue/50 focus:outline-none"
                />
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6 text-xs space-y-4" glowColor="rgba(59, 130, 246, 0.05)">
            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest border-b border-glass-border/30 pb-3">
              Documents
            </h3>

            {documents.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="font-bold text-text-muted uppercase text-[9px] tracking-wider">Existing Documents</h4>
                <div className="space-y-2">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-glass-border bg-bg-darker/60 rounded-xl">
                      <div className="flex items-center gap-2 max-w-[60%]">
                        <FileText size={14} className="text-accent-purple" />
                        <span className="font-semibold text-text-title truncate">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-blue border border-accent-blue/20 bg-accent-blue/5 hover:bg-accent-blue hover:text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition cursor-pointer active:scale-95"
                        >
                          Open
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingDocument(idx)}
                          className="text-rose-400 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 hover:text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition cursor-pointer active:scale-95"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-2">
              <div>
                <input
                  type="file"
                  id="document-file-input"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                />
                <label
                  htmlFor="document-file-input"
                  className="inline-flex items-center gap-2 border border-glass-border hover:bg-glass-border hover:text-text-title px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider transition cursor-pointer active:scale-95 text-xs text-text-title bg-bg-darker"
                >
                  <Plus size={14} className="text-accent-blue" /> Choose Files
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="font-bold text-text-muted uppercase text-[9px] tracking-wider">New files to upload:</h4>
                  <div className="space-y-2.5">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-glass-border bg-bg-darker/60 rounded-xl">
                        <div className="flex items-center gap-2 max-w-[70%]">
                          <FileText size={14} className="text-accent-blue" />
                          <span className="font-semibold text-text-title truncate">{file.name}</span>
                          <span className="text-[10px] text-text-muted">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-rose-400 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 hover:text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition cursor-pointer active:scale-95"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6 text-xs space-y-4" glowColor="rgba(59, 130, 246, 0.05)">
            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest border-b border-glass-border/30 pb-3">
              Add Reference Web Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end bg-bg-darker/40 p-4 border border-glass-border rounded-xl">
              <div className="sm:col-span-5 space-y-1">
                <label className="font-bold text-text-muted uppercase text-[9px]">Link Title</label>
                <input
                  type="text"
                  placeholder="e.g. Official Documentation"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="w-full form-input rounded-xl p-2.5 bg-bg-dark text-text-title border-glass-border focus:border-accent-blue/50 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-5 space-y-1">
                <label className="font-bold text-text-muted uppercase text-[9px]">Web URL</label>
                <input
                  type="text"
                  placeholder="https://react.dev"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full form-input rounded-xl p-2.5 bg-bg-dark text-text-title border-glass-border focus:border-accent-blue/50 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <Button onClick={handleAddLink} className="w-full py-2.5 px-3 text-xs flex justify-center items-center gap-1">
                  {editingLinkIndex !== null ? "Save" : "Add"} <Plus size={12} />
                </Button>
              </div>
            </div>

            {links.length === 0 ? (
              <p className="text-center py-4 text-text-muted italic">No reference links attached yet.</p>
            ) : (
              <div className="space-y-2.5">
                {links.map((link, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-glass-border bg-bg-darker/60 rounded-xl">
                    <div className="flex items-center gap-2 max-w-[70%]">
                      <LinkIcon size={14} className="text-accent-orange" />
                      <span className="font-semibold text-text-title truncate">{link.title}</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <button type="button" onClick={() => handleEditLink(idx)} className="text-accent-blue border border-accent-blue/20 bg-accent-blue/5 hover:bg-accent-blue hover:text-white p-1.5 rounded-md cursor-pointer">
                        <Edit2 size={12} />
                      </button>
                      <button type="button" onClick={() => handleRemoveLink(idx)} className="text-rose-400 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 hover:text-white p-1.5 rounded-md cursor-pointer">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SpotlightCard>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <SpotlightCard className="p-6 text-xs space-y-4" glowColor="rgba(59, 130, 246, 0.05)">
            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest border-b border-glass-border/30 pb-3">
              Resource Topics / Tags
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. NextJS"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTopic(e)}
                className="flex-grow form-input rounded-xl p-2.5 bg-bg-dark text-text-title border-glass-border focus:border-accent-blue/50 focus:outline-none"
              />
              <Button onClick={handleAddTopic} variant="secondary" className="py-2.5 px-3 text-xs shrink-0 flex items-center justify-center">
                Add
              </Button>
            </div>

            {topics.length === 0 ? (
              <p className="text-text-muted italic py-2">No tags added yet. Topics help users search for resources.</p>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1.5">
                {topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-accent-blue/10 text-accent-blue border border-accent-blue/20 px-2.5 py-1 rounded-lg font-bold"
                  >
                    <Tag size={10} /> {t}
                    <button type="button" onClick={() => handleRemoveTopic(idx)} className="text-rose-400 hover:text-rose-500 shrink-0 cursor-pointer ml-0.5">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </SpotlightCard>

          <SpotlightCard className="p-6 text-xs space-y-4" glowColor="rgba(59, 130, 246, 0.05)">
            <h3 className="text-[10px] font-bold text-text-title uppercase tracking-widest border-b border-glass-border/30 pb-3">
              Publishing Actions
            </h3>
            
            <div className="flex flex-col gap-2.5 pt-1.5">
              <Button type="button" onClick={() => handleSave("draft")} loading={submitting} className="w-full justify-center bg-amber-600 hover:bg-amber-700">
                {submitting ? "Saving Draft..." : "Save as Draft"}
              </Button>
              <Button type="button" onClick={() => handleSave("published")} loading={submitting} className="w-full justify-center bg-emerald-600 hover:bg-emerald-700">
                {submitting ? "Publishing..." : "Publish Resource"}
              </Button>
              <Button type="button" onClick={() => handleSave("archived")} loading={submitting} className="w-full justify-center bg-slate-600 hover:bg-slate-700">
                {submitting ? "Archiving..." : "Archive Resource"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate("/")} className="w-full justify-center" disabled={submitting}>
                Cancel
              </Button>
            </div>
          </SpotlightCard>
        </div>
      </form>
    </div>
  );
};

export default EditResource;
