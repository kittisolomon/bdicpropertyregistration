"use client"

import { Shield } from "lucide-react"
import Dashboard from "./dashboard"
import Registration from "./registration"
import Database from "./database"
import Tracking from "./tracking"
import Admin from "./admin"
import Login from "./login"
import { ThemeProvider } from "@/components/theme-provider"
import { useLocation, useNavigate } from "react-router-dom"
import PropertyView from "./property-view"
import PropertyEdit from "./property-edit"
import { useEffect, useState } from "react"

export default function GovPropertyPortal() {
  const [role,setRole]=useState("")

  const location = useLocation()
  const navigate = useNavigate()
  const isLoginPage = location.pathname === "/"
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    let user = userData ? JSON.parse(userData) : null;
    //let user = JSON.parse(localStorage.getItem('userData'));
    console.log(user); // Check if it's an object
    console.log(user?.role); // Check if role exists
    setRole(user?.role)

  }, [])

  if (isLoginPage) {
    return (
      <ThemeProvider>
        <Login />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-primary text-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-yellow-400" />
              <div>
                <h1 className="text-xl font-bold">Benue Property/Commodity Management Portal</h1>
                <p className="text-xs text-white text-primary-foreground/80">Federal Republic of Nigeria</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <span className="text-sm text-primary-foreground/80">Welcome, Administrator</span>
              </div>
              <button
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 px-3 py-1 rounded text-sm"
                onClick={() => navigate("/")}
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
                ].filter((tab)=> role !=="portaladmin" ? tab.name !=="Admin": tab).map((tab) => (

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
                    
                ))}
              </ul>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          {location.pathname === "/dashboard" && <Dashboard />}
          {location.pathname === "/registration" && <Registration />}
          {location.pathname === "/database" && <Database />}
          {location.pathname === "/tracking" && <Tracking />}
          {location.pathname === "/admin" && <Admin />}
          {location.pathname.startsWith("/property/") && <PropertyView />}
          {location.pathname.startsWith("/edit/property/") && <PropertyEdit />}
        </main>

        {/* Footer */}
        <footer className="bg-primary text-white py-4 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>© {new Date().getFullYear()} Benue State Government Property Management Authority. All rights reserved.</p>
            <p className="text-primary-foreground/80 text-xs mt-1">Secure Government Portal v1.0</p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
} 