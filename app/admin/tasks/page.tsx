"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [{ data: tasks }, { data: projects }, { data: users }] = await Promise.all([
        supabase.from("tasks").select("id, description, project_id, assigned_to, created_by, priority, status"),
        supabase.from("projects").select("id, name"),
        supabase.from("users").select("id, full_name, email"),
      ]);
      setTasks(tasks || []);
      setProjects(projects || []);
      setUsers(users || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Get unique priorities for tabs
  const priorities = Array.from(new Set(tasks.map((task) => task.priority).filter(Boolean)));

  // Helper functions
  const getProjectName = (projectId: string) =>
    projects.find((p) => String(p.id) === String(projectId))?.name || "N/A";
  const getUserName = (userId: string) =>
    users.find((u) => String(u.id) === String(userId))?.full_name || "N/A";
  const getUserEmail = (userId: string) =>
    users.find((u) => String(u.id) === String(userId))?.email || "";

  // Filter tasks by priority
  const filterTasks = (priority?: string) =>
    priority
      ? tasks.filter((task) => String(task.priority).toLowerCase() === String(priority).toLowerCase())
      : tasks;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {priorities.map((priority) => (
            <TabsTrigger key={priority} value={priority}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>All tasks in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading...</div>
              ) : tasks.length === 0 ? (
                <div className="text-muted-foreground text-sm">No tasks found.</div>
              ) : (
                <div className="grid gap-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col gap-1 p-4 border rounded"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{task.description}</span>
                        <Badge variant="outline">{task.priority}</Badge>
                        <Badge variant="secondary">{task.status}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs mt-1 text-muted-foreground">
                        <span>
                          Project: <span className="font-semibold">{getProjectName(task.project_id)}</span>
                        </span>
                        <span>
                          Assigned to: <span className="font-semibold">{getUserName(task.assigned_to)}</span>
                          {getUserEmail(task.assigned_to) && (
                            <span className="ml-1">({getUserEmail(task.assigned_to)})</span>
                          )}
                        </span>
                        <span>
                          Assigned by: <span className="font-semibold">{getUserName(task.created_by)}</span>
                          {getUserEmail(task.created_by) && (
                            <span className="ml-1">({getUserEmail(task.created_by)})</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {priorities.map((priority) => (
          <TabsContent key={priority} value={priority} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{priority.charAt(0).toUpperCase() + priority.slice(1)} Priority Tasks</CardTitle>
                <CardDescription>
                  Tasks with priority: {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div>Loading...</div>
                ) : filterTasks(priority).length === 0 ? (
                  <div className="text-muted-foreground text-sm">No tasks found.</div>
                ) : (
                  <div className="grid gap-4">
                    {filterTasks(priority).map((task) => (
                      <div
                        key={task.id}
                        className="flex flex-col gap-1 p-4 border rounded"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{task.description}</span>
                          <Badge variant="outline">{task.priority}</Badge>
                          <Badge variant="secondary">{task.status}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs mt-1 text-muted-foreground">
                          <span>
                            Project: <span className="font-semibold">{getProjectName(task.project_id)}</span>
                          </span>
                          <span>
                            Assigned to: <span className="font-semibold">{getUserName(task.assigned_to)}</span>
                            {getUserEmail(task.assigned_to) && (
                              <span className="ml-1">({getUserEmail(task.assigned_to)})</span>
                            )}
                          </span>
                          <span>
                            Assigned by: <span className="font-semibold">{getUserName(task.created_by)}</span>
                            {getUserEmail(task.created_by) && (
                              <span className="ml-1">({getUserEmail(task.created_by)})</span>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}