import React, { useState, useEffect } from "react";
import { getEnrolledStudents } from "../../services/courseService";
import SpotlightCard from "../SpotlightCard";
import Button from "../Button";
import { GraduationCap, X, Mail, User, AlertCircle } from "lucide-react";

const EnrolledStudents = ({ courseId, courseTitle, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getEnrolledStudents(courseId);
        if (res && res.success) {
          setStudents(res.students || []);
        } else {
          setError("Failed to fetch enrolled students.");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load student list.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchStudents();
    }
  }, [courseId]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <SpotlightCard
        className="w-full max-w-md bg-bg-panel border border-glass-border/70 p-6 rounded-2xl text-left shadow-2xl space-y-4"
        glowColor="rgba(6, 182, 212, 0.12)"
      >
        <div className="flex items-center justify-between border-b border-glass-border/30 pb-3">
          <div>
            <h3 className="text-xs font-bold text-text-title uppercase tracking-widest flex items-center gap-2">
              <GraduationCap size={16} className="text-accent-cyan" /> Enrolled Students
            </h3>
            <p className="text-[10px] text-text-muted mt-0.5 truncate max-w-xs">{courseTitle}</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-rose-400 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 border border-rose-500/20 bg-rose-500/5 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-xs text-text-muted flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-accent-cyan"></div>
            Loading student list...
          </div>
        ) : students.length === 0 ? (
          <div className="py-10 text-center text-xs text-text-muted space-y-2">
            <User size={24} className="mx-auto text-text-muted/50" />
            <p>No students enrolled in this course yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-text-muted tracking-wider border-b border-glass-border/20 pb-2">
              <span>Student Details</span>
              <span className="text-accent-cyan">{students.length} Total Enrolled</span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {students.map((student, idx) => (
                <div
                  key={student._id || idx}
                  className="p-3 bg-bg-dark border border-glass-border rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan flex items-center justify-center font-bold text-xs uppercase shrink-0">
                      {student.name ? student.name[0] : "S"}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-text-title">{student.name}</h4>
                      <p className="text-[10px] text-text-muted flex items-center gap-1">
                        <Mail size={10} /> {student.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-glass-border/30">
          <Button variant="secondary" onClick={onClose} className="text-xs py-2 px-4">
            Close Window
          </Button>
        </div>
      </SpotlightCard>
    </div>
  );
};

export default EnrolledStudents;
