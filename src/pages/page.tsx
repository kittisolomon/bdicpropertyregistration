"use client"

import Dashboard from "./dashboard"
import Registration from "./registration"
import Database from "./database"
import Tracking from "./tracking"
import Admin from "./admin"
import Login from "./login"
import Landing from "./landing"

import { ThemeProvider } from "@/components/theme-provider"
import { useLocation, useNavigate } from "react-router-dom"
import PropertyView from "./property-view"
import PropertyEdit from "./property-edit"
import { useEffect, useState } from "react"
import Map from "./map"
import axios from "axios"
import { hasPermissions,canRegisterProperty} from "@/lib/permissions"
import { Role } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function GovPropertyPortal() {
  const [role,setRole]=useState("")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<Role[]>([])
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isLoginPage = location.pathname === "/admin/securelogin/login/"
  const isLandingPage = location.pathname === "/"
   const isMap = location.pathname === "/map"
   useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const users = localStorage.getItem("userData")
        if (!users && !isLandingPage) {
          console.error("No user data found")
          navigate("/admin/securelogin/login/")
          return
        }
        const userData = JSON.parse(users || "{}")
        if (!userData.role && !isLandingPage) {
          console.error("No role found in user data")
          navigate("/admin/securelogin/login/")
          return
        }
        setUserRole(userData.role)
        setRole(userData.role)
        
        await axios.get("https://bdicisp.onrender.com/api/v1/roles", {
          headers: {
            "x-access-token": ` ${localStorage.getItem("authToken")}`,
          }
        }).then(res => {
          if (Array.isArray(res.data)) {
            setPermissions(res.data)
          } else {
            console.error("Roles data is not an array:", res.data)
          }
        })
      } catch (error) {
        console.error("Failed to fetch user role:", error)
        navigate("/admin/securelogin/login/")
      }
    }
    fetchUserRole()
  }, [navigate])

  if (isLoginPage) {
    return (
      <ThemeProvider>
        <Login />
      </ThemeProvider>
    )
  }
  if (isMap) {
    return (
      <ThemeProvider>
        <Map />
      </ThemeProvider>
    )
  }

  if (isLandingPage) {
    return (
      <ThemeProvider>
        <Landing />
      </ThemeProvider>
    )
  }
  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    setIsLogoutDialogOpen(false)
    navigate("/admin/securelogin/login/")
  }
 
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-primary text-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img style={{width:50,height:50}} src="https://ik.imagekit.io/bdic/benue-government-properties/Images/benue-state-logo.png?updatedAt=1745964333054" />
              <div>
                <h1 className="text-xl font-bold">Benue State Government Integrated Properties and Assets Management Portal</h1>
                {/* <p className="text-xs text-white text-primary-foreground/80">Federal Republic of Nigeria</p> */}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <span className="text-sm text-primary-foreground/80">Welcome, {role}</span>
              </div>
              <button
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 px-3 py-1 rounded text-sm"
                onClick={() => setIsLogoutDialogOpen(true)}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="bg-primary-foreground/10">
            <div className="container mx-auto px-4">
              <ul className="flex overflow-x-auto">
                {[
                  { name: "Dashboard", path: "/dashboard" },
                  { name: "Registration", path: "/registration" },
                  { name: "Database", path: "/database" },
                  { name: "Tracking", path: "/tracking" },
                  { name: "Admin", path: "/admin" }
                ]
                .map((tab) => {
                  
                  const canViewReg =
                  tab.name === "Registration"
                    ? hasPermissions(userRole ||"", "Property Registration", permissions)
                    : true; // default allow others

                  const canViewAdmin =
                  tab.name === "Admin"
                    ? hasPermissions(userRole ||"", "Role Management", permissions)
                    : true; 
          
                if (!canViewReg) return null;
                if (!canViewAdmin) return null;
                return (
                  <li key={tab.name} className="flex-shrink-0">
                   {
                  
                      <button
                    onClick={() => navigate(tab.path)}
                    className={`px-4 py-3 text-sm font-medium text-white transition-colors ${
                      location.pathname === tab.path
                        ? "border-b-2 text-white border-yellow-400 text-white"
                        : "text-primary-foreground/80 hover:text-white"
                    }`}
                  >
                    {tab.name}
                  </button>
                   }
                  
                  </li>
                )
                    
})}
              </ul>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          {location.pathname === "/dashboard" && <Dashboard />}
          {
            canRegisterProperty(userRole||"","Property Registration",permissions) && location.pathname === "/registration" &&  <Registration  />
          }
          {location.pathname === "/database" && <Database />}
          { location.pathname === "/tracking" && <Tracking />}
          {location.pathname === "/admin" && <Admin />}
          {location.pathname.startsWith("/property/") && <PropertyView />}
          {location.pathname.startsWith("/edit/property/") && <PropertyEdit />}
        </main>

        {/* Footer */}
        <footer className="bg-primary text-white py-4 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>© {new Date().getFullYear()} Benue State Integrated Properties and Assets Management Portal. All rights reserved.</p>
            <p className="text-primary-foreground/80 text-xs mt-1">
            Powered by BDIC
            {/* <img style={{height:50,width:50}} src="https://bdic.ng/wp-content/uploads/2024/11/logo.png" /> */}
             </p>
           
          </div>
        </footer>

        {/* Logout Confirmation Dialog */}
        <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              Are you sure you want to logout?
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleLogout}>
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  )
} 