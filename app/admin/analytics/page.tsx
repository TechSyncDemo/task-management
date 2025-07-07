"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabaseClient";

export default function AnalyticsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [{ data: users }, { data: tasks }] = await Promise.all([
        supabase.from("users").select("id, full_name, email, position, role"),
        supabase.from("tasks").select("id, assigned_to, status"),
      ]);
      setUsers(users?.filter((u) => u.role === "staff") || []);
      setTasks(tasks || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Helper to get progress for a user
  const getUserProgress = (userId: string) => {
    const userTasks = tasks.filter((t) => String(t.assigned_to) === String(userId));
    const total = userTasks.length;
    const completed = userTasks.filter(
      (t) => t.status && t.status.toLowerCase() === "completed"
    ).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Staff Progress Analytics</h2>
      <Card>
        <CardHeader>
          <CardTitle>Team Progress</CardTitle>
          <CardDescription>
            Progress of each staff member based on their assigned tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-muted-foreground text-sm">No staff users found.</div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => {
                const { total, completed, percent } = getUserProgress(user.id);
                return (
                  <div key={user.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{user.full_name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{user.position}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{user.email}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {completed}/{total} completed ({percent}%)
                      </span>
                    </div>
                    <Progress value={percent} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}