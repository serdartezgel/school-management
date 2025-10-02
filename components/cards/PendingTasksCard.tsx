"use client";

import Link from "next/link";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

const PendingTasksCard = ({
  tasks = [],
}: {
  tasks: TeacherTasks[] | StudentTasks[];
}) => {
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
                  <Link
                    href={
                      task.type === "assignment" ? "/assignments" : "/exams"
                    }
                    className="font-medium"
                  >
                    {task.title}
                  </Link>
                  <p className="text-muted-foreground text-sm">
                    {task.type === "assignment" ? "Assignment" : "Exam"}{" "}
                    {task.subject ? `- ${task.subject}` : ""}{" "}
                    {task.className ? `(${task.className})` : ""}
                  </p>
                </div>
                <div className="text-muted-foreground text-sm">
                  {task.date
                    ? new Date(task.date).toLocaleDateString(undefined, {
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
