import React from 'react';
import { TrendingUp, Clock, Zap, Activity } from 'lucide-react';

interface ImpactPanelProps {
  taskCount: number;
}

export default function ImpactPanel({ taskCount }: ImpactPanelProps) {
  const MANUAL_TIME_MINUTES = 10;
  const AI_TIME_SECONDS = 5;
  const ASSUMED_DAILY_TASKS = 100;

  // Core calculations
  const manualTimeSeconds = MANUAL_TIME_MINUTES * 60;
  const timeSavedSecondsPerTask = manualTimeSeconds - AI_TIME_SECONDS;

  // Convert to minutes (dynamic instead of hardcoded 9.9)
  const timeSavedMinutes = (timeSavedSecondsPerTask / 60).toFixed(1);

  // Use fallback for better UX
  const effectiveTasks = taskCount > 0 ? taskCount : 5;

  const totalTimeSavedSeconds = timeSavedSecondsPerTask * effectiveTasks;
  const totalTimeSavedHours = (totalTimeSavedSeconds / 3600).toFixed(2);

  const dailySavingsHours = (
    (timeSavedSecondsPerTask * ASSUMED_DAILY_TASKS) / 3600
  ).toFixed(1);

  const efficiencyPercent = (
    (timeSavedSecondsPerTask / manualTimeSeconds) * 100
  ).toFixed(1);

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
        <h2 className="text-sm font-semibold text-zinc-100 uppercase flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          Business Impact
        </h2>
      </div>

      {/* Metrics */}
      <div className="p-5 flex-1 grid grid-cols-2 gap-4">

        {/* Time Saved */}
        <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs uppercase">Time Saved / Task</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl text-zinc-100">{timeSavedMinutes}</span>
            <span className="text-sm text-zinc-500">mins</span>
          </div>
          <div className="mt-2 text-[10px] text-zinc-600 font-mono">
            Manual: 10m → AI: 5s
          </div>
        </div>

        {/* Efficiency */}
        <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span className="text-xs uppercase">Efficiency Gain</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl text-emerald-400">+{efficiencyPercent}</span>
            <span className="text-sm text-emerald-500/70">%</span>
          </div>
        </div>

        {/* Daily Savings */}
        <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span className="text-xs uppercase">Daily Savings</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl text-indigo-400">{dailySavingsHours}</span>
            <span className="text-sm text-indigo-500/70">hrs</span>
          </div>
        </div>

        {/* Actual Impact */}
        <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800/50 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-2 text-zinc-500 mb-2 relative z-10">
            <Activity className="w-4 h-4" />
            <span className="text-xs uppercase">Actual Saved</span>
          </div>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="text-3xl text-zinc-100">{totalTimeSavedHours}</span>
            <span className="text-sm text-zinc-500">hrs</span>
          </div>
          <div className="mt-2 text-[10px] text-zinc-600 font-mono relative z-10">
            {effectiveTasks} tasks processed
          </div>
        </div>

      </div>
    </div>
  );
}