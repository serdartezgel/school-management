"use client";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

interface Task {
  id: string;
  title: string;
  type: string; // "exam" | "assignment"
  dueDate: string;
  className?: string;
  subject?: string;
  graded: boolean;
}

interface PendingTasksCardProps {
  tasks?: Task[];
}

const PendingTasksCard = ({ tasks = [] }: PendingTasksCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pending Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-muted-foreground">No pending tasks 🎉</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="hover:bg-muted flex justify-between rounded-md border px-4 py-2"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {task.type === "assignment" ? "Assignment" : "Exam"}{" "}
                    {task.subject ? `- ${task.subject}` : ""}{" "}
                    {task.className ? `(${task.className})` : ""}
                  </p>
                </div>
                <div className="text-muted-foreground text-sm">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </div>
              </li>
            ))}
          </ul>
        )}

        <Separator className="my-2" />

        <p className="text-muted-foreground text-sm">
          Total pending: {tasks.length}
        </p>
      </CardContent>
    </Card>
  );
};

export default PendingTasksCard;
