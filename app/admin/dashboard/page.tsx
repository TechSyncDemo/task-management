"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, ListTodo, Users, BarChart3 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

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
  const today = new Date();

  useEffect(() => {
  const fetchProjects = async () => {
    setProjectsLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, due_date, severity"); // adjust if your status field is different
    if (!error) setProjects(data || []);
    setProjectsLoading(false);
  };


  fetchProjects();
}, []);

const activeProjects = projects.filter(project => {
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
      setLoading(false);
    };
    fetchTeam();
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
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <ListTodo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">64</div>
                <p className="text-xs text-muted-foreground">+8 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+4 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
                <CardDescription>Overview of all active projects</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Website Redesign</span>
                      </div>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Mobile App Development</span>
                      </div>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Marketing Campaign</span>
                      </div>
                      <span className="text-sm text-muted-foreground">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Database Migration</span>
                      </div>
                      <span className="text-sm text-muted-foreground">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">CRM Integration</span>
                      </div>
                      <span className="text-sm text-muted-foreground">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Development</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Design</span>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Marketing</span>
                      <span className="text-sm text-muted-foreground">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">QA</span>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
  <Card>
    <CardHeader>
      <CardTitle>Active Projects</CardTitle>
      <CardDescription>Manage and monitor all ongoing projects</CardDescription>
    </CardHeader>

    <CardContent className="space-y-4">
  <div className="rounded-md border">
    {projectsLoading ? (
      <div className="p-4">Loading projects...</div>
    ) : activeProjects.length === 0 ? (
      <div className="p-4">No active projects found.</div>
    ) : (
      activeProjects.map((project) => (
        <div key={project.id} className="flex items-center p-4 border-b last:border-b-0">
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



    {/* <CardContent className="space-y-4">
      <div className="rounded-md border">
        {projectsLoading ? (
          <div className="p-4">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-4">No active projects found.</div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="flex items-center p-4 border-b last:border-b-0">
              <div className="flex-1 space-y-1">
                <p className="font-medium">{project.name}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  {/* <span>Lead: {project.lead}</span> */}
                  {/* <span className="mx-2">•</span>
                  <span>
                    Due {project.due_date ? `on ${new Date(project.due_date).toLocaleDateString()}` : "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">{project.progress ?? 0}%</div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))
        )}
      </div> */}
    {/* </CardContent> */} 
  </Card>
</TabsContent>


        {/* <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>Manage and monitor all ongoing projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border">
                <div className="flex items-center p-4 border-b">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Website Redesign</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Lead: Sarah Johnson</span>
                      <span className="mx-2">•</span>
                      <span>Due in 2 weeks</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">75%</div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
                <div className="flex items-center p-4 border-b">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Mobile App Development</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Lead: Michael Chen</span>
                      <span className="mx-2">•</span>
                      <span>Due in 1 month</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">45%</div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
                <div className="flex items-center p-4 border-b">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Marketing Campaign</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Lead: Emily Rodriguez</span>
                      <span className="mx-2">•</span>
                      <span>Due in 1 week</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">90%</div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
                <div className="flex items-center p-4 border-b">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Database Migration</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Lead: David Kim</span>
                      <span className="mx-2">•</span>
                      <span>Due in 3 weeks</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">30%</div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
                <div className="flex items-center p-4">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">CRM Integration</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Lead: Jessica Lee</span>
                      <span className="mx-2">•</span>
                      <span>Due in 2 months</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">60%</div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team and their workload</CardDescription>
            </CardHeader>
             <CardContent className="space-y-4">
          <div className="rounded-md border">
            {loading ? (
              <div className="p-4">Loading team members...</div>
            ) : (
              team.map((member) => (
                <div key={member.id} className="flex items-center p-4 border-b last:border-b-0">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{member.full_name || member.email}</p>
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
  )
}
