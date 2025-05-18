import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "./supabaseClient"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  progress: number;
  members: number;
  completedTasks: number;
  tasks: number;
  due_date: string;
  severity: string;
}




// utils/supabase.ts
export async function fetchProjects(): Promise<ProjectData[]> {
  const { data, error } = await supabase.from("projects").select("*")
  if (error) {
    console.error("Error fetching projects:", error.message)
    return []
  }
  return data as ProjectData[]
}

// export async function fetchProjectsWithOptional(): Promise<Project[]> {
//   const projects = await fetchProjects()
//   return [
//     { id: "not-applicable", name: "Not Applicable" },
//     ...projects,
//   ]
// }

