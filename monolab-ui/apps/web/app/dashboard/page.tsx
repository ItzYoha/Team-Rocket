"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {

/* ---------------- TASK STATE ---------------- */

/* ---------------- REFINED TASK STATE ---------------- */
const [taskInput, setTaskInput] = useState("");
const [tasks, setTasks] = useState<{ id: string; text: string; done: boolean }[]>([]);

useEffect(() => {
  const saved = localStorage.getItem("tasks");
  if (saved) setTasks(JSON.parse(saved));
}, []);

useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);

const addTask = () => {
  if (!taskInput.trim()) return;
  const newTask = {
    id: crypto.randomUUID(), // Generates a unique ID
    text: taskInput,
    done: false
  };
  setTasks([newTask, ...tasks]); // Adds new task to the top
  setTaskInput("");
};

const toggleTask = (id: string) => {
  setTasks(tasks.map(task => 
    task.id === id ? { ...task, done: !task.done } : task
  ));
};

const deleteTask = (id: string) => {
  setTasks(tasks.filter(task => task.id !== id));
};

const clearCompleted = () => {
  setTasks(tasks.filter(task => !task.done));
};

/* ---------------- TIMER ---------------- */

/* ---------------- ENHANCED TIMER STATE ---------------- */
const [time, setTime] = useState(1500); // 25 minutes default
const [running, setRunning] = useState(false);
const [initialTime, setInitialTime] = useState(1500); // Track for reset logic
const [isPickerOpen, setIsPickerOpen] = useState(false);
const [customTime, setCustomTime] = useState({ hh: 0, mm: 25, ss: 0 });

const handleCustomSubmit = () => {
  const totalSeconds = (customTime.hh * 3600) + (customTime.mm * 60) + customTime.ss;
  if (totalSeconds > 0) {
    setRunning(false);
    setTime(totalSeconds);
    setInitialTime(totalSeconds);
    setIsPickerOpen(false);
  }
};
useEffect(() => {
  let interval: NodeJS.Timeout;
  if (running && time > 0) {
    interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);
  } else if (time === 0) {
    setRunning(false);
  }
  return () => clearInterval(interval);
}, [running, time]);

const minutes = Math.floor(time / 60);
const seconds = time % 60;

// Dynamic Adjustment Controls
const adjustTime = (amount: number) => {
  setTime((prev) => Math.max(0, prev + amount));
  // If timer isn't running, update the "base" time for resets
  if (!running) setInitialTime((prev) => Math.max(0, prev + amount));
};

const setPreset = (mins: number) => {
  setRunning(false);
  const newSeconds = mins * 60;
  setTime(newSeconds);
  setInitialTime(newSeconds);
};

const resetTimer = () => {
  setRunning(false);
  setTime(initialTime);
};

/* ---------------- UI ---------------- */

