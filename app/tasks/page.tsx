"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, AlertCircle, Plus, Search } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get current user ID from Supabase Auth
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      } else {
        setError("User not authenticated");
        setLoading(false);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!userId) return;
    
    const fetchTasks = async () => {
      setLoading(true)
      setError(null)
      
      console.log("Fetching tasks for user:", userId) // Debug log
      
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("assigned_to", userId)

      if (error) {
        setError("Failed to load tasks: " + error.message)
        console.error("Supabase error:", error)
      } else {
        console.log("Fetched tasks:", data) // Debug log
        setTasks(data || [])
      }
      setLoading(false)
    }

    fetchTasks()
  }, [userId]) // Added userId as dependency

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const todoTasks = filteredTasks.filter((task) => task.status === "Not Started")
  const inProgressTasks = filteredTasks.filter((task) => task.status === "In Progress")
  const completedTasks = filteredTasks.filter((task) => task.status === "Completed")

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        </div>
        <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
          <p className="text-sm text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        </div>
        <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        <Link href="/tasks/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter tasks by status, priority, or search term</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:w-[400px]">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks ({filteredTasks.length})</TabsTrigger>
          <TabsTrigger value="todo">To Do ({todoTasks.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm text-muted-foreground">No tasks found</p>
                <p className="text-xs text-muted-foreground">Total tasks in database: {tasks.length}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              {filteredTasks.map((task) => (
                <div key={task.id} className="flex items-center p-4 border-b last:border-0">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {task.status === "Completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {task.status === "In Progress" && <Clock className="h-4 w-4 text-blue-500" />}
                      {task.status === "Not Started" && <AlertCircle className="h-4 w-4 text-gray-500" />}
                      <p className="font-medium">{task.title}</p>
                      <div
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{task.project}</span>
                      <span className="mx-2">•</span>
                      <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="todo" className="space-y-4">
          {todoTasks.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm text-muted-foreground">No to-do tasks found</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              {todoTasks.map((task) => (
                <div key={task.id} className="flex items-center p-4 border-b last:border-0">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-gray-500" />
                      <p className="font-medium">{task.title}</p>
                      <div
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{task.project}</span>
                      <span className="mx-2">•</span>
                      <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressTasks.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm text-muted-foreground">No in-progress tasks found</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              {inProgressTasks.map((task) => (
                <div key={task.id} className="flex items-center p-4 border-b last:border-0">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <p className="font-medium">{task.title}</p>
                      <div
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{task.project}</span>
                      <span className="mx-2">•</span>
                      <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedTasks.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm text-muted-foreground">No completed tasks found</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              {completedTasks.map((task) => (
                <div key={task.id} className="flex items-center p-4 border-b last:border-0">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <p className="font-medium">{task.title}</p>
                      <div
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{task.project}</span>
                      <span className="mx-2">•</span>
                      <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}