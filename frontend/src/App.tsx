import React, { useState } from "react";
import InputPanel from "./components/InputPanel";
import TaskTable from "./components/TaskTable";
import LogsPanel from "./components/LogsPanel";
import ImpactPanel from "./components/ImpactPanel";
import { AlertCircle, X, ShieldCheck } from "lucide-react";

export default function App() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Called after Gemini returns response
  const handleWorkflowSuccess = (data: any) => {
    if (!data) return;

    // sort tasks
    const sortedTasks = Array.isArray(data.tasks)
      ? data.tasks.sort(
          (a: any, b: any) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
        )
      : [];

    // sort logs
    const sortedLogs = Array.isArray(data.logs)
      ? data.logs.sort(
          (a: any, b: any) =>
            new Date(b.timestamp || 0).getTime() -
            new Date(a.timestamp || 0).getTime()
        )
      : [];

    setTasks(sortedTasks);
    setLogs(sortedLogs);
  };

  const handleError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      
      {/* Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5" />
          <div className="flex-1 text-sm">{error}</div>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold">
                Autonomous Enterprise Agent
              </h1>
              <p className="text-[10px] text-zinc-500 uppercase">
                System Dashboard 
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Layout */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">

          {/* LEFT */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <InputPanel
              onSuccess={handleWorkflowSuccess}
              onError={handleError}
              setLoading={setIsLoading}   // ✅ important
            />
            <ImpactPanel taskCount={tasks.length} />
          </div>

          {/* TASKS */}
          <div className="lg:col-span-4">
            <TaskTable tasks={tasks} isLoading={isLoading} />
          </div>

          {/* LOGS */}
          <div className="lg:col-span-4">
            <LogsPanel logs={logs} isLoading={isLoading} />
          </div>

        </div>
      </main>
    </div>
  );
}