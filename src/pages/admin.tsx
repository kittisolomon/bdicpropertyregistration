import { useState, useEffect } from "react"
import { AlertTriangle, FileSpreadsheet, Lock, Shield, Users, Plus, Edit2, Check, X, Loader2, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import {  Bar, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import axios from "axios"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface User {
  id: string
  _id:string
  fullName: string
  email: string
  role: string
  department: string
  status: string
  state?: string
  lga?: string
}

interface NewAdmin {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: string
  department: string
  state?: string
  lga?: string
}

interface Role {
  id: string
  _id:string
  name: string
  description: string
  users: number
  permissions: {
    name: string
    granted: boolean
  }[]
}

interface AuditLog {
  id: string
  user: string
  action: string
  time: string
  ip: string
  details?: string
  status: "success" | "failed"
}

interface StatsData {
  stateDistribution: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
    }[];
  };
  propertyDistribution: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };
  institutionDistribution: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
    }[];
  };
  totalValue: string;
}

export default function Admin() {
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)
  const [isEditAdminOpen, setIsEditAdminOpen] = useState(false)
  const [isDisableAdminOpen, setIsDisableAdminOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newAdmin, setNewAdmin] = useState<NewAdmin>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
    state: "",
    lga: "",
  })
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [nameError,setNameError]=useState<string | null>(null)
  const [error,setError]=useState<string | null>(null)
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [roleError, setRoleError] = useState<string | null>(null)
  const [isAddingAdmin, setIsAddingAdmin] = useState(false)
  const [isEditingAdmin, setIsEditingAdmin] = useState(false)
  const [isDisablingAdmin, setIsDisablingAdmin] = useState(false)
  const [isEditingRole, setIsEditingRole] = useState(false)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [isLoadingAuditLogs, setIsLoadingAuditLogs] = useState(false)
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
const [rolesPermission,setRolesPermission]=useState([])
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [verificationSuccess, setVerificationSuccess] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [newAdminId, setNewAdminId] = useState("")
  useEffect(() =>{
    const loadData = async () => {
    try {
      const users = localStorage.getItem("userData")
      if (!users) {
        console.error("No user data found")
        return
      }
      const userData = JSON.parse(users)
      if (!userData.role) {
        console.error("No role found in user data")
        return
      }
      setUserRole(userData.role)
      await Promise.all([
        //fetchAuditLogs(),
        fetchAdminRoles(),
        fetchPropertyStats(),
        fetchUsers()
      ])
    } catch (error) {
      console.error("Error loading initial admin data:", error)
    }
    }
    loadData()
   
  }, [])
  const fetchAdminRoles = async () => {
    try {
      setIsLoadingAuditLogs(true)
       await axios.get("https://bdicisp.onrender.com/api/v1/roles", {
        headers: {
          "x-access-token": ` ${localStorage.getItem("authToken")}`,
        },
      }).then((res)=>{
        setRolesPermission(res.data)
        console.error(res.data)
      })

    } catch (error) {
      console.error("Failed to fetch audit logs:", error)
    } finally {
      setIsLoadingAuditLogs(false)
    }
  }
  

  const fetchAuditLogs = async () => {
    try {
      setIsLoadingAuditLogs(true)
      const response = await axios.get("https://bdicisp.onrender.com/api/v1/audit-logs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setAuditLogs(response.data.data)
    } catch (error) {
      console.error("Failed to fetch audit logs:", error)
    } finally {
      setIsLoadingAuditLogs(false)
    }
  }

  const fetchPropertyStats = async () => {
    try {
      setIsLoadingStats(true)
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "https://bdicisp.onrender.com/api/v1/properties/collection/stats?range=all-time",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setStats(response.data.data)
    } catch (error) {
      console.error("Failed to fetch property stats:", error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true)
      const token = localStorage.getItem("authToken")
      await axios.post(
        "https://bdicisp.onrender.com/api/v1/profile/adminusers",{},
        {
          headers: {
            'x-access-token': `${token}`,
          },
        }
      ).then((res)=>{
        console.error(res.data.user)
        setUsers(res.data.user)
      })
     
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleAddAdmin = async () => {
    //validate admin name
   if (!newAdmin.name) {
      setNameError("Enter admin's name")
      return
    }
   // Validate passwords match
    if (newAdmin.password !== newAdmin.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
   


    // Validate password strength
    if (newAdmin.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return
    }

    try {
      setIsAddingAdmin(true)
      const response = await axios.post(
        "https://bdicisp.onrender.com/api/v1/users/register",
        {
          fullName: newAdmin.name,
          email: newAdmin.email,
          password: newAdmin.password,
          phoneNumber: "00000000000",
          role: newAdmin.role,
          isverified: false,
          department: newAdmin.department,
          state: newAdmin.state,
          lga: newAdmin.lga,
        }
      )
     
      
      setNewAdminEmail(newAdmin.email)
      setNewAdminId(response.data.data.newUser._id)
      setIsAddAdminOpen(false)
      setIsVerificationDialogOpen(true)
      setNewAdmin({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        department: "",
        state: "",
        lga: "",
      })
      setPasswordError(null)
      setError(null)
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to add admin")
      console.error("Failed to add admin:", error)
    } finally {
      setIsAddingAdmin(false)
    }
  }

  const handleVerifyEmail = async () => {
    if (!verificationCode || verificationCode.length !== 4) {
      setVerificationError("Please enter a valid 4-digit code")
      return
    }

    try {
      setIsVerifying(true)
      setVerificationError(null)
      
     await axios.post(
        "https://bdicisp.onrender.com/api/v1/users/verify",
        {
          userID: newAdminId,
          veri_code: verificationCode
        }
      )

      setVerificationSuccess(true)
      setTimeout(() => {
        setIsVerificationDialogOpen(false)
        setVerificationSuccess(false)
        setVerificationCode("")
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      setVerificationError(error.response?.data?.message || "Failed to verify email")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleEditAdmin = async () => {
    if (!selectedUser) return
    const token =localStorage.getItem("authToken")

    try {
      setIsEditingAdmin(true)
      await axios.post(
        `https://bdicisp.onrender.com/api/v1/profile/${selectedUser._id}`,
        {
          updateData:
          {fullName: selectedUser.fullName,
          email: selectedUser.email,
          role: selectedUser.role,
          department: selectedUser.department,
          state: selectedUser.state,
          lga: selectedUser.lga}
        },
        {
          headers:{
            "x-access-token":token
          }
         
        }
      )
      setIsEditAdminOpen(false)
      setSelectedUser(null)
      // Refresh the users list
      window.location.reload()
    } catch (error) {
      console.error("Failed to edit admin:", error)
    } finally {
      setIsEditingAdmin(false)
    }
  }

  const handleDisableEnableAdmin = async () => {
    if (!selectedUser) return

    const action = selectedUser.status ==="active" ?"deactivate":"activate"
    let token =localStorage.getItem("authToken")

    try {
      setIsDisablingAdmin(true)
      await axios.post(
        `https://bdicisp.onrender.com/api/v1/profile/${action}/${selectedUser._id}`,{},{
            headers:{
             "x-access-token": token
            }
          }
        
      ).then(()=>{

        setIsDisableAdminOpen(false)
        setSelectedUser(null)
        setIsDisablingAdmin(false)
        // Refresh the users list
        window.location.reload()
      }).catch(err=>{
        setIsDisablingAdmin(false)
        console.log(err.message)
      })
    
    } catch (error) {
      console.error("Failed to update admin status:", error)
    } finally {
      setIsDisablingAdmin(false)
    }
  }

  const handleEditRole = async () => {
    if (!selectedRole) return
    try {
      setIsEditingRole(true)
      await axios.patch(
        `https://bdicisp.onrender.com/api/v1/roles/${selectedRole._id}/permissions`,
        {
          name: selectedRole.name,
          description: selectedRole.description,
          permissions: selectedRole.permissions,
        }
      )
      setIsEditRoleOpen(false)
      setSelectedRole(null)
      setRoleError(null)
      // Refresh the roles list
      //window.location.reload()
      fetchAdminRoles()
    } catch (error: any) {
      setRoleError(error.response?.data?.message || "Failed to update role")
      console.error("Failed to edit role:", error)
    } finally {
      setIsEditingRole(false)
    }
  }

  const handleTogglePermission = async (roleId: string, permissionName: string, currentGranted: boolean) => {
    try {
      await axios.put(
        `https://bdicisp.onrender.com/api/v1/roles/${roleId}/permissions`,
        { permission: permissionName, granted: !currentGranted }
      )
      // Refresh the roles list
      window.location.reload()
    } catch (error) {
      console.error("Failed to toggle permission:", error)
    }
  }



  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Administration</h2>
          <p className="text-gray-500">Manage system settings and user access</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <Shield className="h-3 w-3 mr-1" />
            {userRole}
          </div>
        </div>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          {/* <TabsTrigger value="import">Data Import/Export</TabsTrigger> */}
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
        </TabsList>

        {/* User Management */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>System Users</CardTitle>
                <CardDescription>Manage user accounts and access</CardDescription>
              </div>
              <Button onClick={() => setIsAddAdminOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Admin
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-50 text-left">
                        <th className="p-3 border-b border-blue-100 text-blue-800 font-medium">Name</th>
                        <th className="p-3 border-b border-blue-100 text-blue-800 font-medium">Email</th>
                        <th className="p-3 border-b border-blue-100 text-blue-800 font-medium">Role</th>
                        <th className="p-3 border-b border-blue-100 text-blue-800 font-medium">Department</th>
                        <th className="p-3 border-b border-blue-100 text-blue-800 font-medium">Status</th>
                        <th className="p-3 border-b border-blue-100 text-blue-800 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{user.fullName?.charAt(0).toUpperCase() + user.fullName?.slice(1)}</td>
                          <td className="p-3">{user.email.charAt(0).toUpperCase() + user.email.slice(1)}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === "Super Admin"
                                  ? "bg-primary/20 text-primary"
                                  : user.role === "State Admin"
                                    ? "bg-primary/15 text-primary/80"
                                    : "bg-primary/10 text-primary/70"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3">{user.department}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
                            </span>
                          </td>
                          {userRole ==="superadmin" &&
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-primary"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setIsEditAdminOpen(true)
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-red-600"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setIsDisableAdminOpen(true)
                                }}
                              >
                                {user.status === "active" ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                              </Button>
                            </div>
                          </td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Permissions */}
        <TabsContent value="roles" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>Configure access levels and capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {rolesPermission.map((role:any) => {

                  const canAlterSuper =
                  role.name === "Super Admin"
                    ? userRole==="superadmin"
                    : true; // default allow others
                    if(!canAlterSuper) return null
                  return(<div key={role?._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{role.name}</h3>
                        <p className="text-sm text-gray-500">{role.description}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {role.userCount} user{role.userCount !== 1 ? "s" : ""} with this role
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRole(role)
                          setIsEditRoleOpen(true)
                        }}
                      >
                        Edit Role
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {role.permissions.map((permission:any, pIndex:number) => (
                        <div key={pIndex} className="flex items-center justify-between border rounded p-3 bg-gray-50">
                          <span className="text-sm">{permission.name}</span>
                          <Switch
                            checked={permission.granted}
                            onCheckedChange={() => handleTogglePermission(role._id, permission.name, permission.granted)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>)
})}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Import/Export */}
        <TabsContent value="import" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Import Data</CardTitle>
                <CardDescription>Bulk upload properties from spreadsheet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center">
                    <FileSpreadsheet className="h-12 w-12 text-blue-300 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Upload Excel or CSV file with property data</p>
                    <p className="text-xs text-gray-500 mb-4">
                      Download the{" "}
                      <a href="#" className="text-blue-600 underline">
                        template file
                      </a>{" "}
                      first
                    </p>
                    <Button>Select File to Import</Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Import Options</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="skip-duplicates" />
                        <Label htmlFor="skip-duplicates">Skip duplicate entries</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="validate-data" defaultChecked />
                        <Label htmlFor="validate-data">Validate data before import</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-users" />
                        <Label htmlFor="notify-users">Notify department heads</Label>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button className="w-full">Start Import</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>Download property records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="export-type">Export Format</Label>
                    <Select defaultValue="excel">
                      <SelectTrigger id="export-type">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Microsoft Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV File (.csv)</SelectItem>
                        <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="export-data">Data to Export</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="export-data">
                        <SelectValue placeholder="Select data" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Properties</SelectItem>
                        <SelectItem value="vehicles">Vehicles Only</SelectItem>
                        <SelectItem value="land">Land Only</SelectItem>
                        <SelectItem value="houses">Houses Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="export-fields">Fields to Include</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "ID",
                        "Type",
                        "Location",
                        "Registration Date",
                        "Status",
                        "Value",
                        "Description",
                        "Registered By",
                        "Last Updated",
                      ].map((field, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`field-${index}`}
                            defaultChecked
                            className="rounded text-blue-600"
                          />
                          <Label htmlFor={`field-${index}`} className="text-sm">
                            {field}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button className="w-full">Generate Export</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Log */}
        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>System activity log for security and compliance</CardDescription>
                <b>COMING SOON IN v1.1</b>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="login">Login/Logout</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={fetchAuditLogs}>
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingAuditLogs ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start border-b pb-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                          log.status === "failed"
                            ? "bg-red-100 text-red-600"
                            : log.user === "System"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {log.status === "failed" ? (
                          <AlertTriangle className="h-5 w-5" />
                        ) : log.user === "System" ? (
                          <Shield className="h-5 w-5" />
                        ) : log.action.includes("Login") ? (
                          <Lock className="h-5 w-5" />
                        ) : (
                          <Users className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-gray-500">{log.time}</p>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">By: {log.user}</p>
                          <p className="text-xs text-gray-500">IP: {log.ip}</p>
                        </div>
                        {log.details && (
                          <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Distribution</CardTitle>
                <CardDescription>Distribution by type</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="h-64">
                    <Pie data={stats?.propertyDistribution || {
                      labels: [],
                      datasets: [{
                        data: [],
                        backgroundColor: []
                      }]
                    }} options={chartOptions} />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>State Distribution</CardTitle>
                <CardDescription>Properties by state</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="h-64">
                    <Bar data={stats?.stateDistribution || {
                      labels: [],
                      datasets: [{
                        label: "Properties by State",
                        data: [],
                        backgroundColor: []
                      }]
                    }} options={chartOptions} />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Institutions Distribution</CardTitle>
                <CardDescription>Distributions by institution type</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="h-64">
                    <Bar data={stats?.institutionDistribution || {
                      labels: [],
                      datasets: [{
                        label: "Properties by Institutions",
                        data: [],
                        backgroundColor: []
                      }]
                    }} options={chartOptions} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Admin Dialog */}
      <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
             {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                placeholder="Enter full name"
              />
               {nameError && (
                <p className="text-xs text-red-500">{nameError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newAdmin.password}
                onChange={(e) => {
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                  setPasswordError(null)
                }}
                placeholder="Enter password"
              />
              <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={newAdmin.confirmPassword}
                onChange={(e) => {
                  setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })
                  setPasswordError(null)
                }}
                placeholder="Confirm password"
              />
              {passwordError && (
                <p className="text-xs text-red-500">{passwordError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newAdmin.role}
                onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  
      
                  {userRole ==="superadmin"&&<SelectItem value="superadmin">Super Admin</SelectItem>}
                  <SelectItem value="state_admin">State Admin</SelectItem>
                  <SelectItem value="governor">Governor</SelectItem>
                  <SelectItem value="lga_officer">LGA Officer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newAdmin.role !=="governor" ? (
              <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={newAdmin.department}
                onChange={(e) => setNewAdmin({ ...newAdmin, department: e.target.value })}
                placeholder="Enter department"
              />
            </div>
            ):null}
            
            {newAdmin.role === "state_admin" || newAdmin.role === "lga_officer" ? (
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={newAdmin.state}
                  onValueChange={(value) => setNewAdmin({ ...newAdmin, state: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abuja">Abuja</SelectItem>
                    <SelectItem value="lagos">Lagos</SelectItem>
                    <SelectItem value="kano">Kano</SelectItem>
                    <SelectItem value="port_harcourt">Port Harcourt</SelectItem>
                    {/* Add more states as needed */}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            {newAdmin.role === "lga_officer" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={newAdmin.state}
                    onValueChange={(value) => setNewAdmin({ ...newAdmin, state: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abuja">Abuja</SelectItem>
                      <SelectItem value="lagos">Lagos</SelectItem>
                      <SelectItem value="kano">Kano</SelectItem>
                      <SelectItem value="port_harcourt">Port Harcourt</SelectItem>
                      {/* Add more states as needed */}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lga">LGA</Label>
                  <Select
                    value={newAdmin.lga}
                    onValueChange={(value) => setNewAdmin({ ...newAdmin, lga: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select LGA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ikeja">Ikeja</SelectItem>
                      <SelectItem value="surulere">Surulere</SelectItem>
                      <SelectItem value="abuja_municipal">Abuja Municipal</SelectItem>
                      <SelectItem value="kano_municipal">Kano Municipal</SelectItem>
                      {/* Add more LGAs as needed */}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddAdminOpen(false)
              setPasswordError(null)
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddAdmin} disabled={isAddingAdmin}>
              {isAddingAdmin ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Admin"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditAdminOpen} onOpenChange={setIsEditAdminOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={selectedUser.fullName}
                  onChange={(e) => setSelectedUser({ ...selectedUser, fullName: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="state_admin">State Admin</SelectItem>
                    <SelectItem value="governor">Governor</SelectItem>
                    <SelectItem value="lga_officer">LGA Officer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={selectedUser.department}
                  onChange={(e) => setSelectedUser({ ...selectedUser, department: e.target.value })}
                  placeholder="Enter department"
                />
              </div>
              {(selectedUser.role === "state_admin" || selectedUser.role === "lga_officer") && (
                <div className="space-y-2">
                  <Label htmlFor="edit-state">State</Label>
                  <Select
                    value={selectedUser.state}
                    onValueChange={(value) => setSelectedUser({ ...selectedUser, state: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abuja">Abuja</SelectItem>
                      <SelectItem value="lagos">Lagos</SelectItem>
                      <SelectItem value="kano">Kano</SelectItem>
                      <SelectItem value="port_harcourt">Port Harcourt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* {selectedUser.role === "lga_officer" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-state">State</Label>
                    <Select
                      value={selectedUser.state}
                      onValueChange={(value) => setSelectedUser({ ...selectedUser, state: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="abuja">Abuja</SelectItem>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="kano">Kano</SelectItem>
                        <SelectItem value="port_harcourt">Port Harcourt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-lga">LGA</Label>
                    <Select
                      value={selectedUser.lga}
                      onValueChange={(value) => setSelectedUser({ ...selectedUser, lga: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select LGA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ikeja">Ikeja</SelectItem>
                        <SelectItem value="surulere">Surulere</SelectItem>
                        <SelectItem value="abuja_municipal">Abuja Municipal</SelectItem>
                        <SelectItem value="kano_municipal">Kano Municipal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )} */}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditAdminOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAdmin} disabled={isEditingAdmin}>
              {isEditingAdmin ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable Admin Dialog */}
      <Dialog open={isDisableAdminOpen} onOpenChange={setIsDisableAdminOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.status === "a" ? "Disable Admin" : "Enable Admin"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedUser?.status === "active" ? "disable" : "enable"} this admin account?
              {selectedUser?.status === "active"
                ? " They will not be able to access the system until re-enabled."
                : " They will regain access to the system."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDisableAdminOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={selectedUser?.status === "active" ? "destructive" : "default"}
              onClick={handleDisableEnableAdmin}
              disabled={isDisablingAdmin}
            >
              {isDisablingAdmin ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {selectedUser?.status === "active" ? "Disabling..." : "Enabling..."}
                </>
              ) : (
                selectedUser?.status === "active" ? "Disable" : "Enable"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            {roleError && (
              <p className="text-xs text-red-500">{roleError}</p>
            )}
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role-name">Role Name</Label>
                <Input
                  id="edit-role-name"
                  value={selectedRole.name}
                  onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                  placeholder="Enter role name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role-description">Description</Label>
                <Input
                  id="edit-role-description"
                  value={selectedRole.description}
                  onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
                  placeholder="Enter role description"
                />
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 gap-2">
                  {selectedRole.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center justify-between border rounded p-3 bg-gray-50">
                      <span className="text-sm">{permission.name}</span>
                      <Switch
                        checked={permission.granted}
                        onCheckedChange={() =>
                          setSelectedRole({
                            ...selectedRole,
                            permissions: selectedRole.permissions.map((p, i) =>
                              i === index ? { ...p, granted: !p.granted } : p
                            ),
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditRoleOpen(false)
              setRoleError(null)
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditRole} disabled={isEditingRole}>
              {isEditingRole ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Verification Dialog */}
      <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Email Address</DialogTitle>
            <DialogDescription>
              Please enter the 4-digit verification code sent to {newAdminEmail}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="verification-code"
                  type="text"
                  maxLength={4}
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    setVerificationCode(value)
                    setVerificationError(null)
                  }}
                  placeholder="Enter 4-digit code"
                  className="text-center text-lg tracking-widest"
                />
              </div>
              {verificationError && (
                <p className="text-sm text-red-500">{verificationError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerificationDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleVerifyEmail}
              disabled={isVerifying || verificationSuccess}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : verificationSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Verified!
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Verify Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

