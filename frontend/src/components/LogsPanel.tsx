import React, { useState } from "react";
import { format } from "date-fns";
import {
  Terminal,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
  RefreshCw,
} from "lucide-react";
import { cn } from "../lib/utils";

interface Log {
  _id?: string;
  event?: string;
  details?: any;
  timestamp?: string;
}

interface LogsPanelProps {
  logs: Log[];
  isLoading: boolean;
}

// Normalize event safely
const normalizeEvent = (event?: string) =>
  (event || "UNKNOWN").toUpperCase();

const EventBadge: React.FC<{ event?: string }> = ({ event }) => {
  const normalized = normalizeEvent(event);

  let colorClass = "text-zinc-400 bg-zinc-800 border-zinc-700";
  let Icon = Info;

  if (normalized.includes("VALIDATION_FAILED")) {
    colorClass = "text-rose-400 bg-rose-400/10 border-rose-400/20";
    Icon = AlertCircle;
  } else if (normalized.includes("RECOVERY")) {
    colorClass = "text-amber-400 bg-amber-400/10 border-amber-400/20";
    Icon = RefreshCw;
  } else if (normalized.includes("COMPLETED")) {
    colorClass = "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    Icon = CheckCircle;
  } else if (normalized.includes("SLA")) {
    colorClass = "text-orange-400 bg-orange-400/10 border-orange-400/20";
    Icon = AlertCircle;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border uppercase",
        colorClass
      )}
    >
      <Icon className="w-3 h-3" />
      {normalized.replace(/_/g, " ")}
    </span>
  );
};

const LogRow: React.FC<{ log: Log; index: number }> = ({ log, index }) => {
  const [expanded, setExpanded] = useState(false);

  // Safe timestamp handling
  let formattedTime = "N/A";
  if (log.timestamp) {
    const date = new Date(log.timestamp);
    if (!isNaN(date.getTime())) {
      formattedTime = format(date, "HH:mm:ss.SSS");
    }
  }

  return (
    <div className="border-b border-zinc-800/50 last:border-0">
      <div
        className="px-4 py-3 flex items-start gap-3 hover:bg-zinc-800/30 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="mt-0.5 text-zinc-600">
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <EventBadge event={log.event} />
            <span className="text-[10px] font-mono text-zinc-500">
              {formattedTime}
            </span>
          </div>

          <p className="text-xs text-zinc-400 truncate font-mono">
            {log._id || `log-${index}`}
          </p>
        </div>
      </div>

      {expanded && (
        <div className="px-11 pb-4 pt-1 bg-zinc-900/30">
          <div className="bg-zinc-950 rounded border border-zinc-800 p-3 overflow-x-auto">
            <pre className="text-[10px] font-mono text-zinc-400">
              {JSON.stringify(log.details || {}, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default function LogsPanel({ logs, isLoading }: LogsPanelProps) {
  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-zinc-100 uppercase flex items-center gap-2">
          <Terminal className="w-4 h-4 text-zinc-400" />
          Audit Logs
        </h2>

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <div className="w-3 h-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
            Processing
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500">
            <Terminal className="w-6 h-6 mb-2" />
            <p className="text-xs">No logs yet</p>
          </div>
        ) : (
          logs.map((log, i) => (
            <LogRow key={log._id || i} log={log} index={i} />
          ))
        )}
      </div>
    </div>
  );
}