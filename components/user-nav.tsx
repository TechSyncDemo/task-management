// "use client"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { useRouter } from "next/navigation"

// export function UserNav() {
//   const router = useRouter()

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//           <Avatar className="h-8 w-8">
//             <AvatarImage src="/placeholder.svg" alt="User avatar" />
//             <AvatarFallback>JD</AvatarFallback>
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56" align="end" forceMount>
//         <DropdownMenuLabel className="font-normal">
//           <div className="flex flex-col space-y-1">
//             <p className="text-sm font-medium leading-none">Admin</p>
//             <p className="text-xs leading-none text-muted-foreground">admin@company.com</p>
//           </div>
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={() => router.push("/login")}>Log out</DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }


"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface User {
  name: string
  email: string
  role: 'admin' | 'staff'
}

export function UserNav() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUserData = async () => {
      const userRole = localStorage.getItem('userRole')
      
      if (!userRole) {
        router.push('/login')
        return
      }

      if (userRole === 'admin') {
        // For admin, use hardcoded data
        setUser({
          name: 'Admin',
          email: 'admin@company.com',
          role: 'admin'
        })
      } else if (userRole === 'staff') {
        // For staff, get user data from Supabase
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          console.error('Error getting user:', error)
          router.push('/login')
          return
        }

        setUser({
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Staff User',
          email: user.email || '',
          role: 'staff'
        })
      }
    }

    getUserData()
  }, [router])

  const handleLogout = async () => {
    const userRole = localStorage.getItem('userRole')
    
    if (userRole === 'staff') {
      // Sign out from Supabase for staff users
      await supabase.auth.signOut()
    }
    
    // Clear localStorage for both admin and staff
    localStorage.removeItem('userRole')
    
    // Redirect to login
    router.push('/login')
  }

  // Function to get display information based on user role
  const getDisplayInfo = () => {
    if (!user) return { name: 'Loading...', email: 'Loading...' }

    if (user.role === 'admin') {
      // Hardcoded admin display info
      return {
        name: 'Admin',
        email: 'admin@company.com'
      }
    } else if (user.role === 'staff') {
      // Show actual staff user info
      return {
        name: user.name,
        email: user.email
      }
    }

    return { name: 'User', email: 'user@company.com' }
  }

  // Function to get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const displayInfo = getDisplayInfo()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="User avatar" />
            <AvatarFallback>{getInitials(displayInfo.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayInfo.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{displayInfo.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}