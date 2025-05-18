"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Mail, Phone } from "lucide-react"
import Link from "next/link"

// Mock data for team members
const mockTeamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    role: "Design Lead",
    department: "Design",
    activeTasks: 5,
    avatar: "/placeholder.svg",
  },
 
  {
    id: 7,
    name: "Amanda Wilson",
    email: "amanda.wilson@example.com",
    phone: "+1 (555) 789-0123",
    role: "UI Designer",
    department: "Design",
    activeTasks: 4,
    avatar: "/placeholder.svg",
  },
  {
    id: 8,
    name: "John Martinez",
    email: "john.martinez@example.com",
    phone: "+1 (555) 890-1234",
    role: "Backend Developer",
    department: "Development",
    activeTasks: 7,
    avatar: "/placeholder.svg",
  },
]

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTeamMembers = mockTeamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team and their workload</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {filteredTeamMembers.map((member) => (
                  <div key={member.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{member.role}</span>
                          <span>•</span>
                          <Badge variant="outline">{member.department}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 sm:items-end">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <div className="text-sm font-medium">{member.activeTasks} active tasks</div>
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

        <TabsContent value="design" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Design Team</CardTitle>
              <CardDescription>Members of the design department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {filteredTeamMembers
                  .filter((member) => member.department === "Design")
                  .map((member) => (
                    <div key={member.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{member.role}</span>
                            <span>•</span>
                            <Badge variant="outline">{member.department}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 sm:items-end">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <div className="text-sm font-medium">{member.activeTasks} active tasks</div>
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

        <TabsContent value="development" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Development Team</CardTitle>
              <CardDescription>Members of the development department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {filteredTeamMembers
                  .filter((member) => member.department === "Development")
                  .map((member) => (
                    <div key={member.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{member.role}</span>
                            <span>•</span>
                            <Badge variant="outline">{member.department}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 sm:items-end">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <div className="text-sm font-medium">{member.activeTasks} active tasks</div>
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

        <TabsContent value="marketing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Team</CardTitle>
              <CardDescription>Members of the marketing department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {filteredTeamMembers
                  .filter((member) => member.department === "Marketing")
                  .map((member) => (
                    <div key={member.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{member.role}</span>
                            <span>•</span>
                            <Badge variant="outline">{member.department}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 sm:items-end">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <div className="text-sm font-medium">{member.activeTasks} active tasks</div>
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

        <TabsContent value="management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Management Team</CardTitle>
              <CardDescription>Members of the management department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {filteredTeamMembers
                  .filter((member) => member.department === "Management")
                  .map((member) => (
                    <div key={member.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{member.role}</span>
                            <span>•</span>
                            <Badge variant="outline">{member.department}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 sm:items-end">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <div className="text-sm font-medium">{member.activeTasks} active tasks</div>
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
      </Tabs>
    </div>
  )
}
