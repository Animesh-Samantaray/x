import React from "react";
import Button from "../Button";
import SpotlightCard from "../SpotlightCard";

const EmptyState = ({ icon: Icon, title, description, actionText, onAction, glowColor = "rgba(168, 85, 247, 0.08)" }) => {
  return (
    <SpotlightCard className="p-8 sm:p-12 bg-glass-card border border-glass-border text-center rounded-2xl" glowColor={glowColor}>
      {Icon && (
        <div className="h-12 w-12 rounded-2xl bg-glass-border/40 text-text-muted flex items-center justify-center mx-auto mb-4 border border-glass-border">
          <Icon size={24} className="text-text-title" />
        </div>
      )}
      <h3 className="text-base font-bold text-text-title">{title}</h3>
      {description && (
        <p className="text-xs text-text-muted max-w-md mx-auto mt-1.5 leading-relaxed font-medium">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <div className="mt-5">
          <Button onClick={onAction} className="text-xs py-2 px-4 shadow-md">
            {actionText}
          </Button>
        </div>
      )}
    </SpotlightCard>
  );
};

export default EmptyState;
