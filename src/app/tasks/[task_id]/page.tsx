"use client";

import { useState } from "react";
import TaskIntro from "@/app/components/tasks/TaskIntro";
import TaskExecution from "@/app/components/tasks/TaskExecution";

export default function TaskPage() {
  const [started, setStarted] = useState(false);

  return started ? <TaskExecution /> : <TaskIntro onStart={() => setStarted(true)} />;
}