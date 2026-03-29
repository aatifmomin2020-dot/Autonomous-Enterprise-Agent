import React, { useState } from "react";
import { runAgent } from "../services/gemini";
import { Play } from "lucide-react";
import { cn } from "../lib/utils";

interface InputPanelProps {
  onSuccess: (data: any) => void;
  onError: (msg: string) => void;
  setLoading: (val: boolean) => void;
}

const DEFAULT_JSON = JSON.stringify(
  {
    vendor_name: "Acme Corp",
    amount: 1500.5,
    currency: "USD",
  },
  null,
  2
);

export default function InputPanel({
  onSuccess,
  onError,
  setLoading,
}: InputPanelProps) {
  const [jsonInput, setJsonInput] = useState<string>(DEFAULT_JSON);
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      let payload: any;

      // JSON validation
      try {
        payload = JSON.parse(jsonInput);
      } catch {
        onError("Invalid JSON format");
        return;
      }

      // simulate failure
      if (simulateFailure) {
        delete payload.vendor_name;
      }

 
      const response = await runAgent(payload);

      // Gemini may return string → parse safely
      let data;
      try {
        data =
          typeof response === "string" ? JSON.parse(response) : response;
      } catch {
        throw new Error("Invalid AI response format");
      }

      onSuccess(data);

    } catch (error: any) {
      console.error("Gemini Error:", error);
      onError(error.message || "Failed to process workflow");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
        <h2 className="text-sm font-semibold text-zinc-100 uppercase">
          Workflow Input
        </h2>

        <label className="text-xs text-zinc-400 flex items-center gap-2 cursor-pointer hover:text-zinc-300">
          <input
            type="checkbox"
            checked={simulateFailure}
            onChange={(e) => setSimulateFailure(e.target.checked)}
            className="rounded border-zinc-700 bg-zinc-800 text-indigo-500"
          />
          Simulate Failure
        </label>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        
        <div className="flex-1 flex flex-col">
          <label className="text-xs text-zinc-500 mb-2 font-mono">
            invoice_payload.json
          </label>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="flex-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm font-mono text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            spellCheck={false}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm transition",
            isSubmitting
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          )}
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}

          {isSubmitting ? "Processing..." : "Run Autonomous Pipeline"}
        </button>
      </div>
    </div>
  );
}