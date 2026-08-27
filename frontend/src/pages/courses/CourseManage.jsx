import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, deleteCourse } from "../../services/courseService";
import {
  getUnitsByCourse,
  createUnit,
  updateUnit,
  deleteUnit
} from "../../services/unitService";
import { useAuth } from "../../context/AuthContext";
import SpotlightCard from "../../components/SpotlightCard";
import Button from "../../components/Button";
import UnitFormModal from "../../components/courses/UnitFormModal";
import AttachmentViewer, { getAttachmentIcon } from "../../components/courses/AttachmentViewer";
import {
  BookOpen,
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  FileText,
  Eye,
  Layers,
  X,
  ExternalLink,
  ChevronRight
} from "lucide-react";

const CourseManage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  const [deleteUnitConfirmId, setDeleteUnitConfirmId] = useState(null);
  const [deletingUnit, setDeletingUnit] = useState(false);

  const [selectedUnitView, setSelectedUnitView] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const courseRes = await getCourseById(id);
      if (courseRes && courseRes.success) {
        setCourse(courseRes.course);
      } else {
        setError("Course not found.");
        return;
      }

      const unitsRes = await getUnitsByCourse(id);
      if (unitsRes && unitsRes.success) {
        setUnits(unitsRes.units || []);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const isOwner = user && (course?.createdBy?._id === user._id || course?.createdBy === user._id);
  const isAdmin = user && user.role === "admin";
  const canManage = isOwner || isAdmin;

  // Handle Save Unit (Create or Update)
  const handleSaveUnit = async (formData, unitId) => {
    if (unitId) {
      const res = await updateUnit(unitId, formData);
      if (res && res.success) {
        fetchData();
      }
    } else {
      const res = await createUnit(formData);
      if (res && res.success) {
        fetchData();
      }
    }
  };

  // Handle Delete Unit
  const handleDeleteUnit = async () => {
    try {
      setDeletingUnit(true);
      const res = await deleteUnit(deleteUnitConfirmId);
      if (res && res.success) {
        setDeleteUnitConfirmId(null);
        if (selectedUnitView?._id === deleteUnitConfirmId) {
          setSelectedUnitView(null);
        }
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete unit.");
    } finally {
      setDeletingUnit(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-text-muted flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent-purple"></div>
        Loading course management studio...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto my-12 text-left">
        <AlertCircle className="text-rose-400 mb-2 animate-bounce" size={28} />
        <h4 className="text-sm font-bold text-text-title">Management Unavailable</h4>
        <p className="text-xs text-text-muted mt-1 mb-4">{error || "The requested course was not found."}</p>
        <Button onClick={() => navigate("/my-courses")} className="text-xs py-2 px-4">
          &larr; Back to My Courses
        </Button>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center max-w-md mx-auto my-12 text-left">
        <AlertCircle className="text-rose-400 mb-2 animate-bounce" size={28} />
        <h4 className="text-sm font-bold text-text-title">Access Denied</h4>
        <p className="text-xs text-text-muted mt-1 mb-4">You are not authorized to manage this course.</p>
        <Button onClick={() => navigate(`/courses/${course._id}`)} className="text-xs py-2 px-4">
          View Course Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left relative">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass-border/40 pb-4">
        <button
          onClick={() => navigate(`/courses/${course._id}`)}
          className="text-xs font-bold text-text-muted hover:text-text-title flex items-center gap-1.5 transition"
        >
          <ArrowLeft size={14} /> Back to Course Overview
        </button>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate(`/courses/${course._id}/learn`)}
            variant="secondary"
            className="text-xs py-2 px-3 border-accent-purple/30 text-accent-purple"
          >
            Preview Learner View &rarr;
          </Button>
          <Button
            onClick={() => navigate(`/courses/edit/${course._id}`)}
            variant="secondary"
            className="text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <Edit2 size={14} /> Edit Course Metadata
          </Button>
          <Button
            onClick={() => {
              setEditingUnit(null);
              setUnitModalOpen(true);
            }}
            className="text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Unit
          </Button>
        </div>
      </div>

      {/* Course Summary Banner */}
      <SpotlightCard className="p-6 bg-glass-card border border-glass-border rounded-2xl" glowColor="rgba(168, 85, 247, 0.08)">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-accent-purple bg-accent-purple/10 border border-accent-purple/20 px-2.5 py-0.5 rounded">
              Course Management
            </span>
            <h1 className="text-xl font-extrabold text-text-title">{course.title}</h1>
            <p className="text-xs text-text-muted line-clamp-2 max-w-3xl">{course.description}</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-text-title border-t md:border-t-0 md:border-l border-glass-border/40 pt-3 md:pt-0 md:pl-6 shrink-0">
            <div>
              <span className="block text-[9px] uppercase text-text-muted">Total Units</span>
              <span className="text-lg text-accent-purple">{units.length}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase text-text-muted">Enrolled</span>
              <span className="text-lg text-accent-cyan">{course.enrolledStudents?.length || 0}</span>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Units Management List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-glass-border/40 pb-3">
          <h2 className="text-md font-bold text-text-title flex items-center gap-2">
            <Layers size={18} className="text-accent-purple" /> Course Curriculum & Units ({units.length})
          </h2>
          <Button
            onClick={() => {
              setEditingUnit(null);
              setUnitModalOpen(true);
            }}
            className="text-xs py-1.5 px-3 flex items-center gap-1"
          >
            <Plus size={12} /> Add Unit
          </Button>
        </div>

        {units.length === 0 ? (
          <SpotlightCard className="p-12 text-center rounded-2xl" glowColor="rgba(168, 85, 247, 0.05)">
            <FileText size={32} className="text-text-muted mx-auto mb-3" />
            <h3 className="text-md font-bold text-text-title">No units have been added to this course yet.</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto mt-1 mb-6">
              Start building your course structure by adding learning units with instructions, videos, documents, or links.
            </p>
            <Button
              onClick={() => {
                setEditingUnit(null);
                setUnitModalOpen(true);
              }}
              className="text-xs py-2.5 px-5"
            >
              Add First Unit &rarr;
            </Button>
          </SpotlightCard>
        ) : (
          <div className="space-y-3">
            {units.map((unit) => {
              const attachmentCount = unit.attachments?.length || 0;

              return (
                <SpotlightCard
                  key={unit._id}
                  className="p-5 bg-glass-card border border-glass-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                  glowColor="rgba(168, 85, 247, 0.08)"
                >
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-purple bg-accent-purple/15 border border-accent-purple/30 px-2 py-0.5 rounded">
                        Unit {unit.order}
                      </span>
                      <h3 className="text-sm font-bold text-text-title">{unit.title}</h3>
                    </div>
                    {unit.description && (
                      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                        {unit.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 pt-1 text-[10px] font-semibold text-text-muted">
                      <span className="flex items-center gap-1 text-accent-cyan">
                        <FileText size={12} /> {attachmentCount} {attachmentCount === 1 ? "Attachment" : "Attachments"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-glass-border/30 pt-3 md:pt-0">
                    <button
                      onClick={() => setSelectedUnitView(unit)}
                      className="text-xs border border-glass-border hover:bg-glass-border hover:text-text-title px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={12} /> View Attachments
                    </button>
                    <button
                      onClick={() => {
                        setEditingUnit(unit);
                        setUnitModalOpen(true);
                      }}
                      className="text-xs border border-accent-purple/30 bg-accent-purple/10 text-accent-purple hover:bg-accent-purple hover:text-white px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteUnitConfirmId(unit._id)}
                      className="text-xs border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Unit Attachment Quick View Modal */}
      {selectedUnitView && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <SpotlightCard className="w-full max-w-3xl bg-bg-panel border border-glass-border/70 p-6 rounded-2xl text-left shadow-2xl space-y-5 my-8" glowColor="rgba(168, 85, 247, 0.12)">
            <div className="flex items-center justify-between border-b border-glass-border/40 pb-3">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-accent-purple">
                  Unit {selectedUnitView.order} Attachments
                </span>
                <h3 className="text-sm font-bold text-text-title">{selectedUnitView.title}</h3>
              </div>
              <button onClick={() => setSelectedUnitView(null)} className="text-text-muted hover:text-rose-400 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {selectedUnitView.attachments?.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                This unit has no attachments.
              </div>
            ) : (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                {selectedUnitView.attachments.map((att, idx) => (
                  <div key={att._id || idx} className="p-4 rounded-xl border border-glass-border bg-bg-dark space-y-3">
                    <AttachmentViewer attachment={att} />
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-glass-border/30">
              <Button variant="secondary" onClick={() => setSelectedUnitView(null)}>
                Close
              </Button>
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* Unit Form Modal (Create / Edit) */}
      {unitModalOpen && (
        <UnitFormModal
          courseId={id}
          initialUnit={editingUnit}
          isOpen={unitModalOpen}
          onClose={() => setUnitModalOpen(false)}
          onSubmitSuccess={handleSaveUnit}
        />
      )}

      {/* Delete Unit Confirmation Modal */}
      {deleteUnitConfirmId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <SpotlightCard className="w-full max-w-sm bg-bg-panel border border-glass-border/70 p-6 rounded-2xl text-left shadow-2xl space-y-4" glowColor="rgba(244, 63, 94, 0.12)">
            <div className="flex items-center justify-between border-b border-glass-border/30 pb-3">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <Trash2 size={14} /> Delete Unit
              </h3>
              <button onClick={() => setDeleteUnitConfirmId(null)} className="text-text-muted hover:text-rose-400 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-text-main leading-relaxed">
              Are you sure you want to delete this unit? All unit attachments will be removed.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button variant="secondary" onClick={() => setDeleteUnitConfirmId(null)} disabled={deletingUnit}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteUnit} loading={deletingUnit}>
                {deletingUnit ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </SpotlightCard>
        </div>
      )}
    </div>
  );
};

export default CourseManage;
