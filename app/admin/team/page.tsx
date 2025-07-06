"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Mail } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [{ data: users }, { data: projects }, { data: tasks }] =
        await Promise.all([
          supabase.from("users").select("id, full_name, email, position, role"),
          supabase.from("projects").select("id, name"),
          supabase.from("tasks").select("id, assigned_to, project_id"),
        ]);
      setTeamMembers(users || []);
      setProjects(projects || []);
      setTasks(tasks || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Filtered by search
  const filteredTeamMembers = teamMembers.filter(
    (member) =>
      (member.full_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (member.position || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
        <Link href="/admin/team/invite">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </Link>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search team members..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Members</TabsTrigger>
          {projects.map((project) => (
            <TabsTrigger key={project.id} value={project.id}>
              {project.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your team and their workload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {filteredTeamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.full_name}
                        />
                        <AvatarFallback>
                          {(member.full_name || "")
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.full_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{member.position}</span>
                          <span>•</span>
                          <Badge variant="outline">
                            {member.role.charAt(0).toUpperCase() +
                              member.role.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 sm:items-end">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{member.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {projects.map((project) => (
          <TabsContent
            key={project.id}
            value={project.id}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>{project.name} Team</CardTitle>
                <CardDescription>
                  Members assigned to {project.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {filteredTeamMembers
                    .filter((member) =>
                      tasks.some(
                        (task) =>
                          String(task.project_id).trim() ===
                            String(project.id).trim() &&
                          String(task.assigned_to).trim() ===
                            String(member.id).trim()
                      )
                    )
                    .map((member) => (
                      <div
                        key={member.id}
                        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">{member.full_name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{member.position}</span>
                              <span>•</span>
                              <Badge variant="outline">
                                {member.role.charAt(0).toUpperCase() +
                                  member.role.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 sm:items-end">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{member.email}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    ))}
                  {filteredTeamMembers.filter((member) =>
                    tasks.some(
                      (task) =>
                        String(task.project_id).trim() ===
                          String(project.id).trim() &&
                        String(task.assigned_to).trim() ===
                          String(member.id).trim()
                    )
                  ).length === 0 && (
                    <div className="text-muted-foreground text-sm">
                      No members assigned tasks in this project.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
