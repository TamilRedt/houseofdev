export type ProjectHealth = {
  key: "healthy" | "attention" | "at_risk" | "completed";
  label: string;
  score: number;
  reasons: string[];
};

type ProjectHealthInput = {
  status: string;
  progress: number;
  dueDate: string | null;
  openTasks: number;
  employeeCount: number;
  updateCount: number;
  lastUpdateAt: string | null;
};

const DAY = 24 * 60 * 60 * 1000;

export function reviewProjectHealth(input: ProjectHealthInput): ProjectHealth {
  const status = input.status.toLowerCase();

  if (["completed", "closed"].includes(status)) {
    return {
      key: "completed",
      label: "Completed",
      score: 100,
      reasons: ["Delivery is marked complete."],
    };
  }

  let score = 100;
  const reasons: string[] = [];
  const now = Date.now();
  const dueAt = input.dueDate ? new Date(`${input.dueDate}T23:59:59+05:30`).getTime() : null;
  const daysToDue = dueAt == null ? null : Math.ceil((dueAt - now) / DAY);

  if (input.employeeCount === 0) {
    score -= 25;
    reasons.push("No employee is assigned to the project.");
  }

  if (dueAt != null && dueAt < now) {
    score -= 35;
    reasons.push("The delivery date has passed.");
  } else if (daysToDue != null && daysToDue <= 7 && input.progress < 70) {
    score -= 25;
    reasons.push(`Only ${Math.max(daysToDue, 0)} day(s) remain and progress is below 70%.`);
  } else if (daysToDue != null && daysToDue <= 14 && input.progress < 40) {
    score -= 15;
    reasons.push("The deadline is within two weeks and progress is below 40%.");
  }

  if (input.openTasks >= 8) {
    score -= 15;
    reasons.push(`${input.openTasks} tasks are still open.`);
  } else if (input.openTasks >= 4) {
    score -= 8;
    reasons.push(`${input.openTasks} tasks still need attention.`);
  }

  if (input.updateCount === 0) {
    score -= 15;
    reasons.push("No employee progress update has been submitted.");
  } else if (input.lastUpdateAt) {
    const daysSinceUpdate = Math.floor((now - new Date(input.lastUpdateAt).getTime()) / DAY);
    if (daysSinceUpdate >= 7) {
      score -= 15;
      reasons.push(`The latest project update is ${daysSinceUpdate} days old.`);
    } else if (daysSinceUpdate >= 3) {
      score -= 6;
      reasons.push(`No fresh update has been posted for ${daysSinceUpdate} days.`);
    }
  }

  if (input.progress === 0 && status !== "new") {
    score -= 10;
    reasons.push("The project has started but progress is still 0%.");
  }

  score = Math.max(0, Math.min(100, score));

  if (!reasons.length) reasons.push("Progress, staffing, tasks, and update activity look healthy.");

  if (score < 50) return { key: "at_risk", label: "At risk", score, reasons };
  if (score < 75) return { key: "attention", label: "Needs attention", score, reasons };
  return { key: "healthy", label: "Healthy", score, reasons };
}
