import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "../Button";
import SpotlightCard from "../SpotlightCard";

const ErrorState = ({ message, onRetry }) => {
  return (
    <SpotlightCard className="p-8 bg-rose-500/5 border border-rose-500/20 text-center rounded-2xl max-w-md mx-auto my-6" glowColor="rgba(244, 63, 94, 0.1)">
      <div className="h-10 w-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
        <AlertCircle size={20} />
      </div>
      <h4 className="text-sm font-bold text-text-title">Unable to load dashboard data</h4>
      <p className="text-xs text-text-muted mt-1.5 mb-5">
        {message || "An error occurred while fetching information from the server."}
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="text-xs py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2 mx-auto">
          <RefreshCw size={12} />
          Try Again
        </Button>
      )}
    </SpotlightCard>
  );
};

export default ErrorState;
