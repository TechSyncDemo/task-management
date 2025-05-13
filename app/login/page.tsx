"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded Admin Credentials
  const ADMIN_CREDENTIALS = {
    email: "admin@company.com",
    password: "AdminPassword123", // Change this to a more secure password
  };

  const handleLogin = async (role: string) => {
    setIsLoading(true);

    if (role === "admin") {
      // Hardcoded admin login
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem("userRole", role);
        router.push("/admin/dashboard");
      } else {
        alert("Invalid admin credentials!");
      }
    } else {
      // Supabase authentication for staff
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        console.error("Login error:", error.message);
      } else {
        localStorage.setItem("userRole", role);
        router.push("/dashboard");
      }
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
          <CardTitle className="text-2xl text-center">Login to TaskFlow</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="staff" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="staff">Staff Login</TabsTrigger>
              <TabsTrigger value="admin">Admin Login</TabsTrigger>
            </TabsList>
            <TabsContent value="staff">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin("staff");
                }}
              >
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="staff-email">Email</Label>
                    <Input
                      id="staff-email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="staff-password">Password</Label>
                      <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="staff-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login as Staff"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="admin">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin("admin");
                }}
              >
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="admin-password">Password</Label>
                      <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login as Admin"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-muted-foreground mt-2">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}










// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Clock } from "lucide-react"

// export default function LoginPage() {
//   const router = useRouter()
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   const handleLogin = async (role: string) => {
//     setIsLoading(true)

//     // Mock login - replace with actual Supabase auth later
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
//           <CardTitle className="text-2xl text-center">Login to TaskFlow</CardTitle>
//           <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Tabs defaultValue="staff" className="w-full">
//             <TabsList className="grid w-full grid-cols-2 mb-6">
//               <TabsTrigger value="staff">Staff Login</TabsTrigger>
//               <TabsTrigger value="admin">Admin Login</TabsTrigger>
//             </TabsList>
//             <TabsContent value="staff">
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault()
//                   handleLogin("staff")
//                 }}
//               >
//                 <div className="grid gap-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="staff-email">Email</Label>
//                     <Input
//                       id="staff-email"
//                       type="email"
//                       placeholder="name@company.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="grid gap-2">
//                     <div className="flex items-center justify-between">
//                       <Label htmlFor="staff-password">Password</Label>
//                       <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
//                         Forgot password?
//                       </Link>
//                     </div>
//                     <Input
//                       id="staff-password"
//                       type="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <Button type="submit" className="w-full" disabled={isLoading}>
//                     {isLoading ? "Logging in..." : "Login as Staff"}
//                   </Button>
//                 </div>
//               </form>
//             </TabsContent>
//             <TabsContent value="admin">
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault()
//                   handleLogin("admin")
//                 }}
//               >
//                 <div className="grid gap-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="admin-email">Email</Label>
//                     <Input
//                       id="admin-email"
//                       type="email"
//                       placeholder="admin@company.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="grid gap-2">
//                     <div className="flex items-center justify-between">
//                       <Label htmlFor="admin-password">Password</Label>
//                       <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
//                         Forgot password?
//                       </Link>
//                     </div>
//                     <Input
//                       id="admin-password"
//                       type="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <Button type="submit" className="w-full" disabled={isLoading}>
//                     {isLoading ? "Logging in..." : "Login as Admin"}
//                   </Button>
//                 </div>
//               </form>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//         <CardFooter className="flex flex-col">
//           <div className="text-center text-sm text-muted-foreground mt-2">
//             Don&apos;t have an account?{" "}
//             <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
//               Sign up
//             </Link>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }
