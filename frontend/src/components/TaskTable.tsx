import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface Task {
  _id: string;
  type: string;
  status: string;
  created_at: string;
}

interface TaskTableProps {
  tasks: Task[];
  isLoading: boolean;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig: Record<string, { color: string, icon: React.ReactNode, label: string }> = {
    completed: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Completed' },
    pending: { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: <Clock className="w-3 h-3" />, label: 'Pending' },
    failed: { color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', icon: <XCircle className="w-3 h-3" />, label: 'Failed' },
    processing: { color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', icon: <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />, label: 'Processing' },
  };

  const config = statusConfig[status.toLowerCase()] || { color: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20', icon: <AlertCircle className="w-3 h-3" />, label: status };

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", config.color)}>
      {config.icon}
      {config.label}
    </span>
  );
};

export default function TaskTable({ tasks, isLoading }: TaskTableProps) {
  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
        <h2 className="text-sm font-semibold text-zinc-100 tracking-wide uppercase flex items-center gap-2">
          Generated Tasks
          <span className="bg-zinc-800 text-zinc-400 py-0.5 px-2 rounded-full text-[10px] font-mono">{tasks.length}</span>
        </h2>
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <div className="w-3 h-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
            Syncing
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-auto">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-zinc-600" />
            </div>
            <p className="text-sm font-medium text-zinc-400">No tasks generated yet</p>
            <p className="text-xs mt-1">Run the pipeline to see tasks appear here.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 z-10">
              <tr>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider w-1/3">Type</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider w-1/3">Status</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider w-1/3 text-right">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-zinc-300 group-hover:bg-zinc-700 transition-colors">
                        <span className="text-xs font-mono">{task.type.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium text-zinc-300">{task.type.replace(/_/g, ' ')}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-xs font-mono text-zinc-500">
                      {
                        task.created_at && !isNaN(new Date(task.created_at).getTime())
                        ? format(new Date(task.created_at), 'MMM d, HH:mm:ss')
                        : 'Invalid Date'
                      }
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
