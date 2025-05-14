"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Search, Plus, Users, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Redesign the company website with modern UI/UX",
    progress: 75,
    members: 5,
    tasks: 12,
    completedTasks: 9,
    dueDate: "2023-06-15",
    status: "active",
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Develop a mobile app for iOS and Android",
    progress: 45,
    members: 8,
    tasks: 24,
    completedTasks: 11,
    dueDate: "2023-07-30",
    status: "active",
  },
  {
    id: 3,
    name: "Marketing Campaign",
    description: "Q2 digital marketing campaign",
    progress: 90,
    members: 3,
    tasks: 15,
    completedTasks: 13,
    dueDate: "2023-05-31",
    status: "active",
  },
  {
    id: 4,
    name: "Database Migration",
    description: "Migrate from legacy database to new system",
    progress: 30,
    members: 4,
    tasks: 18,
    completedTasks: 5,
    dueDate: "2023-08-15",
    status: "active",
  },
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
  {
    id: 6,
    name: "Security Audit",
    description: "Perform security audit and implement recommendations",
    progress: 100,
    members: 3,
    tasks: 10,
    completedTasks: 10,
    dueDate: "2023-03-15",
    status: "completed",
  },
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeProjects = filteredProjects.filter((project) => project.status === "active")
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
                        <span>
                          {project.completedTasks}/{project.tasks} tasks
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
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
