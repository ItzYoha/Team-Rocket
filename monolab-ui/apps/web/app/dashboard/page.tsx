"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {

/* ---------------- TASK STATE ---------------- */

const [taskInput, setTaskInput] = useState("");
const [tasks, setTasks] = useState<{text:string, done:boolean}[]>([]);

useEffect(() => {
const saved = localStorage.getItem("tasks");
if (saved) setTasks(JSON.parse(saved));
}, []);

useEffect(() => {
localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);

const addTask = () => {
if (!taskInput.trim()) return;
setTasks([...tasks, { text: taskInput, done: false }]);
setTaskInput("");
};

const toggleTask = (index:number) => {
const updated = [...tasks];
if (updated[index]) {
  updated[index].done = !updated[index].done;
  setTasks(updated);
}
};

const deleteTask = (index:number) => {
const updated = [...tasks];
updated.splice(index,1);
setTasks(updated);
};

/* ---------------- TIMER ---------------- */

const [time,setTime] = useState(1500);
const [running,setRunning] = useState(false);

useEffect(()=>{
let interval:any;

if(running){
  interval=setInterval(()=>{
    setTime(prev=>prev-1);
  },1000);
}

return ()=>clearInterval(interval);
},[running]);

const minutes=Math.floor(time/60);
const seconds=time%60;

const resetTimer=()=>{
setRunning(false);
setTime(1500);
};

/* ---------------- UI ---------------- */

return (
<main className="min-h-screen bg-background text-foreground p-10">

  <h1 className="text-4xl font-bold text-center mb-10">
    AI Productivity Planner
  </h1>


  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


  {/* ---------------- TASK MANAGER ---------------- */}

  <div className="rounded-xl border border-border bg-secondary/40 p-6 space-y-4">

    <h2 className="text-xl font-semibold">Tasks</h2>

    <input
      type="text"
      placeholder="Enter task..."
      value={taskInput}
      onChange={(e)=>setTaskInput(e.target.value)}
      className="w-full rounded-md border border-border/20 bg-background px-4 py-2 text-sm text-foreground placeholder:text-foreground/50 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
    />

    <button
      onClick={addTask}
      className="rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 w-full"
    >
      Add Task
    </button>


    <div className="space-y-2">

    {tasks.map((task,index)=>(
      <div key={index} className="flex items-center justify-between">

        <label className="inline-flex items-center gap-2">

          <input
            type="checkbox"
            checked={task.done}
            onChange={()=>toggleTask(index)}
            className="h-4 w-4 cursor-pointer appearance-none rounded border border-border/30 bg-background checked:border-foreground checked:bg-foreground"
          />

          <span className={`text-sm ${task.done ? "line-through opacity-50":""}`}>
            {task.text}
          </span>

        </label>

        <button
          onClick={()=>deleteTask(index)}
          className="text-red-400 text-xs"
        >
          delete
        </button>

      </div>
    ))}

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



  {/* ---------------- FOCUS TIMER ---------------- */}

  <div className="rounded-xl border border-border bg-secondary/40 p-6 space-y-6">

    <h2 className="text-xl font-semibold">Focus Timer</h2>

    <div className="text-5xl font-bold text-center">
      {minutes}:{seconds <10 ? "0"+seconds : seconds}
    </div>

    <button
      onClick={()=>setRunning(!running)}
      className="rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 w-full"
    >
      {running ? "Pause Timer":"Start Timer"}
    </button>

    <button
      onClick={resetTimer}
      className="rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 w-full"
    >
      Reset
    </button>

    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
      Pomodoro Mode
    </span>

  </div>


  </div>

</main>
);
}