return (
<main className="min-h-screen bg-background text-foreground p-10">

  <h1 className="text-4xl font-bold text-center mb-10">
    AI Productivity Planner
  </h1>


  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


  {/* ---------------- TASK MANAGER (REFINED) ---------------- */}
<div className="rounded-xl border border-border bg-secondary/40 p-6 space-y-4 flex flex-col h-[480px]">
  <div className="flex justify-between items-center">
    <h2 className="text-xl font-semibold">Tasks</h2>
    {tasks.some(t => t.done) && (
      <button 
        onClick={clearCompleted}
        className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors"
      >
        Clear Done
      </button>
    )}
  </div>

  <div className="flex gap-2">
    <input
      type="text"
      placeholder="What's the plan?"
      value={taskInput}
      onChange={(e) => setTaskInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && addTask()}
      className="flex-1 rounded-md border border-border/20 bg-background px-4 py-2 text-sm text-foreground focus:ring-1 focus:ring-white/20 outline-none transition-all"
    />
    <button
      onClick={addTask}
      className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-bold hover:opacity-90 transition-opacity"
    >
      +
    </button>
  </div>

  {/* Scrollable List Area */}
  <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
    {tasks.length === 0 ? (
      <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50 italic text-sm">
        No tasks yet. Take it easy.
      </div>
    ) : (
      tasks.map((task) => (
        <div 
          key={task.id} 
          className="group flex items-center justify-between p-3 rounded-lg border border-white/5 bg-background/30 hover:border-white/20 transition-all"
        >
          <label className="flex items-center gap-3 cursor-pointer flex-1">
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 checked:bg-foreground transition-all"
            />
            <span className={`text-sm transition-all ${task.done ? "line-through opacity-30 text-zinc-500" : "text-zinc-200"}`}>
              {task.text}
            </span>
          </label>
          
          <button
            onClick={() => deleteTask(task.id)}
            className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all px-2"
          >
            ✕
          </button>
        </div>
      ))
    )}
  </div>
</div>



  {/* ---------------- AI TASK BREAKDOWN ---------------- */}

  <div className="rounded-xl border border-border bg-secondary/40 p-6 space-y-4">

    <h2 className="text-xl font-semibold">AI Task Breakdown</h2>

    <input
      type="text"
      placeholder="Enter big task..."
      className="w-full rounded-md border border-border/20 bg-background px-4 py-2 text-sm text-foreground"
    />

    <button className="rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 w-full">
      Generate Steps
    </button>


    <div className="relative flex w-full items-start gap-3 rounded-lg border border-border bg-secondary/70 px-4 py-3 text-sm text-foreground">

      <span className="mt-0.5 flex h-5 w-5 items-center justify-center text-foreground">
        ℹ️
      </span>

      <div className="space-y-1">
        <h3 className="font-semibold leading-none tracking-tight">
          AI Planner
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter a complex task and AI will break it into actionable steps.
        </p>
      </div>

    </div>

  </div>



  {/* ---------------- FOCUS TIMER (REFINED) ---------------- */}
<div className="rounded-xl border border-border bg-secondary/40 p-6 space-y-6 flex flex-col items-center">
  <div className="w-full flex justify-between items-center">
    <h2 className="text-xl font-semibold">Focus Timer</h2>
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${running ? "bg-green-500/10 text-green-500" : "bg-zinc-500/10 text-zinc-500"}`}>
      {running ? "Session Active" : "Idle"}
    </span>
  </div>

  {/* Replace your previous aesthetic time display div with this */}
<div className="flex flex-col items-center gap-2 py-4 group">
  <div className="text-6xl font-black tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
    {/* If hh > 0, you might want to adjust this display logic */}
    {Math.floor(time / 3600) > 0 && `${Math.floor(time / 3600)}:`}
    {minutes % 60 < 10 ? "0" + (minutes % 60) : (minutes % 60)}:
    {seconds < 10 ? "0" + seconds : seconds}
  </div>
  
  <button 
    onClick={() => setIsPickerOpen(true)}
    className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
  >
    <span>Edit Duration</span>
  </button>
</div>

  {/* Quick Mode Presets */}
  <div className="grid grid-cols-3 gap-2 w-full">
    {[15, 25, 50].map((m) => (
      <button
        key={m}
        onClick={() => setPreset(m)}
        className="py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md border border-border/40 hover:bg-foreground hover:text-background transition-all"
      >
        {m}m
      </button>
    ))}
  </div>

  {/* Main Controls */}
  <div className="flex gap-3 w-full">
    <button
      onClick={() => setRunning(!running)}
      className={`flex-1 rounded-md py-3 text-sm font-bold transition-all ${
        running 
        ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20" 
        : "bg-foreground text-background hover:opacity-90 shadow-lg"
      }`}
    >
      {running ? "PAUSE" : "START FOCUS"}
    </button>

    <button
      onClick={resetTimer}
      className="px-4 rounded-md border border-border/40 hover:bg-white/5 transition-colors text-lg"
    >
      ↺
    </button>
  </div>
  
  <p className="text-[10px] text-zinc-500 text-center italic font-medium">
    “Stay focused. One step at a time.”
  </p>
</div>

  </div>
  {/* ---------------- TIME PICKER MODAL ---------------- */}
{isPickerOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
    <div className="w-full max-w-sm rounded-2xl border border-border bg-secondary p-8 shadow-2xl space-y-6">
      <h3 className="text-xl font-bold text-center">Set Custom Timer</h3>
      
      <div className="flex justify-center gap-4 text-center">
        {['hh', 'mm', 'ss'].map((unit) => (
          <div key={unit} className="space-y-2">
            <input
              type="number"
              min="0"
              max={unit === 'hh' ? '99' : '59'}
              value={customTime[unit as keyof typeof customTime]}
              onChange={(e) => setCustomTime({ ...customTime, [unit]: parseInt(e.target.value) || 0 })}
              className="w-16 rounded-lg border border-border bg-background py-3 text-center text-xl font-bold focus:ring-1 focus:ring-white/20 outline-none"
            />
            <p className="text-[10px] uppercase text-zinc-500 font-bold">{unit}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setIsPickerOpen(false)}
          className="flex-1 rounded-md border border-border py-2 text-sm font-medium hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCustomSubmit}
          className="flex-1 rounded-md bg-foreground text-background py-2 text-sm font-bold hover:opacity-90 transition-opacity"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
)}

</main>
);
}
