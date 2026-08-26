import React, { useState } from "react";
import { Plus, X, Tag } from "lucide-react";

const CourseTopics = ({ topics = [], setTopics }) => {
  const [topicInput, setTopicInput] = useState("");

  const handleAddTopic = (e) => {
    e.preventDefault();
    const trimmed = topicInput.trim();
    if (!trimmed) return;

    if (!topics.includes(trimmed)) {
      setTopics([...topics, trimmed]);
    }
    setTopicInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTopic(e);
    }
  };

  const handleRemoveTopic = (indexToRemove) => {
    setTopics(topics.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2 text-left">
      <label className="font-bold text-text-muted uppercase text-xs flex items-center gap-1.5">
        <Tag size={12} className="text-accent-purple" /> Course Topics
      </label>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="e.g. JavaScript, React, Node.js (Press Enter to add)"
          value={topicInput}
          onChange={(e) => setTopicInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow form-input rounded-xl p-2.5 text-xs bg-bg-dark text-text-title border-glass-border focus:border-accent-purple/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAddTopic}
          className="px-3.5 py-2.5 bg-accent-purple/20 text-accent-purple border border-accent-purple/30 rounded-xl font-bold text-xs hover:bg-accent-purple hover:text-white transition flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {topics.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {topics.map((topic, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 text-xs bg-accent-purple/15 text-accent-purple border border-accent-purple/25 px-2.5 py-1 rounded-lg font-semibold"
            >
              #{topic}
              <button
                type="button"
                onClick={() => handleRemoveTopic(index)}
                className="hover:text-rose-400 transition cursor-pointer ml-0.5"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-text-muted italic">No topics added yet. Add tags to categorize course subjects.</p>
      )}
    </div>
  );
};

export default CourseTopics;
