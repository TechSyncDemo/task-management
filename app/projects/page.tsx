"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Search, Plus, Users, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"



const mockProjects = [
  {
    id: 5,
    name: "CRM Implementation",
    description: "Implement new CRM system",
    progress: 100,
    members: 6,
    tasks: 20,
    completedTasks: 20,
    dueDate: "2023-04-30",
    status: "completed",
  },
 
]

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  members: number;
  completedTasks: number;
  tasks: number;
  due_date: string;
}


export default function ProjectsPage() {
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("")

   //const [activeProjects, setActiveProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("projects").select("*");

      if (error) {
        console.error("Error fetching projects:", error.message);
      } else {
        setActiveProjects(data as Project[]);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <p>Loading projects...</p>;
  }

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

 // const activeProjects = filteredProjects.filter((project) => project.status === "active")
  const completedProjects = filteredProjects.filter((project) => project.status === "completed")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <Link href="/createproject">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="completed">Completed Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeProjects.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm text-muted-foreground">No active projects found</p>
              </div>
            </div>
          ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {activeProjects.map((project) => (
        <Card key={project.id}>
          <CardHeader className="pb-2">
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>{project.members} members</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>{project.completedTasks}/{project.tasks} tasks</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              <span>Due: {new Date(project.due_date).toLocaleDateString()}</span>
            </div>
            <Button variant="outline" className="w-full">
              View Project
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedProjects.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm text-muted-foreground">No completed projects found</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{project.members} members</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>
                          {project.completedTasks}/{project.tasks} tasks
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>Completed: {new Date(project.dueDate).toLocaleDateString()}</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      View Project
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}