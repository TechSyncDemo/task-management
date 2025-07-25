"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ListTodo, Users, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboardPage() {
  type TeamMember = {
    id: string;
    full_name: string;
    email: string;
    position: string;
    role: string;
  };

  type Project = {
    id: string;
    name: string;
    due_date: string;
    severity: string;
  };

  // const [team, setTeam] = useState([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [totalProjects, setTotalProjects] = useState(0);
  const [activeTasks, setActiveTasks] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [projectProgress, setProjectProgress] = useState<
    {
      id: string;
      name: string;
      total: number;
      completed: number;
      percent: number;
    }[]
  >([]);
  const [teamPerformance, setTeamPerformance] = useState<
    { position: string; percent: number; completed: number; total: number }[]
  >([]);
  const today = new Date();

  useEffect(() => {
    const fetchProjectProgress = async () => {
      // Fetch all projects
      const { data: projects, error: projectError } = await supabase
        .from("projects")
        .select("id, name");

      // Fetch all tasks
      const { data: tasks, error: taskError } = await supabase
        .from("tasks")
        .select("id, project_id, status");

      if (!projectError && !taskError && projects && tasks) {
        const progress = projects.map((project) => {
          const projectTasks = tasks.filter((t) => t.project_id === project.id);
          const total = projectTasks.length;
          const completed = projectTasks.filter(
            (t) => t.status && t.status.toLowerCase() === "completed"
          ).length;
          return {
            id: project.id,
            name: project.name,
            total,
            completed,
            percent: total ? Math.round((completed / total) * 100) : 0,
          };
        });
        setProjectProgress(progress);
      }
    };
    fetchProjectProgress();
  }, []);

  useEffect(() => {
    const fetchPerformance = async () => {
      // 1. Fetch all staff with position
      const { data: users, error: userError } = await supabase
        .from("users")
        .select("id, position")
        .eq("role", "staff");

      // 2. Fetch all tasks
      const { data: tasks, error: taskError } = await supabase
        .from("tasks")
        .select("id, assigned_to, status");

      if (!userError && !taskError && users && tasks) {
        // 3. Group users by position
        const positionMap: { [position: string]: string[] } = {};
        users.forEach((u) => {
          if (!u.position) return;
          if (!positionMap[u.position]) positionMap[u.position] = [];
          positionMap[u.position].push(u.id);
        });

        // 4. For each position, calculate completion %
        const perf = Object.entries(positionMap).map(([position, ids]) => {
          const userTasks = tasks.filter((t) => ids.includes(t.assigned_to));
          const total = userTasks.length;
          const completed = userTasks.filter(
            (t) => t.status && t.status.toLowerCase() === "completed"
          ).length;
          return {
            position,
            percent: total ? Math.round((completed / total) * 100) : 0,
            completed,
            total,
          };
        });

        // 5. Sort by percent descending
        perf.sort((a, b) => b.percent - a.percent);

        setTeamPerformance(perf);
      }
    };
    fetchPerformance();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, due_date, severity"); // adjust if your status field is different
      if (!error) {
        setProjects(data || []);
        setTotalProjects(data ? data.length : 0);
      }

      // setProjects(data || []);
      setProjectsLoading(false);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTeamCount = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("role", "staff");
      if (!error) {
        setTeamCount(data.length); // If not using head: true
        // OR if using head: true, use: setTeamCount(data.count);
      }
    };
    fetchTeamCount();
  }, []);

  const activeProjects = projects.filter((project) => {
    if (!project.due_date) return false;
    return new Date(project.due_date) >= today;
  });

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users") // or 'users_role' if that's your table
        .select("id, full_name, email, position, role")
        .eq("role", "staff"); // or whatever your staff role is
      if (!error) setTeam(data || []);
      setTeamCount(data ? data.length : 0);

      setLoading(false);
    };
    fetchTeam();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from("tasks").select("id, status");
      if (!error && data) {
        setActiveTasks(data.filter((t) => t.status === "In Progress").length);
        const completed = data.filter((t) => t.status === "Completed").length;
        setCompletionRate(
          data.length ? Math.round((completed / data.length) * 100) : 0
        );
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center gap-2">
          <Link href="/createproject">
            <Button>New Project</Button>
          </Link>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Projects
                </CardTitle>
                <ListTodo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProjects}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Tasks
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeTasks}</div>
                {/* <p className="text-xs text-muted-foreground">+8 from last week</p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamCount}</div>
                {/* <p className="text-xs text-muted-foreground">+4 from last month</p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate}%</div>
                {/* <p className="text-xs text-muted-foreground">+5% from last month</p> */}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
                <CardDescription>
                  Overview of all projects with progress
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-4">
                  {projectProgress.length === 0 ? (
                    <div className="text-muted-foreground text-sm">
                      No projects found.
                    </div>
                  ) : (
                    projectProgress.map((proj) => (
                      <div key={proj.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{proj.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({proj.completed}/{proj.total} tasks)
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {proj.percent}%
                          </span>
                        </div>
                        <Progress value={proj.percent} className="h-2" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Task completion by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamPerformance.length === 0 ? (
                    <div className="text-muted-foreground text-sm">
                      No data available.
                    </div>
                  ) : (
                    teamPerformance.map((perf) => (
                      <div key={perf.position} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{perf.position}</span>
                          <span className="text-sm text-muted-foreground">
                            {perf.percent}% ({perf.completed}/{perf.total}{" "}
                            completed)
                          </span>
                        </div>
                        <Progress value={perf.percent} className="h-2" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>
                Manage and monitor all ongoing projects
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-md border">
                {projectsLoading ? (
                  <div className="p-4">Loading projects...</div>
                ) : activeProjects.length === 0 ? (
                  <div className="p-4">No active projects found.</div>
                ) : (
                  activeProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center p-4 border-b last:border-b-0"
                    >
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{project.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="mx-2">•</span>
                          <span>
                            Due on{" "}
                            {project.due_date
                              ? new Date(project.due_date).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>           
          </Card>
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your team and their workload
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border">
                {loading ? (
                  <div className="p-4">Loading team members...</div>
                ) : (
                  team.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center p-4 border-b last:border-b-0"
                    >
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">
                          {member.full_name || member.email}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{member.position || "Staff"}</span>
                          <span className="mx-2">•</span>
                          <span>{member.email}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            {/* <CardContent className="space-y-4">
              <div className="rounded-md border">
                <div className="flex items-center p-4 border-b">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Sarah Johnson</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Design Lead</span>
                      <span className="mx-2">•</span>
                      <span>5 active tasks</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
                <div className="flex items-center p-4 border-b">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Michael Chen</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Senior Developer</span>
                      <span className="mx-2">•</span>
                      <span>8 active tasks</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
                <div className="flex items-center p-4 border-b">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Emily Rodriguez</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Marketing Manager</span>
                      <span className="mx-2">•</span>
                      <span>3 active tasks</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
                <div className="flex items-center p-4 border-b">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">David Kim</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Database Administrator</span>
                      <span className="mx-2">•</span>
                      <span>4 active tasks</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
                <div className="flex items-center p-4">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Jessica Lee</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Project Manager</span>
                      <span className="mx-2">•</span>
                      <span>6 active tasks</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent> */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
