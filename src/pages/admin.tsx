import { AlertTriangle, FileSpreadsheet, Lock, Shield, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function Admin() {
  const activityLog = [
    {
      id: 1,
      user: "John Doe",
      action: "Property Registration",
      time: "Today, 10:30 AM",
      ip: "192.168.1.100",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "Property Update",
      time: "Yesterday, 09:15 AM",
      ip: "192.168.2.30",
    },
    // ... rest of the activity log
  ]

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
            Super Admin
          </div>
        </div>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="import">Data Import/Export</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        {/* User Management */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>System Users</CardTitle>
                <CardDescription>Manage user accounts and access</CardDescription>
              </div>
              <Button>Add New User</Button>
            </CardHeader>
            <CardContent>
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
                    {[
                      {
                        name: "John Doe",
                        email: "john.doe@gov.ng",
                        role: "Super Admin",
                        department: "IT",
                        status: "Active",
                      },
                      {
                        name: "Jane Smith",
                        email: "jane.smith@gov.ng",
                        role: "State Admin",
                        department: "FCT",
                        status: "Active",
                      },
                      {
                        name: "Robert Johnson",
                        email: "robert.j@gov.ng",
                        role: "LGA Officer",
                        department: "Abuja Municipal",
                        status: "Inactive",
                      },
                      {
                        name: "Mary Williams",
                        email: "mary.w@gov.ng",
                        role: "State Admin",
                        department: "Lagos",
                        status: "Active",
                      },
                      {
                        name: "James Brown",
                        email: "james.b@gov.ng",
                        role: "LGA Officer",
                        department: "Ikeja",
                        status: "Active",
                      },
                    ].map((user, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{user.name}</td>
                        <td className="p-3">{user.email}</td>
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
                              user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-primary">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600">
                              Disable
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                {[
                  {
                    name: "Super Admin",
                    description: "Full system access with all permissions",
                    users: 1,
                    permissions: [
                      { name: "User Management", granted: true },
                      { name: "Role Management", granted: true },
                      { name: "Property Registration", granted: true },
                      { name: "Property Deletion", granted: true },
                      { name: "Export Data", granted: true },
                      { name: "View Audit Logs", granted: true },
                    ],
                  },
                  {
                    name: "State Admin",
                    description: "Manage properties within assigned state",
                    users: 6,
                    permissions: [
                      { name: "User Management", granted: false },
                      { name: "Role Management", granted: false },
                      { name: "Property Registration", granted: true },
                      { name: "Property Deletion", granted: false },
                      { name: "Export Data", granted: true },
                      { name: "View Audit Logs", granted: true },
                    ],
                  },
                  {
                    name: "LGA Officer",
                    description: "Register and view properties in assigned LGA",
                    users: 24,
                    permissions: [
                      { name: "User Management", granted: false },
                      { name: "Role Management", granted: false },
                      { name: "Property Registration", granted: true },
                      { name: "Property Deletion", granted: false },
                      { name: "Export Data", granted: false },
                      { name: "View Audit Logs", granted: false },
                    ],
                  },
                ].map((role, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{role.name}</h3>
                        <p className="text-sm text-gray-500">{role.description}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {role.users} user{role.users !== 1 ? "s" : ""} with this role
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit Role
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {role.permissions.map((permission, pIndex) => (
                        <div key={pIndex} className="flex items-center justify-between border rounded p-3 bg-gray-50">
                          <span className="text-sm">{permission.name}</span>
                          <Switch checked={permission.granted} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
                <Button variant="outline">Export Log</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLog.map((log, index) => (
                  <div key={index} className="flex items-start border-b pb-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                        log.action.includes("Failed")
                          ? "bg-red-100 text-red-600"
                          : log.user === "System"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {log.action.includes("Failed") ? (
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
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm">
                  Load More
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

