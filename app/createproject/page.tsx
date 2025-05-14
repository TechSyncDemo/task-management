"use client"; 

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const CreateProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleCreateProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const userResponse = await supabase.auth.getUser();
const user = userResponse.data?.user; // Safely extract the user object

if (!user) {
  console.error("User not found or not authenticated.");
  return;
}


    const { data, error } = await supabase.from("projects").insert([
      {
        name,
        description,
        severity,
        due_date: dueDate,
        created_by: user.id 
      }
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Project created successfully!");
      router.back();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleCreateProject} className="p-4 bg-white rounded shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create a New Project</h2>

      <label className="block mb-2">Project Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="border p-2 w-full" />

      <label className="block mt-4 mb-2">Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full"></textarea>

      <label className="block mt-4 mb-2">Severity Level</label>
      <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="border p-2 w-full">
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
        <option>Critical</option>
      </select>

      <label className="block mt-4 mb-2">Due Date</label>
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="border p-2 w-full" />

      <button type="submit" className="bg-blue-500 text-white p-2 mt-4 w-full rounded" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
};

export default CreateProject;