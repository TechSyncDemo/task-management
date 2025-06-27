"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, ListTodo, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function DashboardPage() {

  interface UserProject {
  id: number;
  name: string;
  progress: number;
  due_date: string; 
  daysLeft?: number;
  description?: string; 
}


   const [projects, setProjects] = useState<UserProject []>([]);
   const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [progress, setProgress] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState(0);
  const [upcomingProjects, setUpcomingProjects] = useState<UserProject[]>([]);




  useEffect(() => {
    const fetchTaskCounts = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Error fetching user:", userError);
        return;
      }

      console.log("👤 Logged in user ID:", user.id);
      const userId = user.id;

      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("status, created_by, due_date") // fetch more fields for debugging
        .eq("created_by", userId);

      if (tasksError) {
        console.error("❌ Error fetching tasks:", tasksError);
        return;
      }
      const now = new Date();


      console.log("📦 Fetched tasks:", tasks);
      console.log("🧪 Supabase returned projects:", projects);

      const total = tasks.length;
      const completed = tasks.filter(
        (task) => task.status?.toLowerCase() === "completed"
      ).length;
      const progress = tasks.filter(
        (task) => task.status?.toLowerCase() === "in progress"
      ).length;
      const overdue = tasks.filter((task) => {
      const dueDate = new Date(task.due_date);
      return dueDate < now && task.status?.toLowerCase() !== "completed";
    }).length;

      console.log("✅ Total:", total);
      console.log("✅ Completed:", completed);

      setTotalTasks(total);
      setCompletedTasks(completed);
      setProgress(progress);
      setOverdueTasks(overdue);
    };

    fetchTaskCounts(); 
  }, []); 


  useEffect(() => {
    const fetchProjects = async () => {
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("id, name, due_date");

      if (projectsError) {
        console.error(projectsError);
        return;
      }

      const calculatedProjects = await Promise.all(
        projectsData.map(async (project) => {
          const { data: tasks, error: tasksError } = await supabase
            .from("tasks")
            .select("status")
            .eq("project_id", project.id);

          if (tasksError) {
            console.error(tasksError);
            return { ...project, progress: 0 , due_date: project.due_date }; // Return project with 0% progress if error
          }

          // const total = tasks.length;
          // const completed = tasks.filter((t) => t.status === "Completed").length;
          // const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
          
          return {
            ...project,
            progress,
               due_date: project.due_date, 
            
          };
        })
      );

      setProjects(calculatedProjects);
    };

    fetchProjects();
  }, []);



  useEffect(() => {
  const fetchUpcomingProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, due_date, description");

    if (error || !data) {
      console.error("❌ Error fetching upcoming projects:", error);
      return;
    }

    const now = new Date();

    const upcoming = data
      .map((project) => {
        const dueDate = new Date(project.due_date);
        const timeDiff = dueDate.getTime() - now.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        return {
          ...project,
           progress: 0,
          daysLeft,
        };
      })
      .filter((p) => p.daysLeft >= 0 && p.daysLeft <= 7)
      .sort((a, b) => a.daysLeft - b.daysLeft);

    setUpcomingProjects(upcoming);
  };

  fetchUpcomingProjects();
}, []);


  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Link href="/tasks/new">
            <Button>Create Task</Button>
          </Link>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <ListTodo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTasks}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTasks}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progress}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overdueTasks}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
             <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{project.name}</span>
                <span className="text-sm text-muted-foreground">
                  {project.progress}%
                </span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card className="col-span-3">
  <CardHeader>
    <CardTitle>Upcoming Deadlines</CardTitle>
    <CardDescription>Tasks due in the next 7 days</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {upcomingProjects.length === 0 ? (
        <p className="text-muted-foreground">No upcoming projects</p>
      ) : (
        upcomingProjects.map((project) => (
          <div key={project.id} className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{project.name}</p>
              {project.description && (
                <p className="text-sm text-muted-foreground">{project.description}</p>
              )}
            </div>
            <div
              className={`text-sm font-medium ${
                project.daysLeft === 0 ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              {project.daysLeft === 0
                ? "Today"
                : project.daysLeft === 1
                ? "Tomorrow"
                : `In ${project.daysLeft} days`}
            </div>
          </div>
        ))
      )}
    </div>
  </CardContent>
</Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
