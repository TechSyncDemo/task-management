// "use client";

// import { useEffect, useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { supabase } from "@/lib/supabaseClient";

// export default function ProjectsPage() {
//   const [projects, setProjects] = useState<any[]>([]);
//   const [tasks, setTasks] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAll = async () => {
//       const [{ data: projects }, { data: tasks }] = await Promise.all([
//         supabase.from("projects").select("id, name, severity"),
//         supabase.from("tasks").select("id, project_id, status"),
//       ]);
//       setProjects(projects || []);
//       setTasks(tasks || []);
//       setLoading(false);
//     };
//     fetchAll();
//   }, []);

//   // Helper to get tasks for a project
//   const getProjectTasks = (projectId: string) =>
//     tasks.filter((task) => String(task.project_id) === String(projectId));

//   // Ongoing: at least one task not completed
//   const ongoingProjects = projects.filter((project) => {
//     const projectTasks = getProjectTasks(project.id);
//     return (
//       projectTasks.length > 0 &&
//       projectTasks.some(
//         (task) =>
//           !task.status ||
//           task.status.toLowerCase() !== "completed"
//       )
//     );
//   });

//   // Completed: all tasks completed (and at least one task)
//   const completedProjects = projects.filter((project) => {
//     const projectTasks = getProjectTasks(project.id);
//     return (
//       projectTasks.length > 0 &&
//       projectTasks.every(
//         (task) =>
//           task.status &&
//           task.status.toLowerCase() === "completed"
//       )
//     );
//   });

//   return (
//     <div className="flex flex-col gap-4">
//       <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
//       <Tabs defaultValue="ongoing" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="ongoing">Ongoing Projects</TabsTrigger>
//           <TabsTrigger value="completed">Completed Projects</TabsTrigger>
//         </TabsList>

//         <TabsContent value="ongoing" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Ongoing Projects</CardTitle>
//               <CardDescription>
//                 Projects with at least one incomplete task
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {loading ? (
//                 <div>Loading...</div>
//               ) : ongoingProjects.length === 0 ? (
//                 <div className="text-muted-foreground text-sm">
//                   No ongoing projects found.
//                 </div>
//               ) : (
//                 <div className="grid gap-4">
//                   {ongoingProjects.map((project) => (
//                     <div
//                       key={project.id}
//                       className="flex items-center justify-between p-4 border rounded"
//                     >
//                       <div>
//                         <p className="font-medium">{project.name}</p>
//                         <Badge variant="outline" className="ml-2">
//                           {project.severity}
//                         </Badge>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="completed" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Completed Projects</CardTitle>
//               <CardDescription>
//                 Projects where all tasks are completed
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {loading ? (
//                 <div>Loading...</div>
//               ) : completedProjects.length === 0 ? (
//                 <div className="text-muted-foreground text-sm">
//                   No completed projects found.
//                 </div>
//               ) : (
//                 <div className="grid gap-4">
//                   {completedProjects.map((project) => (
//                     <div
//                       key={project.id}
//                       className="flex items-center justify-between p-4 border rounded"
//                     >
//                       <div>
//                         <p className="font-medium">{project.name}</p>
//                         <Badge variant="outline" className="ml-2">
//                           {project.severity}
//                         </Badge>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [{ data: projects }, { data: tasks }] = await Promise.all([
        supabase.from("projects").select("id, name, severity, description, due_date"),
        supabase.from("tasks").select("id, project_id, status, assigned_to"),
      ]);
      setProjects(projects || []);
      setTasks(tasks || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Helper to get tasks for a project
  const getProjectTasks = (projectId: string) =>
    tasks.filter((task) => String(task.project_id) === String(projectId));

  // Helper to get unique member count for a project
  const getProjectMemberCount = (projectId: string) => {
    const projectTasks = getProjectTasks(projectId);
    const uniqueMembers = new Set(
      projectTasks
        .map((task) => task.assigned_to)
        .filter(Boolean)
    );
    return uniqueMembers.size;
  };

  // Ongoing: at least one task not completed
  const ongoingProjects = projects.filter((project) => {
    const projectTasks = getProjectTasks(project.id);
    return (
      projectTasks.length > 0 &&
      projectTasks.some(
        (task) =>
          !task.status ||
          task.status.toLowerCase() !== "completed"
      )
    );
  });

  // Completed: all tasks completed (and at least one task)
  const completedProjects = projects.filter((project) => {
    const projectTasks = getProjectTasks(project.id);
    return (
      projectTasks.length > 0 &&
      projectTasks.every(
        (task) =>
          task.status &&
          task.status.toLowerCase() === "completed"
      )
    );
  });

  // Helper to check if overdue
  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    // Only overdue if due date is before today (ignoring time)
    return due.setHours(0,0,0,0) < now.setHours(0,0,0,0);
  };

  // Helper to format date
  const formatDate = (dateStr: string | null) =>
    dateStr ? format(new Date(dateStr), "dd MMM yyyy") : "N/A";

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
      <Tabs defaultValue="ongoing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ongoing">Ongoing Projects</TabsTrigger>
          <TabsTrigger value="completed">Completed Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ongoing Projects</CardTitle>
              <CardDescription>
                Projects with at least one incomplete task
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading...</div>
              ) : ongoingProjects.length === 0 ? (
                <div className="text-muted-foreground text-sm">
                  No ongoing projects found.
                </div>
              ) : (
                <div className="grid gap-4">
                  {ongoingProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex flex-col gap-1 p-4 border rounded"
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{project.name}</p>
                        <Badge variant="outline">{project.severity}</Badge>
                        {isOverdue(project.due_date) && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {project.description}
                      </div>
                      <div className="flex items-center gap-4 text-xs mt-1">
                        <span>
                          Due:{" "}
                          <span className={isOverdue(project.due_date) ? "text-red-600 font-semibold" : ""}>
                            {formatDate(project.due_date)}
                          </span>
                        </span>
                        <span>
                          Members: <span className="font-semibold">{getProjectMemberCount(project.id)}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Projects</CardTitle>
              <CardDescription>
                Projects where all tasks are completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading...</div>
              ) : completedProjects.length === 0 ? (
                <div className="text-muted-foreground text-sm">
                  No completed projects found.
                </div>
              ) : (
                <div className="grid gap-4">
                  {completedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex flex-col gap-1 p-4 border rounded"
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{project.name}</p>
                        <Badge variant="outline">{project.severity}</Badge>
                        {isOverdue(project.due_date) && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {project.description}
                      </div>
                      <div className="flex items-center gap-4 text-xs mt-1">
                        <span>
                          Due:{" "}
                          <span className={isOverdue(project.due_date) ? "text-red-600 font-semibold" : ""}>
                            {formatDate(project.due_date)}
                          </span>
                        </span>
                        <span>
                          Members: <span className="font-semibold">{getProjectMemberCount(project.id)}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}