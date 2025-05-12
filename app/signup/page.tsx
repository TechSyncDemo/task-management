"use client"

// import type React from "react"

// import { useState } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Clock } from "lucide-react"

// export default function SignupPage() {
//   const router = useRouter()
//   const [name, setName] = useState("")
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [role, setRole] = useState("staff")
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     // Mock signup - replace with actual Supabase auth later
//     setTimeout(() => {
//       setIsLoading(false)
//       localStorage.setItem("userRole", role)
//       router.push(role === "admin" ? "/admin/dashboard" : "/dashboard")
//     }, 1000)
//   }

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
//       <div className="flex items-center gap-2 mb-6">
//         <Clock className="h-6 w-6" />
//         <span className="text-2xl font-bold">TaskFlow</span>
//       </div>
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl text-center">Create an account</CardTitle>
//           <CardDescription className="text-center">
//             Enter your information to create your TaskFlow account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSignup}>
//             <div className="grid gap-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input
//                   id="name"
//                   type="text"
//                   placeholder="John Doe"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="name@company.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? "Creating account..." : "Create account"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//         <CardFooter className="flex flex-col">
//           <div className="text-center text-sm text-muted-foreground mt-2">
//             Already have an account?{" "}
//             <Link href="/login" className="text-primary underline-offset-4 hover:underline">
//               Log in
//             </Link>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }


import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Adjust the import path as necessary

import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Signup = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) {
      console.error('Signup error:', error.message);
      alert(error.message);
    } else {
      console.log('User signed up:', data);
      alert('Account created successfully!');
      router.push('/dashboard'); // Redirect user after signup
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-6 w-6" />
        <span className="text-2xl font-bold">TaskFlow</span>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create your TaskFlow account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-muted-foreground mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;