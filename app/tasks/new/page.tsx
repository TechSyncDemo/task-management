// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import {
//   Card, CardContent, CardDescription,
//   CardFooter, CardHeader, CardTitle
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select, SelectContent, SelectItem,
//   SelectTrigger, SelectValue
// } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { format } from "date-fns"
// import { CalendarIcon } from "lucide-react"
// import { cn, fetchProjects, ProjectData } from "@/lib/utils"
// import { supabase } from "@/lib/supabaseClient"

// export default function NewTaskPage() {
//   const router = useRouter()
//   const [title, setTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [project, setProject] = useState("")
//   const [priority, setPriority] = useState("")
//   const [status, setStatus] = useState("todo")
//   const [assignee, setAssignee] = useState("")
//   const [date, setDate] = useState<Date>()
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const [projects, setActiveProjects] = useState<ProjectData[]>([])
//   const [loading, setLoading] = useState(false)

//   const [users, setUsers] = useState<{ id: string; email: string }[]>([])

// useEffect(() => {
//   const loadUsers = async () => {
//     const { data, error } = await supabase.from("users").select("id, email")
//     if (error) {
//       console.error("Error loading users:", error.message)
//       return
//     }
//     setUsers(data)
//   }

//   loadUsers()
// }, [])


//   useEffect(() => {
//     const loadProjects = async () => {
//       setLoading(true)
//       const data = await fetchProjects()
//       console.log("Fetched Projects →", data)
//       setActiveProjects(data)
//       setLoading(false)
//     }

//     loadProjects()
//   }, [])

//   const createTaskSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     const { data: userResponse, error: userError } = await supabase.auth.getUser()
//     const user = userResponse?.user

//     if (!user || userError) {
//       alert("You must be logged in to create a task.")
//       setIsSubmitting(false)
//       return
//     }

//     if (!project) {
//       alert("Please select a project.")
//       setIsSubmitting(false)
//       return
//     }

//     const { error } = await supabase.from("tasks").insert([
//       {
//         title,
//         description,
//         priority,
//         status,
//         assigned_to: assignee,
//         due_date: date,
//         project_id: project,
//         created_by: user.id,
//       },
//     ])

//     if (error) {
//       console.error("Error creating task:", error.message)
//       alert(error.message)
//     } else {
//       alert("Task created successfully!")
//       router.push("/tasks")
//     }

//     setIsSubmitting(false)
//   }

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="flex items-center justify-between">
//         <h2 className="text-3xl font-bold tracking-tight">Create New Task</h2>
//       </div>

//       <Card>
//         <form onSubmit={createTaskSubmit}>
//           <CardHeader>
//             <CardTitle>Task Details</CardTitle>
//             <CardDescription>Enter the information for the new task</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="title">Task Title</Label>
//               <Input
//                 id="title"
//                 placeholder="Enter task title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 placeholder="Enter task description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 rows={4}
//               />
//             </div>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="project">Project</Label>
//                 <Select value={project} onValueChange={setProject} required>
//                   <SelectTrigger id="project">
//                     <SelectValue placeholder="Select project" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="not-applicable">Not Applicable</SelectItem>
//                     {projects.map((project) => (
//                       <SelectItem key={project.id} value={project.id}>
//                         {project.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="priority">Priority</Label>
//                 <Select value={priority} onValueChange={setPriority} required>
//                   <SelectTrigger id="priority">
//                     <SelectValue placeholder="Select priority" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="low">Low</SelectItem>
//                     <SelectItem value="medium">Medium</SelectItem>
//                     <SelectItem value="high">High</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="status">Status</Label>
//                 <Select value={status} onValueChange={setStatus} required>
//                   <SelectTrigger id="status">
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                       <SelectItem value="Not Started">Not Started</SelectItem>
//     <SelectItem value="In Progress">In Progress</SelectItem>
//     <SelectItem value="Hold">Hold</SelectItem>
//     <SelectItem value="Completed">Completed</SelectItem>
    
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* <div className="space-y-2">
//                 <Label htmlFor="assignee">Assignee</Label>
//                 <Select value={assignee} onValueChange={setAssignee} required>
//                   <SelectTrigger id="assignee">
//                     <SelectValue placeholder="Select assignee" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="uuid-me">Myself</SelectItem>
//                     <SelectItem value="uuid-sarah">Sarah Johnson</SelectItem>
//                     <SelectItem value="uuid-michael">Michael Chen</SelectItem>
//                     <SelectItem value="uuid-emily">Emily Rodriguez</SelectItem>
//                     <SelectItem value="uuid-david">David Kim</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div> */}

//               <div className="space-y-2">
//   <Label htmlFor="assignee">Assignee</Label>
//   <Select value={assignee} onValueChange={setAssignee} required>
//     <SelectTrigger id="assignee">
//       <SelectValue placeholder="Select assignee" />
//     </SelectTrigger>
//     <SelectContent>
//       {users.map((user) => (
//         <SelectItem key={user.id} value={user.id}>
//           {user.email}
//         </SelectItem>
//       ))}
//     </SelectContent>
//   </Select>
// </div>


//               <div className="space-y-2">
//                 <Label>Due Date</Label>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {date ? format(date, "PPP") : "Select a date"}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
//                   </PopoverContent>
//                 </Popover>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="flex justify-between">
//             <Button variant="outline" type="button" onClick={() => router.back()}>
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
//             >
//               {isSubmitting ? "Creating..." : "Create Task"}
//             </Button>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   )
// }
